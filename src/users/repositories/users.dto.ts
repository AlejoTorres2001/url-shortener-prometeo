import {
  IsString,
  IsOptional,
  IsAscii,
  MinLength,
  IsEmail,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { PaginationQueryDto } from 'src/core/dto/pagination-query.dto';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsAscii()
  @AutoMap()
  username: string;
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(8)
  @AutoMap()
  password: string;
  @ApiProperty({ required: true })
  @IsEmail()
  @AutoMap()
  email: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ReadUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @AutoMap()
  id: string;
  @ApiProperty({ required: true })
  @IsAscii()
  @AutoMap()
  username: string;
  @ApiProperty({ required: true })
  @IsEmail()
  @AutoMap()
  email: string;
  @ApiProperty({ required: true })
  @IsString()
  @AutoMap()
  refreshToken?: string;
  @ApiProperty({ required: true })
  @AutoMap()
  createdAt: string;
  @ApiProperty({ required: true })
  @AutoMap()
  updatedAt: string;
}

export class UsersQueryDto extends PaginationQueryDto {
  @ApiProperty({
    required: false,
    description: 'username substring of the user',
    type: String,
  })
  @IsOptional()
  @IsAscii()
  username: string;
}
