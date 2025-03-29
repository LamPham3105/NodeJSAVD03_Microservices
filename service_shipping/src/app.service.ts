import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateShippingDto, UpdateShippingDto } from './dto/shipping.dto';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async createShipping(order_id: number, delivery_status: string) {
    return this.prisma.shipping.create({
      data: {
        order_id,
        delivery_status,
      },
    });
  }

  async getAllShipping(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await this.prisma.shipping.count();
    const shipments = await this.prisma.shipping.findMany({
      skip,
      take: limit,
    });

    return {
      data: shipments,
      meta: { total, page, last_page: Math.ceil(total / limit) },
    };
  }

  async getShippingById(id: number) {
    const shipping = await this.prisma.shipping.findUnique({ where: { id } });
    if (!shipping)
      return { success: false, message: 'Shipping record not found' };
    return { success: true, shipping };
  }

  async updateShipping(id: number, data: UpdateShippingDto) {
    return this.prisma.shipping.update({ where: { id }, data });
  }
}
