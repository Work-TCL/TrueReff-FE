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
import { useRouter, useSearchParams } from "next/navigation";
export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  freeProduct: boolean;
  _id: string;
  title: string;
  channelProductId: string;
  vendorId: string;
  sku: string;
  description: string;
  media: string[];
  price: number;
  channelName: string;
  category: ICategory[];
  subCategory: string[];
  tags: string[];
  lifeTime: boolean;  
  startDate: string;
  endDate: string | null;
  status: string;
  commission: number;
  commission_type: string;
  referenceLinks: string[];
  creatorMaterial: string[];
  videoType: string[];
  channels: string[];
  createdAt: string;
  updatedAt: string;
  categories?: string;
  tag?: string;
}

export interface ICreator {
  _id: string;
  accountId: string;
  full_name: string;
  user_name: string;
  email: string;
  phone: string;
  dob: string; // or Date if you parse it
  gender: "Male" | "Female" | "Other" | string;
  state: string;
  city: string;
  category: string[]; // Array of category IDs
  sub_category: string[]; // Array of subcategory IDs
  tags: string[];
  channels: string[]; // Channel IDs
  completed_step: number;
  status: "APPROVED" | "PENDING" | "REJECTED" | string;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  completed: number;
  instagram_link?: string;
  youtube_link?: string;
  banner_image?: string;
  profile_image?: string;
  store_description?: string; // HTML string
  store_name: string;
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

interface INegotiation {
  agreedByVendor: boolean;
  agreedByCreator: boolean;
};
export interface ICollaboration {
  negotiation: INegotiation;
  _id: string;
  creatorId: ICreator;
  productId: IProduct;
  vendorId: string;
  requestedBy: string;
  collaborationStatus: string;
  utmLink: string | null,
  crmLink: string | null,
  commissionValue: number;
  commissionType: string;
  startAt: string | null,
  expiresAt: string;
  bids: any[],
  createdAt: string;
  updatedAt: string;
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
  const router = useRouter();
  const { account: user } = useAuthStore();
  const searchParams = useSearchParams();
  const status = searchParams.get("status")??"";
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
    { value: "ACTIVE", label: "Active" },
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
          `/product/collaboration/vendor/list?page=${page}&limit=${pageSize}${
            searchValue ? `&search=${searchValue}` : ""
          }${status ? `&status=${status}` : ""}`
        );
        console.log("response",response)
        if (response.status === 200) {
          const collaborationData = response.data.data;
          if (collaborationData && typeof collaborationData === "object") {
            const collaborationArray = collaborationData.list || [];
            const collaborationCount = collaborationData.total || 0;

            if (Array.isArray(collaborationArray)) {
              let result = collaborationArray.map((ele: ICollaboration) => {
                ele.productId.categories =
                  ele.productId.category?.length > 0
                    ? ele.productId.category
                        .filter(
                          (category: ICategory) => category?.parentId === null
                        )
                        .map((category: ICategory) => {
                          return category?.name;
                        })
                        .join(", ")
                    : "";
                ele.productId.tag = ele.productId.tags.join(", ");
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
    if(status){
      setSelectedStatus(status);
      fetchCollaboration(currentPage, true, search, status);
    }
    else {
      setSelectedStatus("");
      fetchCollaboration(currentPage);}
  }, [status]);
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
    router.push(`?status=${selectedOptions}`)
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
              title={t("No_Collaborations_Available_Title")}
              description={t("No_Collaborations_Available_Description")}
            />
          )}
        </>
      )}
    </div>
  );
}
