import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
export class LoginDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}
export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refresh_token: string;
}

export class SignInOutput {
  @ApiProperty()
  refresh_token: string;
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
}

export class Tokens {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
}
