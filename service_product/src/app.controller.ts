import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    private elasticService: ElasticsearchService,
  ) {}

  // Get restaurants without pagination (maybe for a simple list)
  @Get()
  async getRestaurants() {
    return this.appService.getRestaurants();
  }

  // Get restaurants with pagination and search, use a custom path like '/pagin'
  @Get('pagination') // Custom path for pagination and search
  async getRestaurantsWithPagination(
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to 10 items per page
    @Query('search') search: string = '', // Default to an empty string for search
  ) {
    return this.appService.getPaginationRestaurants(page, limit, search);
  }

  // Existing method to get a specific restaurant by id
  @Get(':id') // Use :id to get restaurant by ID
  async getRestaurantById(@Param('id') id: number) {
    return this.appService.getRestaurantById(+id);
  }
}
