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
import { debounce } from "lodash";
import { getCategories } from "@/lib/web-api/auth";
import Select from "react-select";
import { Search } from "lucide-react";
import ProductCard from "./product-card";
import { ViewToggle } from "../../components-common/view-toggle";
import CategorySubCategorySelect from "../../components-common/category-dropdowns";
import { SearchInput } from "../../components-common/search-field";
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
  profile_image?: string;
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
  subCategories?: string;
  tag?: string;
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

export default function ProductList() {
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // parent and sub both categories
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // Get Creator list
  const getProductList = useCallback(
    async (
      page: number,
      isInternalLoader = false,
      searchValue: string = "",
      categoryIds: string[] = []
    ) => {
      isInternalLoader ? setInternalLoader(true) : setLoading(true);
      try {
        const response = await axios.get(
          `/product/list?page=${page}&limit=${pageSize}${
            searchValue ? `&search=${searchValue}` : ""
          }${
            categoryIds?.length > 0
              ? `&categories=${categoryIds.join(",")}`
              : ""
          }`
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
                ele.subCategories = ele?.category?.length
                  ? ele.category
                      .filter((ele: ICategory) => ele?.parentId !== null)
                      .map((ele: ICategory) => ele?.name)
                      .join(", ")
                  : "";
                return { ...ele };
              });
              setProducts([...result]);
              setTotalPages(Math.ceil(productsCount / pageSize));
              setCurrentPage(page);
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

  const debouncedSearch = useCallback(
    debounce((value: string, categoryIds: string[]) => {
      getProductList(currentPage, true, value, categoryIds);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value, [...selectedCategories]); // call debounce on value
  };
  const handlePageChange = (page: number) => {
    page !== currentPage &&
      getProductList(page, true, search, [...selectedCategories]);
  };
  const handleUpdateProduct = () => {
    getProductList(currentPage, true);
  };

  const handleSelectCategory = (selectedOptions: any) => {
    setSelectedCategories(selectedOptions);
    getProductList(currentPage, true, search, [...selectedOptions]);
  };

  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_Product")}
              className="p-3 rounded-lg bg-white pl-10 w-full gray-color" // Add padding to the left for the icon
            />
            <div className="flex flex-row gap-2 justify-end relative z-[99] flex-wrap ml-auto">
              <CategorySubCategorySelect onChange={handleSelectCategory} />
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
          {internalLoader && <Loader />}
          {products?.length > 0 ? (
            <>
              <ProductTable
                data={products}
                handleUpdateProduct={handleUpdateProduct}
                type={viewMode}
                CardComponent={(item) => (
                  <div key={item?._id} className="flex w-full h-full">
                    <ProductCard
                      key={item?.id}
                      item={item}
                      handleUpdateProduct={handleUpdateProduct}
                    />
                  </div>
                )}
              />

              {/* Pagination */}
              {/* {totalPages > 1 && ( */}
              <TablePagination
                totalPages={totalPages}
                activePage={currentPage}
                onPageChange={handlePageChange}
              />
              {/* )} */}
            </>
          ) : (
            <EmptyPlaceHolder
              title={"No_Products_Available_Title"}
              description={"No_Products_Available_Description"}
            />
          )}
        </>
      )}
    </div>
  );
}
