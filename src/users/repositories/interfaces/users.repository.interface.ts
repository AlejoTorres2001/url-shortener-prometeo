import { UserEntity } from 'src/users/repositories/users.entity';
import { BaseInterfaceRepository } from '../../../core/repositories/interfaces/base.abstract.repository.interface';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UsersRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
