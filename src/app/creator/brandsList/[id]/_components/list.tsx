"use client";
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
import { debounce } from "lodash";
import BrandProductCard from "./brandProductCard";
import { useCreatorStore } from "@/lib/store/creator";
import CancelRequest from "@/app/_components/components-common/dialogs/cancel-request";
import CategorySubCategorySelect from "@/app/_components/components-common/category-dropdowns";
import { ViewToggle } from "@/app/_components/components-common/view-toggle";
import { SearchInput } from "@/app/_components/components-common/search-field";
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
  subCategories?: string[];
  vendor: IVendor;
  request: IRequest | null;
  status: string;
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
export default function CreatorList() {
  const params = useParams();
  const router = useRouter();
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [brandProducts, setBrandProducts] = useState<IBrand[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { creator } = useCreatorStore();
  const [isOpen, setIsOpen] = useState<string>("");
  const pageSize = 20;

  const getRequestStatus = (brand: IBrand) => {
    const { collaboration, request } = brand;
    if (collaboration && request) {
      if (
        request?.collaborationStatus === "REQUESTED" ||
        request?.collaborationStatus === "REJECTED"
      ) {
        return request?.collaborationStatus;
      } else {
        return collaboration?.collaborationStatus;
      }
    } else return "SEND_REQUEST";
  };

  // Get Creator list
  const getBrandProductList = useCallback(
    async (
      page: number,
      isInternalLoader = false,
      searchValue: string = "",
      categoryIds: string[] = []
    ) => {
      isInternalLoader ? setInternalLoader(true) : setLoading(true);
      try {
        const response = await axios.get(
          `/product/vendor-product/product/list/${
            params.id
          }?page=${page}&limit=${pageSize}${
            searchValue ? `&search=${searchValue}` : ""
          }${
            categoryIds?.length > 0
              ? `&categories=${categoryIds.join(",")}`
              : ""
          }`
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
                const status = getRequestStatus(brand);
                return {
                  ...brand,
                  categories: category,
                  subCategories: subCategory,
                  status: status,
                };
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
  }, []);

  const handleUpdateCollaboration = () => {
    getBrandProductList(currentPage, true);
  };
  const debouncedSearch = useCallback(
    debounce((value: string, categoryIds: string[]) => {
      getBrandProductList(currentPage, true, value, categoryIds);
    }, 500),
    []
  );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value, [...selectedCategories]);
  };
  const handlePageChange = (page: number) => {
    page !== currentPage &&
      getBrandProductList(page, true, search, [...selectedCategories]);
  };
  const handleCategories = (selectedOptions: any) => {
    setSelectedCategories(selectedOptions);
    getBrandProductList(currentPage, true, search, [...selectedOptions]);
  };

  const handleSendRequest = async (brand: IBrand) => {
    setLoading(true);
    try {
      const response: any = await axios.post(
        `/product/collaboration/creator/request`,
        {
          productIds: [brand?._id],
          creatorId: creator?.creatorId,
          vendorId: brand?.vendor?._id,
        }
      );
      if (response.status === 201) {
        let data = response?.data?.data?.results;
        if (data && data?.length > 0 && data[0]?.data) {
          handleUpdateCollaboration();
        }
        if (data && data?.length > 0 && data[0]?.message) {
          toast.success(data[0]?.message);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  const handleRejectRequest = async (collaborationId: string) => {
    setLoading(true);
    try {
      const response: any = await axios.delete(
        `/product/collaboration/request/cancel/${collaborationId}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        handleUpdateCollaboration();
        setLoading(false);
        setIsOpen("");
      } else {
        setLoading(false);
        setIsOpen("");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setIsOpen("");
    }
  };
  const handleAction = (status: string | null, brand: IBrand) => {
    if (status === "REQUESTED" && brand?.collaboration?._id) {
      setIsOpen(brand?.collaboration?._id);
    } else {
      handleSendRequest(brand);
    }
  };
  const handleDetailView = (id: string) => {
    router.push(`/creator/brandsList/${params.id}/${id}`);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="text-[20px] text-500">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage
                    className="cursor-pointer hover:text-[grey] hover:underline"
                    onClick={() => router.push(`/creator/brandsList`)}
                  >
                    {translate("Brand_Lists")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{translate("Product_Lists")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_Product")}
            />
            <div className="flex md:flex-row flex-col gap-2 justify-end ml-auto">
              <CategorySubCategorySelect onChange={handleCategories} />
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
          {internalLoader && <Loader />}
          {brandProducts?.length > 0 ? (
            <>
              {viewMode === "table" && (
                <BrandProductTable
                  data={brandProducts}
                  onAction={handleAction}
                  onView={handleDetailView}
                />
              )}
              {viewMode === "card" && (
                <div className="bg-white overflow-hidden flex flex-col rounded-[20px] h-full ">
                  <div className="flex-1 overflow-auto p-2 md:p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-4">
                      {[...brandProducts].map((brand: any, i: number) => (
                        <BrandProductCard
                          key={i}
                          brand={brand}
                          onAction={handleAction}
                          onView={handleDetailView}
                        />
                      ))}
                    </div>
                  </div>
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
              title={"No_Products_Available"}
              description={
                "It seems there are currently no products to display. Please check back later."
              }
            />
          )}
        </>
      )}
      {isOpen && (
        <CancelRequest
          onClose={() => setIsOpen("")}
          collaborationId={isOpen}
          handleCancelRequest={handleRejectRequest}
          loading={loading}
        />
      )}
    </div>
  );
}
