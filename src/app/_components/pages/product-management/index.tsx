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
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([]);
  const [subCategory, setSubCategory] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
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
  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      const data = response?.data?.data || [];
      setCategories(data);
      setParentCategory(data.filter((ele) => ele?.parentId === null));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
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
    debouncedSearch(value, [...selectedCategories, ...selectedSubCategories]); // call debounce on value
  };
  const handlePageChange = (page: number) => {
    page !== currentPage &&
      getProductList(page, true, search, [
        ...selectedCategories,
        ...selectedSubCategories,
      ]);
  };
  const handleUpdateProduct = () => {
    getProductList(currentPage, true);
  };

  const handleSelectCategory = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((opt: any) => opt.value);
    setSelectedCategories(selectedIds);

    const optionsSubCategory = categories.filter((ele) =>
      selectedIds.includes(ele?.parentId || "")
    );
    setSubCategory(optionsSubCategory);

    // Filter selected subcategories to only include available ones
    const availableSubCategoriesIds = optionsSubCategory.map((v) => v._id);
    let selectedSubCategory = selectedSubCategories.filter((id) =>
      availableSubCategoriesIds.includes(id)
    );
    setSelectedSubCategories(selectedSubCategory);
    getProductList(currentPage, true, search, [
      ...selectedIds,
      ...selectedSubCategory,
    ]);
  };

  const handleSelectSubCategory = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((opt: any) => opt.value);
    setSelectedSubCategories(selectedIds);
    getProductList(currentPage, true, search, [
      ...selectedCategories,
      ...selectedIds,
    ]);
  };

  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center gap-2">
            <div className="relative md:text-[20px] text-base text-500 max-w-[350px] w-full ">
              <Input
                value={search}
                onChange={handleSearch}
                placeholder={translate("Search_Product")}
                className="p-3 rounded-lg bg-white pl-10 w-full gray-color" // Add padding to the left for the icon
              />
              <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />{" "}
            </div>
            <div className="flex md:flex-row flex-col gap-2 w-full justify-end">
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
              <Select
                styles={customStyles}
                value={selectedCategories.map((id) => {
                  const match = parentCategory.find((cat) => cat._id === id);
                  return { value: id, label: match?.name || id };
                })}
                isMulti
                onChange={handleSelectCategory}
                options={parentCategory.map((ele) => ({
                  value: ele._id,
                  label: ele.name,
                }))}
                isOptionDisabled={() => selectedCategories.length >= 3}
                className="basic-multi-select focus:outline-none focus:shadow-none"
                placeholder="Parent Categories (max 3)"
              />
              <Select
                styles={customStyles}
                placeholder="Subcategories (max 3)"
                value={selectedSubCategories.map((id) => {
                  const match = subCategory.find((cat) => cat._id === id);
                  return { value: id, label: match?.name || id };
                })}
                isMulti
                onChange={handleSelectSubCategory}
                options={subCategory.map((ele) => ({
                  value: ele._id,
                  label: ele.name,
                }))}
                isOptionDisabled={() => selectedSubCategories.length >= 3}
                className="basic-multi-select focus:outline-none focus:shadow-none"
                classNamePrefix="select"
              />
            </div>
          </div>
          {internalLoader && <Loader />}
          {products?.length > 0 ? (
            <>
              {viewMode === "table" && (
                <ProductTable
                  data={products}
                  handleUpdateProduct={handleUpdateProduct}
                />
              )}
              {viewMode === "card" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 p-2 md:p-4 bg-white rounded-[20px] overflow-auto">
                  {products.map((product: any, i) => (
                    <div key={i} className="flex w-full h-full">
                      <ProductCard
                        key={i}
                        item={product}
                        handleUpdateProduct={handleUpdateProduct}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <TablePagination
                  totalPages={totalPages}
                  activePage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
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
