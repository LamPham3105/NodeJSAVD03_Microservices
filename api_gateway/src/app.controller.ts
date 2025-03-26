import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,@Inject("RESTAURANT_NAME") private restaurantService: ClientProxy,) {}

  @Post("/banner")
  async getBanner() {
    let bannerData = await lastValueFrom(this.restaurantService.send("get_banner", ""));
    return bannerData;
  }

  @Post("/categories")
  async getCategories() {
    let categoriesData = await lastValueFrom(this.restaurantService.send("get_categories", ""));
    return categoriesData;
  }

  @Post("/categories/:id")
  async getCategoryById(@Param('id') id: number) {
    let categoryByIDData = await lastValueFrom(this.restaurantService.send("get_category_byID", id));
    return categoryByIDData;
  }
}
