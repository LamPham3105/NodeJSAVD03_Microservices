import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        auth_pass: configService.get('REDIS_PASS'),
        ttl: configService.get('REDIS_TTL'), // seconds
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
