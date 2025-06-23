import { CreateUserDto, ReadUserDto } from 'src/users/repositories/users.dto';
import { LoginDTO, Tokens } from './auth.dto';

export interface AuthServiceInterface {
  signUpLocal(createUserDto: CreateUserDto): Promise<ReadUserDto>;
  signInLocal(loginDto: LoginDTO): Promise<Tokens>;
  refreshTokens(userId: string, refreshToken: string): Promise<Tokens>;
  logout(userId: string): Promise<void>;
}
