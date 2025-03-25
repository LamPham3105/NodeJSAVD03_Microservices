// DTO for creating an order
export class CreateOrderDto {
    user_id: number;
    order_items: { food_id: number; quantity: number; price: number }[];
    address?: string;
  }