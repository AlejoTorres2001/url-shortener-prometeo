import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentModule } from '../environment/environment.module';
import { EnvironmentService } from '../environment/environment.service';
import Redis, { RedisOptions } from 'ioredis';
import { RedisService } from '../service/redis.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({})
export class RedisModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule, EnvironmentModule],
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: async (env: EnvironmentService) => {
            const isDev = env.get<string>('STAGE') === 'DEV';
            const host = env.get<string>(isDev ? 'DEV_REDIS_HOST' : 'PROD_REDIS_HOST')!;
            const password = env.get<string>(isDev ? 'DEV_REDIS_PASSWORD' : 'PROD_REDIS_PASSWORD')!;
            const username = env.get<string>('REDIS_USERNAME') || undefined;
            const port = env.get<number>('REDIS_PORT')!;
            const db = env.get<number>('REDIS_DB')!;
            const tlsEnabled = env.get<string>('REDIS_TLS') === 'true';

            const options: RedisOptions = {
              host,
              port,
              password,
              username,
              db,
               tls: tlsEnabled
                ? { servername: host, rejectUnauthorized: false }
                : undefined,
              maxRetriesPerRequest: null,
              reconnectOnError: (err) => {
                const targetErr = 'READONLY';
                if (err.message.includes(targetErr)) {
                  return true;
                }
                return false;
              },

              //!Exponential backoff
              retryStrategy: (times) => {
                const delay = Math.min(times * 100, 2000);
                console.log(`Redis retry in ${delay}ms (attempt ${times})`);
                return delay;
              },
              

              enableOfflineQueue: false,//! queue commands during disconnection
              enableReadyCheck: true,
              connectTimeout: 10000,        //!10s to connect
              family: 4,
              keepAlive: 30000,
              noDelay: true,
            };

            const client = new Redis(options);

            client.on('connect', () => console.log('Redis connected'));
            client.on('ready', () => console.log('Redis ready to use'));
            client.on('error', err => console.error('Redis error', err));
            client.on('close', () => console.warn('Redis connection closed'));
            client.on('reconnecting', time => console.log(`Redis reconnecting in ${time}ms`));

            return client;
          },
          inject: [EnvironmentService],
        },
        RedisService,
      ],
      exports: [REDIS_CLIENT, RedisService],
    };
  }
}
