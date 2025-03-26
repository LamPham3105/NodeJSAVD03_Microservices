import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTIC_NODE'),
        auth: {
          username: configService.get('ELASTIC_USER'),
          password: configService.get('ELASTIC_PASS'),
        },
        tls: {
          rejectUnauthorized: false, // bỏ qua kiểm tra xác thực chứng chỉ SSL (HTTPS)
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ElasticModule {}
