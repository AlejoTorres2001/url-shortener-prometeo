import { BaseCrudServiceInterface } from 'src/core/service/basecrud.service.interface';
import { CreateShortenerDto, ReadShortenerDto, ShortenerQueryDto, UpdateShortenerDto } from '../repository/shortener.dtos';

export interface ShortenerServiceInterface
  extends BaseCrudServiceInterface<
      CreateShortenerDto,
      ReadShortenerDto,
      UpdateShortenerDto,
      ShortenerQueryDto
    >{
      resolve(shortUrl: string): Promise<ReadShortenerDto>;
    }
