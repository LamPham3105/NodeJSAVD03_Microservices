import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    private prismaService: PrismaService
  ) { }

  async getBanner() {
    return this.prismaService.banner.findMany();
  }

  async getCategories() {
    return this.prismaService.categories.findMany({
      include: { foods: true },
    });
  }

  async getCategoryById(id: number) {
    return this.prismaService.categories.findUnique({
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

    const restaurants = await this.prismaService.restaurants.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      skip,
      take: numericLimit, // Use the converted number here
      include: {
        foods: true, // Include related foods
      },
    });

    const processedRestaurants = restaurants.map((restaurant) => {
      const processedFoods = restaurant.foods.map((food) => ({
        ...food,
        max_price: food.max_price ? food.max_price.toNumber() : 0, // Convert Decimal to number
      }));

      return {
        ...restaurant,
        foods: processedFoods,
      };
    });

    return {
      data: processedRestaurants,
      meta: {
        total: await this.prismaService.restaurants.count(),
        page,
        last_page: Math.ceil(
          (await this.prismaService.restaurants.count()) / numericLimit,
        ),
      },
    };
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
