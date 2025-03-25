import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './redis_cache/redis_cache.module';
import { ElasticModule } from './elastic/elastic.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), RedisCacheModule, ElasticModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
