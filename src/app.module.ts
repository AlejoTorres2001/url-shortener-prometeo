import { Module } from '@nestjs/common';
import { EnvironmentModule } from './core/environment/environment.module';
import { MongoDBModule } from './core/modules/mongodb.module';
import { AutoMapperConfigModule } from './core/modules/automapper.config.module';
import { ApiModule } from './api/api.module';
import { RedisModule } from './core/modules/redis.module';

@Module({
  imports: [
    EnvironmentModule,
    AutoMapperConfigModule,
    MongoDBModule,
    ApiModule,
    RedisModule.forRootAsync()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
