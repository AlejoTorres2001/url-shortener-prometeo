import { Module } from '@nestjs/common';
import { EnvironmentModule } from 'src/core/environment/environment.module';
import { ShortenerController } from './shortener.controller';

@Module({
  imports: [EnvironmentModule],
  controllers: [ShortenerController],
  providers: [],
})
export class ShortenerModule {}
