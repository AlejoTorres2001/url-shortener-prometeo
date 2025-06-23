import {
  IsString,
  IsUrl,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { PaginationQueryDto } from 'src/core/dto/pagination-query.dto';
export class CreateShortenerInputDto {
  @ApiProperty({ 
    required: true,
    description: 'The original URL to be shortened',
    example: 'https://www.example.com/very-long-path-that-needs-shortening'
  })
  @IsUrl()
  @AutoMap()
  originalUrl: string;
}
export class CreateShortenerDto {
  @ApiProperty({ 
    required: true,
    description: 'The original URL to be shortened',
    example: 'https://www.example.com/very-long-path-that-needs-shortening'
  })
  @IsUrl()
  @AutoMap()
  originalUrl: string;

  @ApiProperty({
    required: true,
    description: 'userId of the user creating the short URL',
    example: '1234567890abcdef12345678'
  })
  @IsString()
  @MinLength(24, { message: 'userId must be at least 24 characters long' })
  @MaxLength(24, { message: 'userId must not exceed 24 characters' })
  @AutoMap()
  userId: string;

}

export class UpdateShortenerDto extends PartialType(CreateShortenerDto) {}

export class ReadShortenerDto {

  @ApiProperty()
  @IsString()
  @AutoMap()
  originalUrl: string;

  @ApiProperty()
  @IsString()
  @AutoMap()
  shortCode: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  shortUrl: string;

  @ApiProperty()
  @AutoMap()
  createdAt: Date;
}

export class ShortenerQueryDto extends PaginationQueryDto {
  @ApiProperty({
    required: false,
    description: 'Filter by short code',
  })
  @IsOptional()
  @IsString()
  shortCode?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by original url',
  })
  @IsOptional()
  @IsUrl()
  originalUrl?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by user ID',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}