// page.tsx
"use client";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Status from "./status";
import DetailsCheckout from "../checkout/detailsCheckout";

const Page: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/orders")
      .then((response) => {
        setOrders(response.data);
        if (response.data.length > 0) {
          setSelectedOrder(response.data[0]); // Chọn đơn hàng đầu tiên mặc định
        }
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const status = [
    { id: "1", number: 1, name: "Nhà hàng đã nhận đơn", st: false },
    { id: "2", number: 2, name: "Shipper đã nhận đơn", st: false },
    { id: "3", number: 3, name: "Shipper đang đến nhà hàng", st: false },
    { id: "4", number: 4, name: "Shipper đã đến nhà hàng", st: false },
    { id: "5", number: 5, name: "Shipper đang giao hàng", st: false },
    { id: "6", number: 6, name: "Đơn hàng hoàn tất", st: false },
  ];

  if (!selectedOrder) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-row w-full h-20 bg-white">
        <div className="w-1/2 h-full flex flex-row items-center gap-3">
          <div className="ml-10 text-4xl text-beamin font-bold">
            <ShoppingCartOutlined />
          </div>
          <div className="text-2xl text-beamin">|</div>
          <div className="text-3xl text-beamin font-bold">
            Trình trạng đơn hàng
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-3 pt-3 pb-3 pl-16">
          <div className="w-full h-full bg-white rounded-md flex flex-col pl-4 pt-2 pb-4">
            <div className="font-semibold">Trình Trạng</div>
            <Status items={status} />
          </div>
        </div>
        <div className="col-span-9 pt-3 pl-6 pr-10 flex flex-col gap-2 pb-3 h-full">
          <div className="w-full h-[70%] rounded-md relative">
            <Image
              layout="fill"
              objectFit="cover"
              src="/images/baemin-1.jpg"
              alt=""
            />
          </div>
          <div className="w-full bg-white rounded-md p-4 flex flex-col">
            <div className="w-full flex flex-row">
              <div className="w-1/3 flex flex-col gap-2">
                <div>Đơn hàng #{selectedOrder.id}</div>
                <div className="text-gray-600 text-sm">
                  {selectedOrder.total_price}đ -{" "}
                  {selectedOrder.order_items.length} món
                </div>
              </div>
              <div className="w-1/3 flex flex-col gap-2">
                <div>Giao hàng đến</div>
                <div className="text-gray-600 text-sm">
                  {selectedOrder.address || "Chưa có địa chỉ"}
                </div>
              </div>
            </div>
            <div className="w-full mt-2 border-t">
              <DetailsCheckout items={selectedOrder.order_items} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
