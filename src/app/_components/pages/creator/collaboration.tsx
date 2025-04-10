"use client";

import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import Loading from "@/app/vendor/loading";
import CollaborationTable from "./collaboration-table";
import { useSession } from "next-auth/react";
import Loader from "../../components-common/layout/loader";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useTranslations } from "next-intl";

interface IVendorContact {
  name: string;
  phone: string;
  email: string;
  isDefault: boolean;
  _id: string;
}

interface IVendorAddress {
  name: string;
  phone: string;
  zip_code: string;
  city: string;
  state: string;
  house_no: string;
  address: string;
  isDefault: boolean;
}

interface IVendor {
  _id: string;
  accountId: string;
  business_name: string;
  company_email: string;
  company_phone: string;
  gst_number: string;
  website: string;
  type_of_business: string;
  contacts: IVendorContact[];
  omni_channels: string[];
  brand_documents: any[];
  addresses: IVendorAddress[];
  createdAt: string;
  updatedAt: string;
}
interface ICategory {
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
  sku: string;
  description: string;
  media: string[];
  channelName: string;
  category: ICategory[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  categories: string;
}
export interface ICollaboration {
  _id: string;
  creatorId: string;
  productId: IProduct;
  collaborationStatus: string;
  utmLink: string | null;
  discountType: string;
  discountValue: number;
  couponCode: string;
  commissionPercentage: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  vendorId: IVendor;
}

export default function CollaborationList() {
  const axios = useAxiosAuth();
  const session = useSession();
  const translate = useTranslations();
  const user = session?.data?.user ?? { type: "vendor" };
  const [loading, setLoading] = useState<boolean>(false);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [collaborations, setCollaborations] = useState<ICollaboration[]>([]);
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);

  // get user role
  const getUserType = () => {
    return { vendor: "Creator", creator: "Brand" }[user?.type] ?? "";
  };
  // Get Creator list
  const fetchCollaboration = useCallback(
    async (page: number, isInternalLoader = false) => {
      isInternalLoader ? setInternalLoader(true) : setLoading(true);
      try {
        const response = await axios.get(
          `/product/collaboration/list?page=${currentPage}&limit=${pageSize}`
        );
        if (response.status === 200) {
          const collaborationData = response.data.data;
          if (collaborationData && typeof collaborationData === "object") {
            const collaborationArray = collaborationData.data || [];
            const collaborationCount = collaborationData.total || 0;

            if (Array.isArray(collaborationArray)) {
              let result = collaborationArray.map((ele: ICollaboration) => {
                let category = ele.productId.category
                  .filter((cat: ICategory) => cat?.parentId === null)
                  .map((category: ICategory) => {
                    return category?.name;
                  })
                  .join(", ");
                return {
                  ...ele,
                  productId: { ...ele?.productId, categories: category },
                };
              });
              setCollaborations([...result]);
              setTotalPages(Math.ceil(collaborationCount / pageSize));
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
    [axios, pageSize]
  );

  useEffect(() => {
    fetchCollaboration(currentPage);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
  };

  const handlePageChange = (page: number) => {
    page !== currentPage && fetchCollaboration(page, true);
    setCurrentPage(page);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      {loading ? (
        <Loading />
      ) : collaborations?.length > 0 ? (
        <>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="md:text-[20px] text-base text-500">
              <Input
                value={search}
                onChange={handleSearch}
                placeholder={translate("Search_product")}
                className="md:h-10 h-8"
              />
            </div>
            <div className="flex items-center gap-[10px]">
              <PiListChecksLight className="md:size-[30px] size-6" />
              <IoGridOutline className="md:size-[30px] size-6" />
              {/* <Button variant="outline" className="text-black w-[100px] rounded-[4px]">
                        <FaSlidersH /> {translate("Filters")}
                    </Button> */}
              {/* <select className="bg-white rounded-sm border border-black h-[30px]" value={filter} onChange={handleFilterValue}>
                        <option value="" disabled>Filters</option>
                        <option value={5}>Last 5 Videos</option>
                        <option value={1}>Last 1 Month</option>
                    </select> */}
            </div>
          </div>
          {internalLoader && <Loader />}
          <CollaborationTable
            data={collaborations}
            filter={filter}
            user={getUserType()}
            fetchCollaboration={() => fetchCollaboration(currentPage)}
          />
          {/* Pagination */}
          <div className="flex justify-end items-center mt-4">
            <TablePagination
              totalPages={totalPages}
              activePage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyPlaceHolder
          title={"No_Collaborations_Available_Title"}
          description={"No_Collaborations_Available_Description"}
        />
      )}
    </div>
  );
}
