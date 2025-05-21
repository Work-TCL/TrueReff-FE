"use client";
import React, { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import Loading from "@/app/vendor/loading";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Loader from "@/app/_components/components-common/layout/loader";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import ProductCard from "@/app/_components/components-common/product/product-card";
import { SearchInput } from "@/app/_components/components-common/search-field";
import CategorySubCategorySelect from "@/app/_components/components-common/category-dropdowns";
import TrendingProductCard from "@/app/_components/components-common/product/trending.product-card";
const Select = dynamic(() => import("react-select"), { ssr: false });

export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // or Date if parsed
  updatedAt: string; // or Date
}

export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  sku: string;
  description: string;
  media: string[]; // Array of image/video URLs
  price: number;
  channelName: string;
  category: ICategory[]; // Array of categories
  subCategory: string[]; // Array of sub-category IDs
  tags: string[]; // Array of tags
  lifeTime: boolean;
  startDate: string | null; // You can use `Date` if parsed
  endDate: string | null; // You can use `Date` if parsed
  status: string; // e.g., "ACTIVE"
  commission: number; // Commission value
  commission_type: "PERCENTAGE" | "FIXED_AMOUNT"; // Commission type
  videoType: string[]; // Array of video types
  channels: string[]; // Array of channel names
  createdAt: string; // You can use `Date` if parsed
  updatedAt: string; // You can use `Date` if parsed
  crmLink: string; // CRM link
  categories?: string; // Comma-separated string of category names
  tag?: string; // Comma-separated string of tags
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    borderRadius: "8px",
  }),
};

export default function ProductList({ storeName,showTrending }: { storeName: string,showTrending: boolean }) {
  const translate = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [trendingProductList, setTrendingProductList] = useState<IProduct[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageLimit = 20;

  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    page: number = currentPage,
    isInternalLoader: boolean = false,
    searchValue: string = "",
    categoryIds: string[] = []
  ) => {
    isInternalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await axios.get(
        `/auth/creator-store/product-list?limit=${pageLimit}&page=${page}&name=${storeName}${searchValue ? `&search=${searchValue}`: ""}`
      );

      if (response.data.data?.list?.length > 0) {
        setProductList(
          response.data.data?.list.map((product: any) => {
            let categories =
              product.category?.length > 0
                ? product.category
                  .filter((cat: ICategory) => cat.parentId === null)
                  .map((cat: ICategory) => cat?.name)
                  ?.join(", ")
                : "";
            let subCategories =
              product.category?.length > 0
                ? product.category
                  .filter((cat: ICategory) => cat.parentId !== null)
                  .map((cat: ICategory) => cat?.name)
                  ?.join(", ")
                : "";
            let tag = product.tags?.length > 0 ? product.tags?.join(", ") : "";
            return { ...product, categories, tag, subCategories };
          })
        );
        setTotalPages(Math.ceil(response.data.data?.count / pageLimit));
        setCurrentPage(page);
      }
      setLoading(false);
      setInternalLoading(false);
    } catch (error) {
      setLoading(false);
      setProductList([]);
      setTotalPages(0);
      setCurrentPage(1);
      setInternalLoading(false);
    }
  };
  const fetchTrendingProductsList = async (
    page: number = currentPage,
    isInternalLoader: boolean = false,
    searchValue: string = "",
    categoryIds: string[] = []
  ) => {
    isInternalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await axios.get(
        `/auth/creator-store/trending-product-list?limit=${pageLimit}&page=${page}&name=${storeName}`
      );

      if (response.data.data?.list?.length > 0) {
        setTrendingProductList(
          response.data.data?.list.map((product: any) => {
            let categories =
              product.category?.length > 0
                ? product.category
                  .filter((cat: ICategory) => cat.parentId === null)
                  .map((cat: ICategory) => cat?.name)
                  ?.join(", ")
                : "";
            let subCategories =
              product.category?.length > 0
                ? product.category
                  .filter((cat: ICategory) => cat.parentId !== null)
                  .map((cat: ICategory) => cat?.name)
                  ?.join(", ")
                : "";
            let tag = product.tags?.length > 0 ? product.tags?.join(", ") : "";
            return { ...product, categories, tag, subCategories };
          })
        );
        // setTotalPages(Math.ceil(response.data.data?.count / pageLimit));
        // setCurrentPage(page);
      }
      setLoading(false);
      setInternalLoading(false);
    } catch (error) {
      setLoading(false);
      setTrendingProductList([]);
      // setTotalPages(0);
      setCurrentPage(1);
      setInternalLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetProductsList(currentPage);
    fetchTrendingProductsList(currentPage);
  }, []);

  // Update the onClick handlers for pagination buttons
  const handlePageChange = (page: number) => {
    page !== currentPage &&
      fetProductsList(page, true, search, [...selectedCategories]);
  };

  const debouncedSearch = useCallback(
    debounce((value: string, categoryIds: string[]) => {
      fetProductsList(1, true, value, categoryIds);
    }, 500),
    []
  );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value, [...selectedCategories]);
  };
  const handleSelectCategory = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((opt: any) => opt.value);
    setSelectedCategories(selectedIds);
    fetProductsList(1, true, search, [...selectedCategories]);
  };


  return (
    <div className="bg-white p-4 rounded-[20PX] flex flex-col gap-3 h-full w-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* {productList?.length > 0 && (
            <div className="flex justify-between items-center gap-2 flex-nowrap">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder={translate("Search_Product")}
                className="w-full"
              />
              <div className="flex md:flex-row flex-col gap-2 ml-auto justify-end items-center">
                <CategorySubCategorySelect
                  onChange={handleSelectCategory}
                  xlBreakPoint={true}
                />
              </div>
            </div>
          )} */}
          {internalLoading && <Loader />}
          {(showTrending && trendingProductList?.length > 0) && <div>
            <h3 className="font-semibold">Trending Products</h3>
            <div className={`grid grid-cols-2 ${trendingProductList?.length > 10 && "animate-marquee"} md:grid-cols-4 xl:grid-cols-6  2xl:grid-cols-8 whitespace-nowrap gap-2 py-2 text-sm font-medium px-2`}>
              {trendingProductList.map((item: any) => (
                <div key={item?._id} className="flex h-full w-full">
                  <TrendingProductCard
                    item={item}
                  />
                </div>
              ))}
            </div>
          </div>}
          {productList?.length > 0 ? (
            <div className="flex flex-col h-full overflow-auto">
              <h3 className="font-semibold">Product List</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-2 bg-white md:max-h-screen overflow-auto pt-2 pb-3 px-2">
                {productList.map((item: IProduct) => (
                  <div key={item?._id} className="flex h-full w-full">
                    <ProductCard
                      item={item}
                    />
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <TablePagination
                  totalPages={totalPages}
                  activePage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          ) : (
            <EmptyPlaceHolder
              title={translate("No_Products_Available")}
              description={translate("No_Products_Available_Description")}
            />
          )}
        </>
      )}
    </div>
  );
}
