import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register(
    [
      {
        name: "ORDER_NAME",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://admin:1234@localhost:5672"],
          queue: "order_queue",
          queueOptions: {
            durable: false
          }
        }
      },
      {
        name: "RESTAURANT_NAME",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://admin:1234@localhost:5672"],
          queue: "product_queue",
          queueOptions: {
            durable: false
          }
        }
      },
      {
        name: "USER_NAME",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://admin:1234@localhost:5672"],
          queue: "user_queue",
          queueOptions: {
            durable: false
          }
        }
      }
    ]
  )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
