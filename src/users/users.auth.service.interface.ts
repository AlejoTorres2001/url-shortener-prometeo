import { UserEntity } from './repositories/users.entity';

export interface UsersAuthServiceInterface {
  getUserByUserName(userName: string): Promise<UserEntity>;
  getUserByEmail(email: string): Promise<UserEntity>;
  getUserById(userId: string): Promise<UserEntity>;
}
