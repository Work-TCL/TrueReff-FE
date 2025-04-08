"use client";

import { Input } from "@/components/ui/input";
import BrandCard from "./_components/brandCard";
import { Info, Search } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
// import BrandListView from "./_components/brandList";
import { translate } from "@/lib/utils/translate";
import BrandListView from "./_components/brandList";
import Loading from "../loading";

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
  const axios = useAxiosAuth();
  const [loading,setLoading] = useState<boolean>(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 2;

  // Get Brand list
  const getBrandList = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response: any = await axios.get(
        `/product/vendor-product/vendor/list?page=${page}&limit=${limit}`
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
              logo: "/default-logo.png",
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
        setLoading(false)
      } else {
        setLoading(false)
        console.error("Error fetching brands:", response.statusText);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false)
    }
  };

  useEffect(() => {
    getBrandList(1, 20);
  }, []);

  return (
    <div
      className={`flex flex-col md:p-6 p-4   md:gap-6 gap-4 ${
        Boolean(brands.length === 0) ? "h-full" : ""
      }`}
    >
      <div
        className={`relative ${Boolean(brands.length === 0) ? "hidden" : ""} `}
      >
        <Input
          placeholder={translate("Search_Product")}
          className="p-3 rounded-lg bg-white pl-10 max-w-[320px] w-full gray-color" // Add padding to the left for the icon
        />
        <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />{" "}
      </div>
      {loading && <Loading /> }
      {brands && brands.length > 0 ? (
        <>
          {/* <BrandListView brand={brands} /> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-white rounded-[20px]">
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
                  getBrandList(page, itemsPerPage);
                }}
              />
            </div>
          )}
        </>
      ) : !loading && (
        <EmptyPlaceHolde />
      )}
    </div>
  );
}
export function EmptyPlaceHolde() {
  return (
    <div className=" flex items-center justify-center flex-col flex-1 col-span-full text-center text-gray-500 p-4 bg-white rounded-[20px] ">
      <Info className="mx-auto mb-2 text-gray-400" />
      <h2 className="text-lg font-semibold">
        {translate("No_Brands_Available_Title")}
      </h2>
      <p className="text-sm">{translate("No_Brands_Available_Description")}</p>
    </div>
  );
}
