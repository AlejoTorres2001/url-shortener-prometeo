import { Module } from '@nestjs/common';
import { EnvironmentModule } from 'src/core/environment/environment.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [EnvironmentModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
