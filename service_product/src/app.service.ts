import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private elasticService: ElasticsearchService,
  ) {}

  async getBanner() {
    return await this.prismaService.banner.findMany();
  }

  async getCategories() {
    return await this.prismaService.categories.findMany({
      include: { foods: true },
    });
  }

  async getCategoryById(id: number) {
    return await this.prismaService.categories.findUnique({
      where: { id },
      include: { foods: true },
    });
  }

  async getRestaurants() {
    const restaurants = await this.prismaService.restaurants.findMany({
      where: {
        open_time: { gt: new Date() },
      },
    });

    return {
      title:
        restaurants.length != 0
          ? 'Hôm Nay Ăn Gì'
          : 'Không có quán nào hoạt động',
      restaurants: restaurants,
    };
  }

  async getPaginationRestaurants(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ) {
    const skip = (page - 1) * limit;
    const numericLimit = Number(limit);

    if (search) {
      await this.elasticService.index({
        index: 'demo_restaurant',
        document: {
          name: 'restaurant',
          category: 'restaurant',
          price: 0,
          in_stock: true,
          quantity: 0,
          create_date: Date.now(),
        },
        refresh: true,
      });

      const searchResults = this.elasticService.search({
        index: 'demo_restaurant',
      });

      if ((await searchResults).hits.hits.length > 0) {
        const esData = (await searchResults).hits.hits.map(
          (hit) => hit._source,
        );
        await this.cacheManager.set(
          `search_${search}_${page}_${limit}`,
          esData,
        );
        return esData;
      }

      // If not found in Elasticsearch, fetch from PostgreSQL
      const restaurants = await this.prismaService.restaurants.findMany({
        where: { name: { contains: search, mode: 'insensitive' } },
        skip,
        take: numericLimit,
        include: { foods: true },
      });

      // Store in Elasticsearch for future searches
      for (const restaurant of restaurants) {
        await this.elasticService.index({
          index: 'demo_restaurant',
          document: restaurant,
          refresh: true,
        });
      }

      // Cache PostgreSQL results before returning
      await this.cacheManager.set(
        `search_${search}_${page}_${limit}`,
        restaurants,
      );
      return restaurants;
    }

    // 🔵 Nếu không có từ khóa, lấy từ PostgreSQL (có cache Redis)
    const cacheKey = `pagination_${page}_${limit}`;
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const restaurants = await this.prismaService.restaurants.findMany({
      skip,
      take: numericLimit,
      include: { foods: true },
    });

    const processedRestaurants = restaurants.map((restaurant) => ({
      ...restaurant,
      foods: restaurant.foods.map((food) => ({
        ...food,
        max_price: food.max_price ? food.max_price.toNumber() : 0,
      })),
    }));

    const response = {
      data: processedRestaurants,
      meta: {
        total: await this.prismaService.restaurants.count(),
        page,
        last_page: Math.ceil(
          (await this.prismaService.restaurants.count()) / numericLimit,
        ),
      },
    };

    // Always cache the response before returning
    await this.cacheManager.set(cacheKey, response);
    return response;
  }

  async getRestaurantById(id: number) {
    const restaurant = await this.prismaService.restaurants.findUnique({
      where: { id },
      include: { foods: true },
    });

    if (!restaurant) {
      return null;
    }

    // Process foods and convert Decimal to number for max_price
    const processedFoods = restaurant.foods.map((food) => ({
      ...food,
      max_price: food.max_price ? food.max_price.toNumber() : 0,
    }));

    return {
      ...restaurant,
      foods: processedFoods,
    };
  }
}
