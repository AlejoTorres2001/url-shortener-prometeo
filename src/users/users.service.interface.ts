import { BaseCrudServiceInterface } from 'src/core/service/interfaces/basecrud.service.interface';
import {
  CreateUserDto,
  ReadUserDto,
  UpdateUserDto,
  UsersQueryDto,
} from './repositories/users.dto';
import { UsersAuthServiceInterface } from './users.auth.service.interface';
export interface UsersServiceInterface
  extends BaseCrudServiceInterface<
      CreateUserDto,
      ReadUserDto,
      UpdateUserDto,
      UsersQueryDto
    >,
    UsersAuthServiceInterface {}
