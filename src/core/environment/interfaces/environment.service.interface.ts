/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum StageEnum {
  DEV = 'DEV',
  PROD = 'PROD',
}

export enum DBConnectionsEnum {
  BACKEND = 'backendDB',
}
export class EnvironmentVariables {
  @IsEnum(StageEnum)
  @IsNotEmpty()
  STAGE: StageEnum;

  @IsString()
  @IsNotEmpty()
  TZ: string;

  @IsString()
  @IsOptional()
  DEV_APP_DOMAIN?: string;

  @IsString()
  @IsNotEmpty()
  PROD_APP_DOMAIN: string;

  @IsInt()
  @Type(() => Number)
  PORT: number;

  @Transform(
    ({ value }) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    },
    { toClassOnly: true },
  )
  @IsArray()
  @ArrayNotEmpty()
  ALLOWED_DOMAINS: string[];

  @IsString()
  @IsNotEmpty()
  PROD_BACKEND_MONGO_DATABASE_URI: string;

  @IsString()
  @IsNotEmpty()
  PROD_BACKEND_MONGO_DATABASE_NAME: string;

  @IsString()
  @IsNotEmpty()
  DEV_BACKEND_MONGO_DATABASE_URI: string;

  @IsString()
  @IsNotEmpty()
  DEV_BACKEND_MONGO_DATABASE_NAME: string;

  @IsString()
  @IsNotEmpty()
  DEV_REDIS_HOST: string;

  @IsString()
  @IsNotEmpty()
  DEV_REDIS_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  PROD_REDIS_HOST: string;

  @IsString()
  @IsNotEmpty()
  PROD_REDIS_PASSWORD: string;

  @IsInt()
  @Type(() => Number)
  REDIS_PORT: number;

  @IsBoolean()
  @Type(() => Boolean)
  REDIS_TLS: boolean;

  @IsInt()
  @Type(() => Number)
  REDIS_DB: number;

  @IsInt()
  @Type(() => Number)
  JWT_ACCESS_TOKEN_EXPIRATION: number;

  @IsInt()
  @Type(() => Number)
  JWT_REFRESH_TOKEN_EXPIRATION: number;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  PROD_SHORTENER_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  DEV_SHORTENER_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  REDIS_USERNAME: string;
}
