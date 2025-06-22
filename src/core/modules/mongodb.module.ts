import { Module, OnApplicationBootstrap, Injectable } from '@nestjs/common';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentService } from 'src/core/environment/environment.service';
import { EnvironmentModule } from 'src/core/environment/environment.module';
import { DBConnectionsEnum } from 'src/core/environment/interfaces/environment.service.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseConnectionLogger implements OnApplicationBootstrap {
  constructor(
    @InjectDataSource(DBConnectionsEnum.BACKEND)
    private readonly backendDataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    if (this.backendDataSource.isInitialized) {
      console.log('BACKEND DB connection ready');
    } else {
      try {
        await this.backendDataSource.initialize();
        console.log('BACKEND DB connection established');
      } catch (error) {
        console.error('Error connecting to BACKEND DB:', error);
      }
    }
  }
}

@Module({
  imports: [
    //! backendDB
    TypeOrmModule.forRootAsync({
      name: DBConnectionsEnum.BACKEND,
      imports: [ConfigModule, EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (envService: EnvironmentService) => ({
        type: 'mongodb',
        url: envService.get(
          envService.get<string>('STAGE') === 'DEV'
            ? 'DEV_BACKEND_MONGO_DATABASE_URI'
            : 'PROD_BACKEND_MONGO_DATABASE_URI',
        ),
        database:
          envService.get<string>('STAGE') === 'DEV'
            ? envService.get('DEV_BACKEND_MONGO_DATABASE_NAME')
            : envService.get('PROD_BACKEND_MONGO_DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: envService.get<string>('STAGE') === 'DEV',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        useUnifiedTopology: true,
        ssl: true,
        extra: {
          maxPoolSize: 50,
          minPoolSize: 10,
        },
      }),
    }),
  ],
  providers: [DatabaseConnectionLogger, EnvironmentModule, EnvironmentService],
})
export class MongoDBModule {}
