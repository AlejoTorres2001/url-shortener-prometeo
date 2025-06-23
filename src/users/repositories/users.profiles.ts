import { Injectable } from '@nestjs/common';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { UserEntity } from './users.entity';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './users.dto';
import { DateUtils } from 'src/core/utils/date.utils';

@Injectable()
export class UsersProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      // Map UserEntity to ReadUserDto
      createMap(
        mapper,
        UserEntity,
        ReadUserDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id.toHexString()),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => DateUtils.formatDateToUTC(source.createdAt)),
        ),
        forMember(
          (destination) => destination.updatedAt,
          mapFrom((source) => DateUtils.formatDateToUTC(source.updatedAt)),
        ),
      );

      // Map CreateUserDto to UserEntity
      createMap(mapper, CreateUserDto, UserEntity);

      // Map UpdateUserDto to UserEntity
      createMap(mapper, UpdateUserDto, UserEntity);
    };
  }
}
