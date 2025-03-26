import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    private elasticService: ElasticsearchService,
  ) {}

  @MessagePattern("get_restaurants")
  async getRestaurants() {
    const cachedRestaurants = await this.cacheManager.get('restaurant_list');
    if (cachedRestaurants) {
      return cachedRestaurants;
    }
    const products = await this.appService.getRestaurants();
    await this.cacheManager.set('restaurant_list', products, { ttl: 300 });
    return products;
  }

  @MessagePattern("get_restaurants_pagination")
  async getRestaurantsWithPagination(
    @Payload() page: number = 1,
    @Payload() limit: number = 10, 
    @Payload() search: string = '',
  ) {
    const cacheKey = `pagination_${page}_${limit}_${search}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const data = await this.appService.getPaginationRestaurants(page, limit, search);
    await this.cacheManager.set(cacheKey, data, { ttl: 300 });
    return data;
  }

  @Get(':id')
  async getRestaurantById(@Param('id') id: number) {
    return this.appService.getRestaurantById(+id);
  }

  @MessagePattern("get_elastic")
  async getElastic(@Payload() data) {

    await this.elasticService.index({
      index: "demo_restaurant",
      document: {
        "name": "restaurant",
        "category": "restaurant",
        "price": 0,
        "in_stock": true,
        "quantity": 0,
        "create_date": Date.now()
      },
      refresh: true
    })

    let result = this.elasticService.search({
      index: "demo_restaurant",

    });

    return result;
  }

  @MessagePattern("get_banner")
  async getBanner() {
    return this.appService.getBanner();
  }

  @MessagePattern("get_categories")
  async getCategories() {
    return this.appService.getCategories();
  }

  @MessagePattern("get_category_byID")
  async getCategoryById(@Payload() id: number) {
    return this.appService.getCategoryById(+id);
  }
}
