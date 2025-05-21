"use client";
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
import SingleSelect from "../../components-common/single-select";
import { SearchInput } from "../../components-common/search-field";
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
  endDate: string;
  status: string;
  commission: number;
  commission_type: string;
  referenceLinks: string[];
  creatorMaterial: string[];
  videoType: string[];
  channels: string[];
  notes: string;
  discount: number;
  discountType: string;
  couponCode: string;
  createdAt: string;
  updatedAt: string;
  categories?: string[];
  tag?: string;
}

export interface IVendorContact {
  name: string;
  email: string;
  phone: string;
  _id: string;
}

export interface IVendor {
  _id: string;
  accountId: string;
  category: string[];
  sub_category: string[];
  completed_step: number;
  contacts: IVendorContact[];
  business_name: string;
  company_email: string;
  type_of_business: string;
  address: string;
  state: string;
  city: string;
  pin_code: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  banner_image: string;
  profile_image: string;
  gst_certificate: string;
  gst_number: string;
  pan_number: string;
}

export interface INegotiation {
  agreedByVendor: boolean;
  agreedByCreator: boolean;
}

export interface ICollaboration {
  negotiation: INegotiation;
  _id: string;
  creatorId: string;
  productId: IProduct;
  vendorId: IVendor;
  requestedBy: string;
  collaborationStatus: string;
  utmLink: string | null;
  crmLink: string | null;
  commissionValue: number;
  commissionType: string;
  startAt: string | null;
  expiresAt: string | null;
  bids: any[]; // Replace `any` with a specific type if bids have a defined structure
  createdAt: string;
  updatedAt: string;
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
  const router = useRouter();
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
          `/product/collaboration/creator/list?page=${page}&limit=${pageSize}${
            searchValue ? `&search=${searchValue}` : ""
          }${status ? `&status=${status}` : ""}`
        );
        if (response.status === 200) {
          const collaborationData = response.data.data;
          if (collaborationData && typeof collaborationData === "object") {
            const collaborationArray = collaborationData.list || [];
            const collaborationCount = collaborationData.total || 0;

            if (Array.isArray(collaborationArray)) {
              let result = collaborationArray.map((ele: ICollaboration) => {
                let category =
                  ele.productId.category?.length > 0
                    ? ele.productId.category
                        .filter(
                          (category: ICategory) => category?.parentId === null
                        )
                        .map((category: ICategory) => {
                          return category?.name;
                        })
                    : [];
                let tag = ele.productId.tags.join(", ");
                return {
                  ...ele,
                  productId: {
                    ...ele?.productId,
                    categories: category,
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
    if (dashboardStatus) {
      setSelectedStatus(dashboardStatus);
      fetchCollaboration(1, true, search, dashboardStatus);
    } else {
      setSelectedStatus("");
      fetchCollaboration(currentPage);
    }
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
    router.push(`?status=${selectedOption}`)
  };
  console.log("selectedStatus", selectedStatus);
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
                placeholder={translate("SelectStatus")}
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
              title={translate("No_Collaborations_Available_Title")}
              description={translate("No_Collaborations_Available_Description")}
            />
          )}
        </>
      )}
    </div>
  );
}
