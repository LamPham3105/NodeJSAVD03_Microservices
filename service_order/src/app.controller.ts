import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('create_order')
  async createOrder(@Payload() createOrderDto: CreateOrderDto) {
    return this.appService.createOrder(createOrderDto);
  }

  @MessagePattern('get_orders')
  async getOrders() {
    return this.appService.getOrders();
  }
}
