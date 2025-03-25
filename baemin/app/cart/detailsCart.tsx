"use client";
import { Button } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function DetailsCart({ Details }: { Details: any[] }) {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    setRestaurants(Details);
  }, [Details]);

  const handleRemoveFood = (restaurantId: number, foodId: number) => {
    setRestaurants((prevRestaurants) => {
      return prevRestaurants.map((restaurant) => {
        if (restaurant.id === restaurantId) {
          // Remove the food item from the foods array
          restaurant.foods = restaurant.foods.filter(
            (food: any) => food.id !== foodId
          );
        }
        localStorage.setItem("restaurant_data", JSON.stringify(restaurants));

        return restaurant;
      });
    });
  };

  return (
    <>
      {restaurants?.map((restaurant, index) => (
        <div
          key={restaurant.id}
          className="w-full flex flex-col bg-white rounded-md"
        >
          <div className="flex flex-row my-7 ml-8 items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-blue-600" />
            <span className="text-base font-normal">{restaurant.name}</span>
          </div>

          <div className="w-full border-t border-b border-gray-600 py-3">
            {restaurant.foods.map((food: any, idx: number) => (
              <div
                key={food.id}
                className={`w-full grid grid-cols-12 ${
                  idx !== restaurant.foods.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }`}
              >
                <div className="pl-8 col-span-4 flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <div className="relative h-36 w-36">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={food.image_url}
                      alt={food.name}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-base">{food.name}</span>
                    <span className="text-sm text-gray-600">
                      {food.description}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  ₫{food.price.toLocaleString()}
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <input
                    type="number"
                    className="w-16 text-center border border-gray-300 rounded"
                    value={food.quantity}
                    min="1"
                    max="100"
                    readOnly
                  />
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  ₫{(food.price * food.quantity).toLocaleString()}
                </div>
                <div
                  className="col-span-2 flex items-center justify-center cursor-pointer text-red-600"
                  onClick={() => handleRemoveFood(restaurant.id, food.id)}
                >
                  Xóa
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
