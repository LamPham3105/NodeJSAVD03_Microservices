"use client";

import HeaderNav from "@/components/headerNav";
import ScrollBar from "@/components/scrollBar";
import ScrollFood from "@/components/scrollFood";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DetailsCart from "./detailsCart";
import { Button } from "antd";

export default function Home() {
  const [cartData, setCartData] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    // Lấy dữ liệu giỏ hàng từ localStorage
    const storedData = localStorage.getItem("restaurant_data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCartData(parsedData);

      // Tính tổng số lượng sản phẩm và tổng tiền
      let total = 0;
      let items = 0;
      parsedData.forEach((restaurant: any) => {
        restaurant.foods.forEach((food: any) => {
          total += food.price * food.quantity;
          items += food.quantity;
        });
      });

      setTotalAmount(total);
      setTotalItems(items);
    }

    const data = localStorage.getItem("data");
    if (data) {
      setIsLogin(true);
    }
  }, []);

  if (!isLogin) return <></>;

  return (
    <>
      <div className="flex flex-row w-full h-20 bg-white">
        <div className="w-1/2 h-full flex flex-row items-center gap-3">
          <div className="ml-10 text-4xl text-beamin font-bold">
            <ShoppingCartOutlined />
          </div>
          <div className="text-2xl text-beamin">|</div>
          <div className="text-3xl text-beamin font-bold">Giỏ hàng</div>
        </div>
        <div className="w-1/2 h-full flex items-center gap-3"></div>
      </div>

      <div className="mt-4 px-16 flex flex-col gap-4 pb-16 rounded-md">
        <div className="w-full h-16 bg-white grid grid-cols-12">
          <div className="pl-8 col-span-4 flex items-center flex-row gap-5">
            <input type="checkbox" className="w-4 h-4 text-blue-600" />
            <span className="text-base font-normal">Món Ăn</span>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            Đơn giá
          </div>
          <div className="col-span-2 flex items-center justify-center">
            Số lượng
          </div>
          <div className="col-span-2 flex items-center justify-center">
            Số tiền
          </div>
          <div className="col-span-2 flex items-center justify-center">
            Thao tác
          </div>
        </div>

        <DetailsCart Details={cartData} />

        <div className="flex flex-row fixed bottom-0 w-[90.6%] mr-16 h-16 bg-white items-center">
          <div className="flex flex-row gap-2 w-1/2 h-full items-center ml-10">
            <div className="cursor-pointer hover:text-red-600">Hủy</div>
            <div>Quán Đã chọn:</div>
            <div>
              {cartData.length > 0 ? cartData[0].name : "Chưa chọn quán"}
            </div>
          </div>
          <div className="flex flex-row gap-2 w-1/2 h-full items-center justify-end pr-2">
            <div>Tổng thanh toán ({totalItems} sản phẩm):</div>
            <div className="text-red-600">₫{totalAmount.toLocaleString()}</div>
            <Button
              href="/checkout"
              style={{ background: "#3AC5C9", color: "white" }}
              className="bg-beamin text-white w-40 h-10 rounded-md hover:brightness-105"
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
