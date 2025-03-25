"use client";
import { ShoppingCartOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TypeSelector from "./type";
import AreaSelector from "./area";
import FilterSelector from "./filter";
import ResultFood from "./result";
import axios from "axios";

const Page: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1); // Store the total pages

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");

    if (query && query !== search) {
      setSearch(query);
    }

    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/restaurants/pagination",
          {
            params: {
              page: page || 1,
              limit: 10,
              search: query || search,
            },
          }
        );
        setItems(response.data?.data || []); // Use response.data.data to get the actual array
        setTotalPages(response.data?.meta?.last_page || 1); // Get the total pages from the API response
      } catch (error) {
        setItems([]); // If error occurs, ensure items is an empty array
      }
    };

    fetchItems();
  }, [page, search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const isItemsEmpty = items.length === 0;
  const isLastPage = page === totalPages; // Check if current page is the last page
  const isFirstPage = page === 1; // Check if current page is the first page
  const isSinglePage = totalPages === 1; // Check if there's only one page

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center border-b border-solid">
        <div className="flex flex-row gap-3">
          <AreaSelector />
          <TypeSelector />
        </div>
        <div className="flex items-center justify-center ">
          <FilterSelector></FilterSelector>
        </div>
      </div>

      {/* Show message if items are empty */}
      {isItemsEmpty ? (
        <div className="my-3 flex flex-row">Không tìm thấy nhà hàng</div>
      ) : (
        <>
          <div className="my-3 flex flex-row">Kết quả tìm được</div>

          <ResultFood items={items} />

          {/* Show pagination controls if there are more than 1 page */}
          {!isSinglePage && (
            <div className="my-3 flex flex-row">
              <div className="flex justify-center w-full">
                {/* Show Previous button if not on the first page */}
                {!isFirstPage && (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </button>
                )}

                <span className="mx-3">{page}</span>

                {/* Show Next button if not on the last page */}
                {!isLastPage && (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Page;
