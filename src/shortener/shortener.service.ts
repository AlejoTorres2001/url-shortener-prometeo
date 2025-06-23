import {
  Injectable,
  Inject,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ObjectId } from 'mongodb';
import { createHash } from 'crypto';
import { ShortenerServiceInterface } from './interfaces/shortener.service.interface';
import { ShortenerRepositoryInterface } from './repository/interfaces/shortener.repository.interface';
import { RedisService } from 'src/core/service/redis.service';
import {
  CreateShortenerDto,
  ReadShortenerDto,
  ShortenerQueryDto,
  UpdateShortenerDto,
} from './repository/shortener.dtos';
import { ShortenerEntity } from './repository/shortener.entity';
import { EnvironmentService } from 'src/core/environment/environment.service';
import axios from 'axios';
@Injectable()
export class ShortenerService implements ShortenerServiceInterface {
  private readonly ORIG_KEY = 'shorturl:orig:'; // originalUrl → shortCode
  private readonly CODE_KEY = 'shorturl:code:'; // shortCode → originalUrl
  private readonly QUEUE_KEY = 'shorturl_queue';
  private readonly MAX_CACHE = 100;

  constructor(
    @Inject('ShortenerRepositoryInterface')
    private readonly shortenerRepository: ShortenerRepositoryInterface,
    private readonly environmentService: EnvironmentService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly redisService: RedisService,
  ) {}

  async create(createDto: CreateShortenerDto): Promise<ReadShortenerDto> {
    const { originalUrl, userId } = createDto;
    const origKey = this.ORIG_KEY + originalUrl;
    const baseUrl = this.environmentService.get(
      this.environmentService.get<string>('STAGE') === 'DEV'
        ? 'DEV_SHORTENER_BASE_URL'
        : 'PROD_SHORTENER_BASE_URL',
    ) as string;

    //! Only shorten URLs that are safe
    const safe = await this.isSafe(originalUrl);
    if (!safe) {
      throw new BadRequestException(
        'The URL is unsafe and cannot be shortened.',
      );
    }

    //! check in cache first
    const cachedCode = await this.redisService.get(origKey);
    if (cachedCode) {
      // Update LRU queue
      await this.cachePush(originalUrl, cachedCode);
      // Map cached value to ReadShortener
      const entity = this.shortenerRepository.create({
        originalUrl,
        shortCode: cachedCode,
        userId,
        shortUrl: `${baseUrl}/${cachedCode}`,
      });
      return this.mapper.map(entity, ShortenerEntity, ReadShortenerDto);
    }

    //! not in cache -> Check DB
    const existing = await this.shortenerRepository.findByCondition(
      {
        where: { originalUrl },
      },
      false,
    );
    //! add to cache if exists -> considered a hot URL
    if (existing) {
      await this.cachePush(originalUrl, existing.shortCode);
      return this.mapper.map(existing, ShortenerEntity, ReadShortenerDto);
    }

    //! deterministic SHA-256 truncated
    let hash = createHash('sha256').update(originalUrl).digest('hex');
    let shortCode = hash.slice(0, 8);
    let counter = 1;
    while (await this.shortenerRepository.exists(shortCode)) {
      hash = createHash('sha256')
        .update(originalUrl + counter++)
        .digest('hex');
      shortCode = hash.slice(0, 8);
    }

    //! write to db
    const entity = this.shortenerRepository.create({
      originalUrl,
      shortCode,
      userId,
      shortUrl: `${baseUrl}/${shortCode}`,
    });
    const saved = await this.shortenerRepository.save(entity);
    //! update cache with new entry
    await this.redisService.set(origKey, shortCode);
    await this.redisService.set(this.CODE_KEY + shortCode, originalUrl);
    await this.cachePush(originalUrl, shortCode);

    return this.mapper.map(saved, ShortenerEntity, ReadShortenerDto);
  }

  async findAll(query: ShortenerQueryDto): Promise<ReadShortenerDto[]> {
    const { limit, offset, originalUrl } = query;
    const filter = originalUrl
      ? { originalUrl: { $regex: new RegExp(originalUrl, 'i') } }
      : {};
    const found = await this.shortenerRepository.findAll({
      where: filter,
      skip: offset,
      take: limit,
    });
    return this.mapper.mapArray(found, ShortenerEntity, ReadShortenerDto);
  }

  async findOne(id: string): Promise<ReadShortenerDto> {
    const entity = await this.shortenerRepository.findOneById(new ObjectId(id));
    return this.mapper.map(entity, ShortenerEntity, ReadShortenerDto);
  }

  async update(
    id: string,
    updateDto: UpdateShortenerDto,
  ): Promise<ReadShortenerDto> {
    const preload = await this.shortenerRepository.preload({
      id: new ObjectId(id),
      ...updateDto,
    });
    const saved = await this.shortenerRepository.save(preload);
    return this.mapper.map(saved, ShortenerEntity, ReadShortenerDto);
  }

  async remove(id: string): Promise<ReadShortenerDto> {
    const entity = await this.shortenerRepository.findOneById(new ObjectId(id));
    const removed = await this.shortenerRepository.remove(entity);
    return this.mapper.map(removed, ShortenerEntity, ReadShortenerDto);
  }

  async createMany(dtos: CreateShortenerDto[]): Promise<ReadShortenerDto[]> {
    const entities = dtos.map((dto) => this.shortenerRepository.create(dto));
    const saved = await this.shortenerRepository.saveMany(entities);
    return this.mapper.mapArray(saved, ShortenerEntity, ReadShortenerDto);
  }

  async resolve(shortUrl: string): Promise<ReadShortenerDto> {
    const shortCode = this.extractShortCode(shortUrl);
    if (!shortCode) {
      throw new BadRequestException('Invalid short URL format');
    }

    const codeKey = this.CODE_KEY + shortCode;
    //!cache lookup shortCode → originalUrl
    const cachedOriginal = await this.redisService.get(codeKey);
    if (cachedOriginal) {
      //! update LRU queue
      await this.cachePush(cachedOriginal, shortCode);
      const entity = this.shortenerRepository.create({
        originalUrl: cachedOriginal,
        shortCode,
        shortUrl,
      });
      return this.mapper.map(entity, ShortenerEntity, ReadShortenerDto);
    }

    //!DB lookup using shortCode
    const found = await this.shortenerRepository.findByCondition(
      { where: { shortCode } },
      false,
    );
    if (!found) {
      throw new BadRequestException('Short code not found');
    }

    //! set bidirectional cache and update LRU queue
    await this.redisService.set(codeKey, found.originalUrl);
    await this.redisService.set(this.ORIG_KEY + found.originalUrl, shortCode);
    await this.cachePush(found.originalUrl, shortCode);

    return this.mapper.map(found, ShortenerEntity, ReadShortenerDto);
  }

  private async cachePush(url: string, code: string) {
    //! update
    await this.redisService.lpush(this.QUEUE_KEY, url);
    const len = await this.redisService.llen(this.QUEUE_KEY);
    if (len > this.MAX_CACHE) {
      //! evict the oldest entry
      const evicted = await this.redisService.rpop(this.QUEUE_KEY);
      if (evicted) {
        //! clean both directions
        await this.redisService.del(this.ORIG_KEY + evicted);
        const code = await this.redisService.get(this.ORIG_KEY + evicted);
        if (code) {
          await this.redisService.del(this.CODE_KEY + code);
        }
      }
    }
  }
  private extractShortCode(shortUrl: string): string {
    try {
      const url = new URL(shortUrl);
      const parts = url.pathname.split('/').filter(Boolean);
      return parts.pop() || '';
    } catch {
      const parts = shortUrl.split('/').filter(Boolean);
      return parts.pop() || '';
    }
  }

  private async isSafe(url: string): Promise<boolean> {
    const body = {
      client: { clientId: 'url-shortener', clientVersion: '1.0.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },
    };

    try {
      const { data } = await axios.post(
        `${this.environmentService.get<string>('GSB_API_URL')}?key=${this.environmentService.get<string>('GSB_API_KEY')}`,
        body,
      );
      return !data.matches;
    } catch (err) {
      throw new HttpException(
        'Google Safe Browsing API error',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
