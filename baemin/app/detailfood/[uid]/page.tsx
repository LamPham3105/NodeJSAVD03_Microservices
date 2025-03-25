"use client";
import HeaderNav from "@/components/headerNav";
import ScrollBar from "@/components/scrollBar";
import ScrollFood from "@/components/scrollFood";
import {
  ClockCircleOutlined,
  ClockCircleTwoTone,
  DollarOutlined,
  DollarTwoTone,
  DoubleRightOutlined,
  LikeFilled,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Home(props: any) {
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [filteredFoods, setFilteredFoods] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { uid } = props.params;

  useEffect(() => {
    axios.get(`http://localhost:8080/restaurants/${uid}`).then((res) => {
      setRestaurantData(res.data);
    });

    const token = localStorage.getItem("data");

    if (token) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, [uid]);

  const handleMouseDown = () => {
    setIsActive(true);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  if (!uid) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col w-full h-auto">
        <div className="bg-white w-full h-80 flex">
          <div className="w-[45%] h-full py-4 px-10">
            <div className="w-full relative h-full">
              <Image
                layout="fill"
                objectFit="cover"
                src={restaurantData?.image_url}
                alt="Ga"
              ></Image>
            </div>
          </div>
          <div className=" w-[55%] h-full relative">
            <div className="absolute top-0 left-0 px-8 py-4">
              <span className="text-[13px] text-[#187CAA]">
                <a href="">Home</a>
                <DoubleRightOutlined className="text-[10px]" />{" "}
                <a href="">{restaurantData?.city}</a>{" "}
                <DoubleRightOutlined className="text-[10px]" />{" "}
                <a href="">{restaurantData?.name}</a>{" "}
              </span>
              <div className="flex flex-row text-[11px] justify-start items-center mt-3">
                <div className="bg-beamin text-white p-1 mr-2 cursor-pointer tracking-wider flex gap-1">
                  <LikeFilled />
                  <span>Yêu thích</span>
                </div>
                <span className="text-[#959595]">
                  {restaurantData?.kind}{" "}
                  <a href="" className="text-[#0288D1]">
                    Chi nhánh
                  </a>
                </span>
              </div>
              <div className="text-[22px] font-bold mt-2">
                {restaurantData?.name}
              </div>
              <div className="text-[13px] mt-1">{restaurantData?.address}</div>
              <div className="flex flex-row text-[14px] gap-2 justify-start items-center">
                <ol className="flex flex-row text-[#FFC107] gap-1">
                  {Array.from({ length: 5 }, (_, index) => {
                    const filledStars = Math.floor(
                      restaurantData?.average_rating
                    ); // Number of filled stars

                    // Determine the filled or outlined star based on the index
                    return index < filledStars ? (
                      <li key={index}>
                        <StarFilled />
                      </li> // Filled stars
                    ) : (
                      <li key={index}>
                        <StarOutlined />
                      </li> // Outlined stars
                    );
                  })}
                </ol>
                <p className="bg-[#FFC107] py-[2px] px-1 text-white rounded-md">
                  {restaurantData?.ratings_count}+
                </p>
                <span>đánh giá trên Baemin</span>
              </div>
              <div className="flex flex-row gap-4 justify-start items-center my-1 text-[15px]">
                <OpenCloseComponent
                  restaurantData={restaurantData}
                  setIsOpen={setIsOpen}
                />
                <div className="flex flex-row gap-1 justify-start items-center">
                  <ClockCircleTwoTone twoToneColor={"#3AC5C9"} />
                  <TimeComponent restaurantData={restaurantData} />
                </div>
              </div>
              <div className="flex flex-row gap-1 justify-start items-center text-[#959595] text-[15px]">
                <DollarTwoTone
                  twoToneColor={"#c0c0c0"}
                  className="text-[16px]"
                />
                <PriceRangeComponent restaurantData={restaurantData} />
              </div>
            </div>

            <div className="w-full flex flex-col absolute bottom-0 left-0 px-8 mb-4 text-[#959595] text-[13px]">
              <div className="border-t-[1px]"></div>
              <div className="flex flex-row gap-4 justify-start items-center py-[10px]">
                <div className="flex flex-col ">
                  <span>PHÍ DỊCH VỤ</span>
                  <span className="text-beamin font-bold text-[14px]">
                    {restaurantData?.service_fee_percentage} Phí dịch vụ
                  </span>
                </div>
                <div className="border-l border-solid h-6"></div>
                <div className="flex flex-col">
                  <span>DỊCH VỤ BỞI</span>
                  <span className="text-beamin font-bold text-[14px]">
                    Baemin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="py-[13px] px-[26px] font-bold text-beamin text-[14px]">
            THỰC ĐƠN
          </div>
          <div className="w-full flex flex-row gap-3">
            <div className="w-[20%] bg-white p-5">
              <ul>
                <li
                  className={`cursor-pointer w-fit px-1 ${
                    isActive ? "" : "bg-[#959595] text-white"
                  }`}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                >
                  SẢN PHẨM MỚI
                </li>
                <li className="mt-2 px-1 w-fit">FAMILY COMBO</li>
                <li className="mt-2 px-1 w-fit ">GÀ RÁN</li>
                <li className="mt-2 px-1  w-fit">BURGER</li>
              </ul>
            </div>
            <div className="w-[50%] h-auto bg-white py-3 flex flex-col px-4">
              <div className="w-full mb-5">
                <Input addonBefore={<SearchOutlined />} placeholder="" />
              </div>
              <div className="flex flex-col w-full pl-1 gap-3">
                <div className="font-medium">MÓN ĂN</div>
                <FoodListComponent
                  restaurantData={restaurantData}
                  isOpen={isOpen}
                  isLogin={isLoggedIn}
                />
              </div>
            </div>
            <div className="w-[30%] bg-white"></div>
          </div>
        </div>
      </div>
    </>
  );
}

const TimeComponent = ({ restaurantData }: { restaurantData: any }) => {
  const startTime = restaurantData?.open_time;
  const endTime = restaurantData?.close_time;

  if (!startTime || !endTime) return null;

  const start = new Date(startTime);
  const end = new Date(endTime);

  // Corrected options with valid 'hour' and 'minute' types
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  // Format the time as 'HH:mm'
  const formattedStart = start.toLocaleTimeString("en-US", options);
  const formattedEnd = end.toLocaleTimeString("en-US", options);

  // Combine the start and end time in the desired format
  const formattedTimeRange = `${formattedStart} - ${formattedEnd}`;

  return <span>{formattedTimeRange}</span>;
};

const OpenCloseComponent = ({
  restaurantData,
  setIsOpen,
}: {
  restaurantData: any;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const currentTime = new Date();
  const currentDate = currentTime.toISOString().split("T")[0];

  const openTime = new Date(`${currentDate}T${restaurantData?.open_time}:00Z`);
  const closeTime = new Date(
    `${currentDate}T${restaurantData?.close_time}:00Z`
  );

  const isOpen = currentTime >= openTime && currentTime <= closeTime;

  // Pass isOpen state to parent component
  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen, setIsOpen]);

  return (
    <div className="flex flex-row gap-1 justify-start items-center">
      <div
        className={`w-2 h-2 rounded-full ${
          isOpen ? "bg-[#6CC942]" : "bg-[#E74C3C]"
        }`}
      ></div>
      <span className={isOpen ? "text-[#6CC942]" : "text-[#E74C3C]"}>
        {isOpen ? "Mở cửa" : "Đóng cửa"}
      </span>
    </div>
  );
};

const PriceRangeComponent = ({ restaurantData }: { restaurantData: any }) => {
  const foodPrices = restaurantData?.foods?.map((food: any) => {
    // Use price directly if it exists, else default to 0
    const price =
      food?.price != null && !isNaN(food?.price) ? parseFloat(food?.price) : 0;
    return price;
  });

  // Filter out invalid prices (0 or null)
  const validPrices = foodPrices?.filter((price: number) => price > 0);

  // Initialize the price range
  let priceRange = "";

  if (validPrices?.length === 1) {
    // If there's only one valid item, display its price
    const singlePrice = validPrices[0];
    priceRange = `${singlePrice.toLocaleString()}đ`;
  } else if (validPrices?.length > 1) {
    // If there are multiple valid items, calculate the min and max prices
    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);
    priceRange = `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`;
  }

  return <span>{priceRange}</span>;
};

const FoodListComponent = ({
  restaurantData,
  isOpen,
  isLogin,
}: {
  restaurantData: any;
  isOpen: boolean;
  isLogin: boolean;
}) => {
  const handleAddToLocalStorage = (food: any) => {
    const storedData = localStorage.getItem("restaurant_data");
    let restaurantList = storedData ? JSON.parse(storedData) : [];

    // Kiểm tra xem nhà hàng này đã có trong localStorage chưa
    let restaurant = restaurantList.find(
      (item: any) => item.id === restaurantData.id
    );

    if (!restaurant) {
      // Nếu chưa có, thêm mới
      restaurant = {
        id: restaurantData.id,
        name: restaurantData.name,
        foods: [],
      };
      restaurantList.push(restaurant);
    }

    // Kiểm tra món ăn đã có trong danh sách chưa
    let foodItem = restaurant.foods.find((item: any) => item.id === food.id);
    if (foodItem) {
      foodItem.quantity += 1; // Tăng số lượng nếu đã có
    } else {
      restaurant.foods.push({ ...food, quantity: 1 }); // Thêm món ăn mới
    }

    // Cập nhật lại danh sách vào localStorage
    localStorage.setItem("restaurant_data", JSON.stringify(restaurantList));
  };

  return (
    <div className="flex flex-col w-full gap-4 border-b">
      {restaurantData?.foods?.map((food: any, index: number) => {
        const foodImage = food?.image_url || "/images/default-image.jpg";
        const foodPrice = food?.price
          ? `${parseFloat(food?.price).toLocaleString()}đ`
          : "Giá chưa cập nhật";

        return (
          <div className="flex flex-row" key={food.id || index}>
            <div className="w-[15%] relative h-16">
              <Image
                layout="fill"
                objectFit="cover"
                src={foodImage}
                alt={food?.name || "Food Image"}
              />
            </div>
            <div className="w-[60%] flex flex-col gap-1 px-2">
              <span className="font-bold text-[#464646]">
                {food?.name || "Tên món ăn"}
              </span>
              <span className="text-wrap text-sm text-[#464646]">
                {food?.description || "Mô tả món ăn chưa có"}
              </span>
            </div>
            <div className="w-[15%] flex justify-center items-center">
              <span className="text-[#0288d1] font-bold text-base">
                {foodPrice}
              </span>
            </div>
            {isLogin && isOpen && (
              <div
                className="w-[10%] flex justify-center items-center cursor-pointer"
                onClick={() => handleAddToLocalStorage(food)}
              >
                <div className="h-6 w-6 rounded-md flex justify-center items-center bg-beamin text-white font-bold hover:brightness-110">
                  <PlusOutlined />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
