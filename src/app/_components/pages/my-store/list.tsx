"use client";

import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { translate } from "@/lib/utils/translate";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import ProductTable from "./product-table";
import Loading from "@/app/vendor/loading";
import { Button } from "@/components/ui/button";
import { FaSlidersH } from "react-icons/fa";
import axios from "@/lib/web-api/axios";
export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  sku: string;
  description: string;
  media: string[];
  channelName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  tag: string;
  category?: ICategory[];
  categories: string;
  collaborationStatus: string;
}

export default function ProductList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);

  // Get Creator list
  const getCreatorList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/product/list?page=${currentPage}&limit=${pageSize}`
      );
      if (response.status === 200) {
        const productData = response.data.data;
        if (productData && typeof productData === "object") {
          const productsArray = productData.data || [];
          const productsCount = productData.count || 0;

          if (Array.isArray(productsArray)) {
            let result = productsArray.map((ele) => {
              ele.tag = ele.tags.join(", ");
              ele.categories = ele?.category?.length
                ? ele.category
                    .filter((ele: ICategory) => ele?.parentId === null)
                    .map((ele: ICategory) => ele?.name)
                    .join(", ")
                : "";
              return { ...ele };
            });
            setProducts([...result]);
            setTotalPages(Math.ceil(productsCount / pageSize));
          } else {
            setProducts([]);
            setCurrentPage(1);
          }
          setLoading(false);
        } else {
          setProducts([]);
          setCurrentPage(1);
          setLoading(false);
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    getCreatorList();
  }, [currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
  };
  const handleFilterValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2">
        <div className="md:text-[20px] text-base text-500">
          <Input
            value={search}
            onChange={handleSearch}
            placeholder={translate("Search_creator")}
            className="md:h-10 h-8"
          />
        </div>
        <div className="flex items-center gap-[10px]">
          <PiListChecksLight className="md:size-[30px] size-6" />
          <IoGridOutline className="md:size-[30px] size-6" />
          <Button
            variant="outline"
            className="text-black w-[100px] rounded-[4px] md:h-10 h-8"
          >
            <FaSlidersH /> {translate("Filters")}
          </Button>
        </div>
      </div>
      {loading && <Loading />}
      {!loading && <ProductTable data={products} />}
      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <TablePagination
          totalPages={totalPages}
          activePage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
