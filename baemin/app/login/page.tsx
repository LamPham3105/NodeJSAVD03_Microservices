"use client";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { Input, message, Spin } from "antd";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { usernameOrEmail, password } = formData;

    if (!usernameOrEmail || !password) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/auth/login", {
        usernameOrEmail,
        password,
      });

      if (response.data) {
        // Ensure that response.data is a string before calling toLocaleString
        localStorage.setItem("data", JSON.stringify(response.data));
        message.success("Đăng nhập thành công!");
        router.push("/dashboard");
      } else {
        message.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(
          error.response.data?.message || "Đã xảy ra lỗi, vui lòng thử lại."
        );
      } else {
        message.error("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-14 w-1/3 bg-white border rounded-2xl flex flex-col p-5 gap-5 pb-8">
        <div className="flex justify-center items-center w-full text-beamin font-semibold text-[26px]">
          Đăng Nhập
        </div>
        <div className="flex flex-col w-full gap-3">
          <Input
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            placeholder="Email/Số điện thoại/Tên đăng nhập"
            className="h-[40px]"
          />
        </div>
        <div className="flex flex-col w-full mt-3">
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="h-[40px]"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </div>
        <div className="flex flex-col w-full mt-3">
          <button
            onClick={handleSubmit}
            className="w-full h-[40px] uppercase text-white bg-beamin rounded-lg"
            disabled={loading}
          >
            {loading ? <Spin /> : "Đăng Nhập"}
          </button>
          <div className="flex flex-row justify-between items-center w-full text-sm text-beamin">
            <span className="cursor-pointer">Quên mật khẩu </span>
            <span className="cursor-pointer">Đăng nhập bằng SMS </span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-600">HOẶC</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="flex flex-row items-center justify-center gap-5 h-[40px]">
          <button className="flex items-center justify-center gap-3 border w-full h-full p-1 text-beamin text-base">
            <FacebookOutlined />
            <span>Facebook</span>
          </button>
          <button className="flex items-center justify-center gap-3 border w-full h-full p-1 text-beamin text-base">
            <GoogleOutlined />
            <span>Google</span>
          </button>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-gray-600">Bạn mới biết đến Baemin?</span>
          <Link className="text-beamin cursor-pointer" href="/register">
            Đăng kí
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
