import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateShippingDto, UpdateShippingDto } from './dto/shipping.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('create_shipping')
  async createShipping(
    @Payload() data: { order_id: number; delivery_status: string },
  ) {
    return this.appService.createShipping(data.order_id, data.delivery_status);
  }

  @MessagePattern('get_shipping')
  async getAllShipping(@Payload() data: { page: number; limit: number }) {
    return this.appService.getAllShipping(
      Number(data.page),
      Number(data.limit),
    );
  }

  @MessagePattern('get_shipping_byID')
  async getShippingById(@Payload('id') id: string) {
    return this.appService.getShippingById(Number(id));
  }

  @EventPattern('update_shipping')
  async updateShipping(
    @Payload() data: { id: string; updateShippingDto: UpdateShippingDto },
  ) {
    return this.appService.updateShipping(
      Number(data.id),
      data.updateShippingDto,
    );
  }
}
