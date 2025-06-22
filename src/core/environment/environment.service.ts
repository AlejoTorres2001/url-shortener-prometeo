import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './interfaces/environment.service.interface';

@Injectable()
export class EnvironmentService {
  private readonly isDevelopment: boolean;

  constructor(private configService: ConfigService) {
    this.isDevelopment = this.configService.get<string>('STAGE') !== 'PROD';
  }

  //get an envar with a default value
  get<T>(key: keyof EnvironmentVariables, defaultValue?: T): T {
    const value = this.configService.get<T>(key as string);
    return value !== undefined ? value : (defaultValue as T);
  }
}
