"use client";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const Page: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const {
      firstName,
      lastName,
      username,
      phoneNumber,
      email,
      password,
      confirmPassword,
    } = formData;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !username ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Mật khẩu không khớp.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/auth/signup", {
        firstName,
        lastName,
        username,
        phoneNumber,
        email,
        password,
      });

      const data = response.data.user;

      if (data.success) {
        message.success(data.message || "Đăng ký thành công!");
        router.push("/login");
      } else {
        message.error(data.message || "Đăng ký thất bại.");
      }
    } catch (error: any) {
      let errorMessage = "Đăng ký thất bại.";

      // Handle validation error arrays from NestJS
      if (Array.isArray(error.response?.data?.message)) {
        errorMessage = error.response.data.message.join(" ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-28 w-1/3 bg-white border rounded-2xl flex flex-col p-5 gap-5 pb-8">
        <div className="flex justify-center items-center w-full text-beamin font-semibold text-[26px]">
          Đăng Kí
        </div>
        <div className="flex flex-row w-full gap-2">
          <Input
            placeholder="Họ"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="h-[40px]"
          />
          <Input
            placeholder="Tên"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="h-[40px]"
          />
        </div>
        <div className="flex flex-col w-full gap-3">
          <Input
            placeholder="Tên đăng nhập"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="h-[40px]"
          />
        </div>
        <div className="flex flex-col w-full gap-3">
          <Input
            placeholder="Số điện thoại"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="h-[40px]"
          />
        </div>
        <div className="flex flex-col w-full gap-3">
          <Input
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="h-[40px]"
          />
        </div>
        <div className="flex flex-col w-full">
          <Input.Password
            placeholder="Mật khẩu"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="h-[40px]"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </div>
        <div className="flex flex-col w-full">
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="h-[40px]"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </div>
        <div className="flex flex-col w-full">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full h-[40px] uppercase text-white bg-beamin rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Đang xử lý..." : "Đăng Ký"}
          </button>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-gray-600">Bạn đã có tài khoản?</span>
          <Link className="text-beamin cursor-pointer" href={"/login"}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
