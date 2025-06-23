import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthServiceInterface } from './auth.service.interface';
import { UsersServiceInterface } from 'src/users/users.service.interface';
import { LoginDTO, SignInOutput } from './auth.dto';
import { CreateUserDto, ReadUserDto } from 'src/users/repositories/users.dto';
import { EnvironmentService } from 'src/core/environment/environment.service';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UsersServiceInterface')
    private readonly usersService: UsersServiceInterface,
    private readonly jwtService: JwtService,
    private readonly environmentService: EnvironmentService,
  ) {}
  async signInLocal(loginDto: LoginDTO): Promise<SignInOutput> {
    const { email, password } = loginDto;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new ForbiddenException('Invalid credentials');
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new ForbiddenException('Invalid credentials');
    const tokens = await this.getTokens(user.id.toString(), user.email);
    const { refreshToken, ...rest } = await this.updateRefreshToken(
      user.id.toString(),
      tokens.refresh_token,
    );
    if (refreshToken === undefined)
      throw new ForbiddenException('Invalid credentials');
    return {
      ...rest,
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
    };
  }

  async signUpLocal(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };
    const newUser = await this.usersService.create(userToCreate);
    return newUser;
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        {
          expiresIn: this.environmentService.get<number>(
            'JWT_ACCESS_TOKEN_EXPIRATION',
          ),
          secret: this.environmentService.get<string>(
            'JWT_ACCESS_TOKEN_SECRET',
          ),
        },
      ),
      this.jwtService.signAsync(
        { userId, email },
        {
          expiresIn: this.environmentService.get<number>(
            'JWT_REFRESH_TOKEN_EXPIRATION',
          ),
          secret: this.environmentService.get<string>(
            'JWT_REFRESH_TOKEN_SECRET',
          ),
        },
      ),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async logout(userId: string) {
    await this.updateRefreshToken(userId, '');
  }
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.hashRefreshToken)
      throw new ForbiddenException('Invalid credentials');
    const refreshTokenMatch = await user.validateRefreshToken(refreshToken);
    if (!refreshTokenMatch) throw new ForbiddenException('Invalid credentials');
    const tokens = await this.getTokens(user.id.toString(), user.email);
    await this.updateRefreshToken(user.id.toString(), tokens.refresh_token);
    return tokens;
  }
  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<ReadUserDto> {
    const user = await this.usersService.getUserById(userId);
    user.refreshToken = refreshToken;
    return await this.usersService.update(user.id.toString(), user);
  }
}
