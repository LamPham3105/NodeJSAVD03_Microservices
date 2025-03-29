import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './dto/order-status.enum';
import { PrismaService } from './prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    private prismaService: PrismaService,
    @Inject('SHIPPING_NAME') private shippingService: ClientProxy,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const { user_id, order_items, address } = dto;

    if (!user_id || !order_items || order_items.length === 0) {
      throw new Error('Invalid order data');
    }

    const total_price = order_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await this.prismaService.orders.create({
      data: {
        user_id,
        total_price,
        status: OrderStatus.PENDING,
        address,
        order_items: {
          create: order_items.map((item) => ({
            food_id: item.food_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { order_items: true },
    });

    await this.prismaService.order_items.createMany({
      data: order_items.map((item) => ({
        order_id: order.id,
        food_id: item.food_id,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    await lastValueFrom(
      this.shippingService.emit('create_shipping', {
        order_id: order.id,
        delivery_status: 'pending',
      }),
    );

    return order;
  }

  async getOrders() {
    return this.prismaService.orders.findMany({
      include: { order_items: true },
    });
  }
}
