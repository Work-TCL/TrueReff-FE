"use client";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import ProductTable from "./product-table";
import Loading from "@/app/vendor/loading";
import { Button } from "@/components/ui/button";
import { FaSlidersH } from "react-icons/fa";
import Loader from "../../components-common/layout/loader";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IVendor {
  _id: string;
  business_name: string;
}

export interface IRequest {
  _id: string;
  creatorId: string;
  productId: string;
  vendorId: string;
  collaborationStatus: string;
  requestFrom: "CREATOR" | "VENDOR" | string;
  createdAt: string;
  updatedAt: string;
}

export interface ICollaboration {
  _id: string;
  creatorId: string;
  productId: string;
  vendorId: string;
  requestId: string;
  collaborationStatus: string;
  utmLink: string | null;
  discountType: string;
  discountValue: number;
  couponCode: string;
  commissionPercentage: number;
  expiresAt: string;
  agreedByCreator: boolean;
  agreedByVendor: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  vendorId: string;
  sku: string;
  description: string;
  media: any[]; // replace with IMedia[] if you define media type later
  channelName: string;
  category: ICategory[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  vendor: IVendor;
  request: IRequest | null;
  collaboration: ICollaboration | null;
  categories?: string;
  tag?: string;
}

export default function ProductList() {
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // Get Creator list
  const getProductList = useCallback(
    async (page: number, isInternalLoader = false) => {
      isInternalLoader ? setInternalLoader(true) : setLoading(true);
      try {
        const response = await axios.get(
          `/product/list?page=${page}&limit=${pageSize}`
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
            setInternalLoader(false);
          } else {
            setProducts([]);
            setCurrentPage(1);
            setLoading(false);
            setInternalLoader(false);
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
        setLoading(false);
        setInternalLoader(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    getProductList(currentPage);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
  };
  const handleFilterValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    page !== currentPage && getProductList(page, true);
  };
  const handleUpdateProduct = () => {
    getProductList(currentPage, true);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      {loading ? (
        <Loading />
      ) : products?.length > 0 ? (
        <>
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
                className="text-black w-[100px] rounded-[4px]"
              >
                <FaSlidersH /> {translate("Filters")}
              </Button>
            </div>
          </div>
          {internalLoader && <Loader />}
          <ProductTable
            data={products}
            handleUpdateProduct={handleUpdateProduct}
          />
          {/* Pagination */}
          <div className="flex justify-end items-center mt-4">
            <TablePagination
              totalPages={totalPages}
              activePage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyPlaceHolder
          title={"No_Products_Available_Title"}
          description={"No_Products_Available_Description"}
        />
      )}
    </div>
  );
}
