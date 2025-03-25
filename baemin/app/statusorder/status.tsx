"use client";
import { useEffect, useState } from "react";

export default function Status({ items }: { items: any[] }) {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState(items);

  useEffect(() => {
    setStatus(items);
  }, [items]);

  const handleClick = (id: string) => {
    const newStatus = status.map((item) => {
      if (
        item.id === id &&
        (item.number === current + 1 || item.number === current)
      ) {
        item.st = !item.st;
        setCurrent(item.number);
      }
      return item;
    });
    setStatus(newStatus);
  };

  return (
    <div className="mt-2 flex flex-col gap-3 relative">
      {status.map((item, index) => (
        <div
          key={item.id}
          onClick={() => handleClick(item.id)}
          className="flex flex-row gap-3 items-center cursor-pointer"
        >
          <div
            className={`w-10 h-10 rounded-full border border-solid flex justify-center items-center ${
              item.st ? "border-beamin" : "border-gray-400"
            }`}
          >
            <span className={`${item.st ? "text-beamin" : "text-gray-600"}`}>
              {item.number}
            </span>
          </div>
          <div
            className={`text-wrap text-[14px] ${
              item.st ? "text-beamin" : "text-gray-600"
            }`}
          >
            {item.name}
          </div>
          {status.length - 1 !== index && (
            <div className="h-5 w-0.5 bg-gray-400 ml-5"></div>
          )}
        </div>
      ))}
    </div>
  );
}
