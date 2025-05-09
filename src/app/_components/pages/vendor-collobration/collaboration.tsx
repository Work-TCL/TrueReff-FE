"use client";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import Loading from "@/app/vendor/loading";
import CollaborationTable from "./collaboration-table";
import { useTranslations } from "next-intl";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useAuthStore } from "@/lib/store/auth-user";
import axios from "@/lib/web-api/axios";
import { debounce } from "lodash";
import Loader from "../../components-common/layout/loader";
import { SearchInput } from "../../components-common/search-field";
import SingleSelect from "../../components-common/single-select";
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
    user_name: string;
    profile_image: string;
  };
}

export interface IStatus {
  value: string;
  label: string;
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
export default function CollaborationList() {
  const t = useTranslations();
  const { account: user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [collaborations, setCollaborations] = useState<ICollaboration[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const statusOptions: IStatus[] = [
    { value: "", label: "Select Status" },
    { value: "REQUESTED", label: "Requested" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PENDING", label: "Pending" },
    { value: "LIVE", label: "Live" },
    { value: "EXPIRED", label: "Expired" },
  ];
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
      isInternalLoader?: boolean,
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
                ele.product.category =
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
                ele.product.subCategories =
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
                ele.product.tag = ele.product.tags.join(", ");
                return { ...ele };
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
    fetchCollaboration(currentPage);
  }, []);
  const handlePageChange = (page: number) => {
    page !== currentPage &&
      fetchCollaboration(page, true, search, selectedStatus);
  };
  const debouncedSearch = useCallback(
    debounce((value: string, status: string) => {
      fetchCollaboration(currentPage, true, value, status);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value, selectedStatus);
  };
  const handleSelectStatus = (selectedOptions: any) => {
    setSelectedStatus(selectedOptions);
    fetchCollaboration(currentPage, true, search, selectedOptions);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={t("Search_Product")}
            />
            <div className="flex md:flex-row flex-col gap-2 w-full justify-end">
              <SingleSelect
                value={selectedStatus}
                onChange={handleSelectStatus}
                options={statusOptions}
                placeholder="Select Status"
              />
            </div>
          </div>
          {internalLoader && <Loader />}
          {!loading && collaborations?.length > 0 ? (
            <>
              <CollaborationTable
                data={collaborations}
                user={getUserType()}
                refreshCentral={() => fetchCollaboration(currentPage, true)}
                loader={internalLoader}
              />
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
              title={"No_Collaborations_Available_Title"}
              description={"No_Collaborations_Available_Description"}
            />
          )}
        </>
      )}
    </div>
  );
}
