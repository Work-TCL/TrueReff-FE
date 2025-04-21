"use client";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import BrandProductTable from "./BrandProductTable";
import Loading from "@/app/vendor/loading";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Loader from "@/app/_components/components-common/layout/loader";
import { useTranslations } from "next-intl";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import axios from "@/lib/web-api/axios";
import { Search } from "lucide-react";
import { debounce } from "lodash";
import { getCategories } from "@/lib/web-api/auth";
import Select from "react-select";
export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICollaboration {
  _id: string;
  creatorId: string;
  productId: string;
  vendorId: string;
  collaborationStatus: "REQUESTED" | "APPROVED" | "REJECTED" | "COMPLETED"; // extend if needed
  utmLink: string | null;
  discountType: "PERCENTAGE" | "FIXED" | null; // assuming these are the only types
  discountValue: number;
  couponCode: string;
  commissionPercentage: number;
  expiresAt: string; // ISO date string, can also be `Date` if parsed
  agreedByCreator: boolean;
  agreedByVendor: boolean;
  createdAt: string; // same as above
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
  requestFrom: string;
  createdAt: string;
  updatedAt: string;
}
export interface IBrand {
  _id: string;
  title: string;
  channelProductId: string;
  sku: string;
  description: string;
  media: string[];
  channelName: string;
  category: ICategory[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  collaboration: ICollaboration | null;
  categories?: string[];
  subCategories?:string[];
  vendor: IVendor;
  request: IRequest | null;
}
const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base:any) => ({
    ...base,
    borderRadius:"8px"
  })
};
export default function CreatorList() {
  const params = useParams();
  const router = useRouter();
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [brandProducts, setBrandProducts] = useState<IBrand[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([]);
  const [subCategory, setSubCategory] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // Get Creator list
  const getBrandProductList = useCallback(
    async (page: number, isInternalLoader = false,searchValue:string = '',categoryIds: string[] = []) => {
      isInternalLoader ? setInternalLoader(true) : setLoading(true);
      try {
        const response = await axios.get(
          `/product/vendor-product/product/list/${params.id}?page=${page}&limit=${pageSize}${searchValue ? `&search=${searchValue}`:""}${categoryIds?.length > 0 ? `&categories=${categoryIds.join(",")}`:""}`
        );
        if (response.status === 200) {
          const brandData = response.data.data;
          if (brandData && typeof brandData === "object") {
            const brandsArray = brandData.data || [];
            const brandsCount = brandData.count || 0;

            if (Array.isArray(brandsArray) && brandsArray?.length > 0) {
              let result = brandsArray.map((brand: IBrand) => {
                let category =
                  brand?.category && brand?.category?.length > 0
                    ? brand?.category
                        .filter((cat: ICategory) => cat.parentId === null)
                        .map((cat: ICategory) => cat?.name)
                    : [];
                    let subCategory =
                  brand?.category && brand?.category?.length > 0
                    ? brand?.category
                        .filter((cat: ICategory) => cat.parentId !== null)
                        .map((cat: ICategory) => cat?.name)
                    : [];
                return { ...brand, categories: category,subCategories:subCategory };
              });
              setBrandProducts([...result]);
              setTotalPages(Math.ceil(brandsCount / pageSize));
              setCurrentPage(page);
            } else {
              setBrandProducts([]);
              setCurrentPage(1);
            }
            setLoading(false);
            setInternalLoader(false);
          } else {
            setBrandProducts([]);
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
    getBrandProductList(currentPage);
    fetchCategory();
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

  const handleUpdateCollaboration = () => {
    getBrandProductList(currentPage, true);
  };
  const debouncedSearch = useCallback(
      debounce((value: string,categoryIds:string[]) => {
        getBrandProductList(currentPage, true, value,categoryIds);
      }, 500),
      []
    );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value,[...selectedCategories,...selectedSubCategories]);
  };
  const handlePageChange = (page: number) => {
    page !== currentPage && getBrandProductList(page, true,search,[...selectedCategories,...selectedSubCategories]);
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
    let selectedSubCategory = selectedSubCategories.filter((id) => availableSubCategoriesIds.includes(id))
    setSelectedSubCategories(selectedSubCategory);
    getBrandProductList(currentPage, true, search, [...selectedIds, ...selectedSubCategory]);
  }
  const handleSelectSubCategory = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((opt: any) => opt.value);
    setSelectedSubCategories(selectedIds);
    getBrandProductList(currentPage, true, search, [...selectedCategories,...selectedIds]);
  }
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : <><div className="text-[20px] text-500">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage
                    className="cursor-pointer hover:text-[grey] hover:underline"
                    onClick={() => router.push(`/creator/brandsList`)}
                  >
                    Brand Lists
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{translate("Product_Lists")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex justify-between items-center gap-2">
        <div
          className={`relative`}
        >
          <Input
            value={search}
            onChange={handleSearch}
            placeholder={translate("Search_Product")}
            className="p-3 rounded-lg bg-white pl-10 max-w-[320px] w-full gray-color" // Add padding to the left for the icon
          />
          <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />{" "}
        </div>
        <div className="flex md:flex-row flex-col gap-2 w-full justify-end">
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
      {brandProducts?.length > 0 ? (
        <>
          
          <BrandProductTable
            data={brandProducts}
            handleUpdateCollaboration={handleUpdateCollaboration}
          />
          {/* Pagination */}
            {totalPages > 1 && <TablePagination
              totalPages={totalPages}
              activePage={currentPage}
              onPageChange={handlePageChange}
            />}
        </>
      ) : (
        <EmptyPlaceHolder
          title={"No_Products_Available_Title"}
          description={"No_Products_Available_Description"}
        />
      )}</>}
    </div>
  );
}
