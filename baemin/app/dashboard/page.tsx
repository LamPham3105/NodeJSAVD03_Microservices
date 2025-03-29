"use client";
import axios from "axios";
import ScrollBar from "@/components/scrollBar";
import ScrollFood from "@/components/scrollFood";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  image_url: string;
};

type Banner = {
  id: string;
  name: string;
  image_url: string;
  description: string;
};

type Restaurant = {
  id: string;
  name: string;
  address: string;
  city: string;
  open_time: string;
  close_time: string;
  average_rating: string;
  ratings_count: string;
  service_fee_percentage: string;
  image_url: string;
  kind: string;
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [banner, setBanner] = useState<Banner[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/categories`).then((res) => {
      setCategories(res.data);
    });

    axios.get(`http://localhost:8080/banners`).then((res) => {
      console.log("res: ", res);
      setBanner(res.data);
    });

    axios.get(`http://localhost:8080/restaurants`).then((res) => {
      setRestaurants(res.data);
    });
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 pt-3 pl-8 pr-8  z-40">
          <div className="flex flex-col fixed  bg-white w-64 rounded-2xl  pl-3 pt-2  pb-5 gap-3  ">
            <span>Thực đơn </span>
            {categories?.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 cursor-pointer hover:bg-slate-100"
              >
                <div className="flex flex-row items-center gap-1">
                  <Image
                    src={item.image_url}
                    width={30}
                    height={30}
                    alt={item.name}
                  />
                  <span>{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-9 w-full  pt-3 pr-8 gap-3 flex flex-col">
          <ScrollBar items={banner}></ScrollBar>
          <ScrollFood items={restaurants}></ScrollFood>
        </div>
      </div>
    </>
  );
}
