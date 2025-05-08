"use client";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import Loading from "@/app/vendor/loading";
import CollaborationTable from "./collaboration-table";
import Loader from "../../components-common/layout/loader";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store/auth-user";
import axios from "@/lib/web-api/axios";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import Select from "react-select";
import SingleSelect from "../../components-common/single-select";
import { SearchInput } from "../../components-common/search-field";
import { useSearchParams } from "next/navigation";

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
  vendorId: string;
  sku: string;
  description: string;
  media: string[];
  channelName: string;
  categories: ICategory[];
  category?: string;
  subCategories?: string;
  tag?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreator {
  _id: string;
  user_name: string;
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
export interface IVendor {
  _id: string;
  business_name: string;
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
  product: IProduct;
  request: IRequest;
  fromUser: {
    _id: string;
    business_name: string;
    profile_image: string;
  };
  crmLink: string|null;
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    width: "200px",
    borderRadius: "8px",
  }),
};
export interface IStatus {
  value: string;
  label: string;
}
export default function CollaborationList() {
  const translate = useTranslations();
  const searchParams = useSearchParams();
  const dashboardStatus = searchParams.get("status");
  const { account: user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [collaborations, setCollaborations] = useState<ICollaboration[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const statusOptions: IStatus[] = [
    { value: "", label: "Select Status" },
    { value: "REQUESTED", label: "Requested" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PENDING", label: "Pending" },
    { value: "ACTIVE", label: "Active" },
    { value: "EXPIRED", label: "Expired" },
  ];
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;
  // get user role
  const getUserType = () => {
    return { vendor: "Creator", creator: "Brand" }[user?.role] ?? "";
  };
  // Get Creator list
  const fetchCollaboration = useCallback(
    async (
      page: number,
      isInternalLoader = false,
      searchValue: string = "",
      status: string = ""
    ) => {
      isInternalLoader ? setInternalLoader(true) : setLoading(true);
      try {
        const response = await axios.get(
          `/product/collaboration/list?page=${page}&limit=${pageSize}${
            searchValue ? `&search=${searchValue}` : ""
          }${status ? `&collaborationStatus=${status}` : ""}`
        );
        if (response.status === 200) {
          const collaborationData = response.data.data;
          if (collaborationData && typeof collaborationData === "object") {
            const collaborationArray = collaborationData.data || [];
            const collaborationCount = collaborationData.total || 0;

            if (Array.isArray(collaborationArray)) {
              let result = collaborationArray.map((ele: ICollaboration) => {
                let category =
                  ele.product.categories?.length > 0
                    ? ele.product.categories
                        .filter(
                          (category: ICategory) => category?.parentId === null
                        )
                        .map((category: ICategory) => {
                          return category?.name;
                        })
                        .join(", ")
                    : "";
                let subCategory =
                  ele.product.categories?.length > 0
                    ? ele.product.categories
                        .filter(
                          (category: ICategory) => category?.parentId !== null
                        )
                        .map((category: ICategory) => {
                          return category?.name;
                        })
                        .join(", ")
                    : "";
                let tag = ele.product.tags.join(", ");
                return {
                  ...ele,
                  product: {
                    ...ele?.product,
                    category: category,
                    subCategories: subCategory,
                    tag,
                  },
                };
              });
              setCollaborations([...result]);
              setTotalPages(Math.ceil(collaborationCount / pageSize));
              setCurrentPage(page);
            } else {
              setCollaborations([]);
              setCurrentPage(1);
            }
            setLoading(false);
            setInternalLoader(false);
          } else {
            setCollaborations([]);
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
    if(dashboardStatus){
      handleSelectStatus(dashboardStatus)
    }
    else fetchCollaboration(currentPage);
  }, [dashboardStatus]);
  const debouncedSearch = useCallback(
    debounce((value: string, status: string) => {
      fetchCollaboration(1, true, value, status);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value, selectedStatus);
  };

  const handlePageChange = (page: number) => {
    page !== currentPage &&
      fetchCollaboration(page, true, search, selectedStatus);
  };
  const handleSelectStatus = (selectedOption: string) => {
    setSelectedStatus(selectedOption);
    fetchCollaboration(1, true, search, selectedOption);
  };
  console.log("selectedStatus",selectedStatus)
  return (
    <div className="p-4 rounded-lg flex flex-col gap-3 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_Product")}
            />
            <div className="flex md:flex-row flex-col gap-2 justify-end relative z-[999] md:w-fit w-full">
              <SingleSelect
                value={selectedStatus}
                onChange={handleSelectStatus}
                options={statusOptions}
                placeholder="Select Status"
              />
            </div>
          </div>
          {internalLoader && <Loader />}
          {collaborations?.length > 0 ? (
            <>
              <CollaborationTable
                data={collaborations}
                filter={filter}
                user={getUserType()}
                fetchCollaboration={() => fetchCollaboration(currentPage, true)}
              />
              {/* Pagination */}
              <TablePagination
                totalPages={totalPages}
                activePage={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyPlaceHolder
              title={"No_Collaborations_Available_Title"}
              description={"No_Collaborations_Available_Description"}
            />
          )}
        </>
      )}
    </div>
  );
}
