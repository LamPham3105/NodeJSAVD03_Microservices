import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class CreateOrderDto {
  user_id: number;
  order_items: { food_id: number; quantity: number; price: number }[];
  address?: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('RESTAURANT_NAME') private restaurantService: ClientProxy,
    @Inject('USER_NAME') private userService: ClientProxy,
    @Inject('ORDER_NAME') private orderService: ClientProxy,
  ) {}

  @Get('/banners')
  async getBanner() {
    let bannerData = await lastValueFrom(
      this.restaurantService.send('get_banner', ''),
    );

    return bannerData;
  }

  @Get('/categories')
  async getCategories() {
    let categoriesData = await lastValueFrom(
      this.restaurantService.send('get_categories', ''),
    );
    return categoriesData;
  }

  @Get('/categories/:id')
  async getCategoryById(@Param('id') id: number) {
    let categoryByIDData = await lastValueFrom(
      this.restaurantService.send('get_category_byID', id),
    );
    return categoryByIDData;
  }

  @Get('/users/:id')
  async getUserById(@Param('id') id: number) {
    let userByIDData = await lastValueFrom(
      this.userService.send('get_user_byID', id),
    );
    return userByIDData;
  }

  @Post('/orders')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const orderData = await lastValueFrom(
      this.orderService.emit('create_order', createOrderDto),
    );
    return orderData;
  }

  @Get('/orders')
  async getOrders() {
    let orderData = await lastValueFrom(
      this.orderService.send('get_orders', ''),
    );
    return orderData;
  }

  @Post('/auth/signup')
  async signUp(@Body() userData: any) {
    let user = await lastValueFrom(this.userService.send('signup', userData));
    return { message: 'User registered successfully', user };
  }

  @Post('/auth/login')
  async login(@Body() userData: any) {
    let user = await lastValueFrom(this.userService.send('login', userData));
    return { message: 'User login successfully', user };
  }

  @Get('/restaurants')
  async getRestaurants() {
    return await lastValueFrom(
      this.restaurantService.send('get_restaurants', ''),
    );
  }

  @Get('/restaurants/pagination')
  async getRestaurantsWithPagination(
    @Query('page') page: string = '1', // Default to page 1
    @Query('limit') limit: string = '10', // Default to 10 items per page
    @Query('search') search: string = '', // Default to an empty string for search
  ) {
    // Convert page & limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const response = await lastValueFrom(
      this.restaurantService.send('get_restaurants_pagination', {
        page: pageNumber,
        limit: limitNumber,
        search,
      }),
    );

    return response;
  }

  @Get('/restaurants/:id')
  async getRestaurantById(@Param('id') id: number) {
    return await lastValueFrom(
      this.restaurantService.send('get_restaurants_byID', id),
    );
  }
}
