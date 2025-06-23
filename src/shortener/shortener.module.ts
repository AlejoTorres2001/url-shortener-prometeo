import { Module } from '@nestjs/common';
import { EnvironmentModule } from 'src/core/environment/environment.module';
import { ShortenerController } from './shortener.controller';
import { ShortenerRepository } from './repository/shortener.repository';
import { ShortenerService } from './shortener.service';
import { ShortenerProfile } from './repository/shortener.profiles';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortenerEntity } from './repository/shortener.entity';
import { DBConnectionsEnum } from 'src/core/environment/interfaces/environment.service.interface';

@Module({
  imports: [EnvironmentModule,TypeOrmModule.forFeature([ShortenerEntity], DBConnectionsEnum.BACKEND)],
  controllers: [ShortenerController],
  providers: [ {
        provide: 'ShortenerRepositoryInterface',
        useClass: ShortenerRepository,
      },
      {
        provide: 'ShortenerServiceInterface',
        useClass: ShortenerService,
      },
      ShortenerProfile,
    ],
    exports: ['ShortenerServiceInterface'],
})
export class ShortenerModule {}
