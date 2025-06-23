import { Module } from '@nestjs/common';
import { EnvironmentModule } from 'src/core/environment/environment.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/auth/guards';
import { ShortenerModule } from 'src/shortener/shortener.module';

@Module({
  imports: [EnvironmentModule, UsersModule, AuthModule,ShortenerModule],
  controllers: [ApiController],
  providers: [
    ApiService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class ApiModule {}
