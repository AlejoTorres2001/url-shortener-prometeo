import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/repositories/users.entity';
import { MongoRepository } from 'typeorm';
import { BaseAbstractRepository } from '../../core/repositories/base.abstract.repository';
import { UsersRepositoryInterface } from './interfaces/users.repository.interface';
import { DBConnectionsEnum } from 'src/core/environment/interfaces/environment.service.interface';

@Injectable()
export class UsersRepository
  extends BaseAbstractRepository<UserEntity>
  implements UsersRepositoryInterface
{
  constructor(
    @InjectRepository(UserEntity, DBConnectionsEnum.BACKEND)
    private readonly UserRepository: MongoRepository<UserEntity>,
  ) {
    super(UserRepository);
  }
}
