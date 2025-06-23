import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseAbstractRepository } from '../../core/repositories/base.abstract.repository';
import { DBConnectionsEnum } from 'src/core/environment/interfaces/environment.service.interface';
import { ShortenerEntity } from './shortener.entity';
import { ShortenerRepositoryInterface } from './interfaces/shortener.repository.interface';

@Injectable()
export class ShortenerRepository
  extends BaseAbstractRepository<ShortenerEntity>
  implements ShortenerRepositoryInterface
{
  constructor(
    @InjectRepository(ShortenerEntity, DBConnectionsEnum.BACKEND)
    private readonly shortenerRepository: MongoRepository<ShortenerEntity>,
  ) {
    super(shortenerRepository);
  }
  async exists(shortCode: string): Promise<boolean> {
    const count = await this.shortenerRepository.count({
      where: { shortCode },
    });
    return count > 0;
  }
}