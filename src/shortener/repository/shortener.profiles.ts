import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap,Mapper } from '@automapper/core';
import { ShortenerEntity } from './shortener.entity';
import { CreateShortenerDto, ReadShortenerDto } from './shortener.dtos';

@Injectable()
export class ShortenerProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      // Map from ShortenerEntity to ReadUrlDto
      createMap(
        mapper,
        ShortenerEntity,
        ReadShortenerDto
      );

      // Map from CreateShortenerDto to ShortenerEntity
      createMap(
        mapper,
        CreateShortenerDto,
        ShortenerEntity
      );
    };
  }
}