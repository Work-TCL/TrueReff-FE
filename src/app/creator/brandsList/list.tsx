"use client";

import { Input } from "@/components/ui/input";
import BrandCard from "./_components/brandCard";
import { Search } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import Loading from "../loading";
import Loader from "@/app/_components/components-common/layout/loader";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { debounce } from "lodash";
import { IoGridOutline } from "react-icons/io5";
import { PiListChecksLight } from "react-icons/pi";
import BrandListView from "./_components/brandList";

export interface Brand {
  id: number;
  name: string;
  category: string;
  totalSale: string;
  totalProducts: number;
  rating: number;
  reviews: string;
  logo: string;
}
export default function BrandList() {
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const translate = useTranslations();
  const [viewMode, setViewMode] = useState<"table" | "card">("card");

  const itemsPerPage = 20;

  // Get Brand list
  const getBrandList = async (
    page: number,
    isInternalLoader: boolean = false,
    searchValue: string = ""
  ) => {
    isInternalLoader ? setInternalLoader(true) : setLoading(true);
    try {
      const response: any = await axios.get(
        `/product/vendor-product/vendor/list?page=${page}&limit=${itemsPerPage}${
          searchValue ? `&search=${searchValue}` : ""
        }`
      );
      if (response.status === 200) {
        const brandData = response.data.data;
        if (typeof brandData === "object" && brandData !== null) {
          const brandsArray = brandData.items || brandData.data || [];

          if (Array.isArray(brandsArray)) {
            const transformedData = brandsArray.map((brand) => ({
              id: brand._id,
              name: brand.business_name,
              category: brand.type_of_business,
              totalSale: `$${brand.productCount}k`,
              totalProducts: brand.productCount,
              rating: 4.5,
              reviews: "0",
              logo: brand.profile_image,
            }));
            setBrands(transformedData);
            setTotalPages(Math.ceil(brandData.count / itemsPerPage));
          } else {
            console.error("Expected an array but got:", brandsArray);
            setBrands([]);
          }
        } else {
          console.error("Expected an object but got:", brandData);
          setBrands([]);
        }
        setLoading(false);
        setInternalLoader(false);
      } else {
        setLoading(false);
        setInternalLoader(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setInternalLoader(false);
    }
  };

  useEffect(() => {
    getBrandList(currentPage);
  }, []);
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      getBrandList(currentPage, true, value);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value); // call debounce on value
  };
  return (
    <div className={`flex flex-col p-4 gap-4 h-full`}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="relative md:text-[20px] text-base text-500 max-w-[350px]">
              <Input
                value={search}
                onChange={handleSearch}
                placeholder={"Search Brand"}
                className="p-3 rounded-lg bg-white pl-10  w-full gray-color" // Add padding to the left for the icon
              />
              <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />{" "}
            </div>
            <div className="flex md:flex-row flex-col gap-2 justify-end items-center">
              <PiListChecksLight
                className={`cursor-pointer md:size-[30px] size-6 ${
                  viewMode === "table" ? "text-blue-600" : "text-gray-400"
                }`}
                onClick={() => setViewMode("table")}
              />
              <IoGridOutline
                className={`cursor-pointer md:size-[30px] size-6 ${
                  viewMode === "card" ? "text-blue-600" : "text-gray-400"
                }`}
                onClick={() => setViewMode("card")}
              />
            </div>
          </div>
          {internalLoader && <Loader />}
          {brands?.length > 0 ? (
            <>
              {viewMode === "table" && <BrandListView brand={brands} />}
              {viewMode === "card" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4 p-2 md:p-4 bg-white rounded-[20px] overflow-auto">
                  {brands.map((brand: any) => (
                    <BrandCard key={brand.id} {...brand} />
                  ))}
                </div>
              )}
              {totalPages > 1 && (
                <TablePagination
                  totalPages={totalPages}
                  activePage={currentPage}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    page !== currentPage && getBrandList(page, true, search);
                  }}
                />
              )}
            </>
          ) : (
            <EmptyPlaceHolder
              title={"No_Brands_Available_Title"}
              description={"No_Brands_Available_Description"}
            />
          )}
        </>
      )}
    </div>
  );
}
