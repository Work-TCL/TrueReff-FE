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
  const [loading, setLoading] = useState<boolean>(false);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const translate = useTranslations();

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
        `/product/vendor-product/vendor/list?page=${page}&limit=${itemsPerPage}${searchValue ? `&search=${searchValue}` : ""}`
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
              logo: brand.profile_image              ,
            }));
            setBrands(transformedData);
            setTotalPages(Math.ceil(response.data.count / itemsPerPage));
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
    <div
      className={`flex flex-col md:p-6 p-4 md:gap-6 gap-4 ${Boolean(brands.length === 0) ? "h-full" : ""
        }`}
    >
      <div
        className={`relative`}
      >
        <Input
          value={search}
          onChange={handleSearch}
          placeholder={translate("Search_Brand")}
          className="p-3 rounded-lg bg-white pl-10 max-w-[320px] w-full gray-color" // Add padding to the left for the icon
        />
        <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />{" "}
      </div>
      {internalLoader && <Loader />}
      {loading ? (
        <Loading />
      ) : brands?.length > 0 ? (
        <>

          <div className="grid 1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-white rounded-[20px]">
            {brands.map((brand: any) => (
              <BrandCard key={brand.id} {...brand} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-end items-center mt-4">
              <TablePagination
                totalPages={totalPages}
                activePage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  page !== currentPage && getBrandList(page, true);
                }}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyPlaceHolder
          title={"No_Brands_Available_Title"}
          description={"No_Brands_Available_Description"}
        />
      )}
    </div>
  );
}
