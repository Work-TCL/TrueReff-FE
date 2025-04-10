"use client";

import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { translate } from "@/lib/utils/translate";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import CreatorTable from "./creator-table";
import Loading from "@/app/vendor/loading";
import CollaborationTable from "./collaboration-table";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
export interface ICategory {
  _id: string;
  name: string;
}

export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  sku: string;
  description: string;
  media: string[];
  channelName: string;
  category: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
export interface ICollaboration {
  _id: string;
  creatorId: {
    _id: string;
    accountId: string;
    full_name: string;
    user_name: string;
    phone: string;
    profile_image: string;
  };
  productId: IProduct;
  vendorId: string;
  collaborationStatus: string;
  utmLink: string | null;
  discountType: string;
  discountValue: number;
  couponCode: string;
  commissionPercentage: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function CollaborationList() {
  const axios = useAxiosAuth();
  const session = useSession();
  const t = useTranslations();
  const user = session?.data?.user ?? { type: "vendor" };
  const [loading, setLoading] = useState<boolean>(false);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [collaborations, setCollaborations] = useState<ICollaboration[]>([]);
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // get user role
  const getUserType = () => {
    return { vendor: "Creator", creator: "Brand" }[user?.type] ?? "";
  };
  // Get Creator list
  const getCreatorList = useCallback(async (page:number,isInternalLoader?:boolean) => {
    isInternalLoader ? setInternalLoader(true) : setLoading(true);
    try {
      const response = await axios.get(
        `/product/collaboration/list?page=${page}&limit=${pageSize}`
      );
      if (response.status === 200) {
        const collaborationData = response.data.data;
        if (collaborationData && typeof collaborationData === "object") {
          const collaborationArray = collaborationData.data || [];
          const collaborationCount = collaborationData.total || 0;

          if (Array.isArray(collaborationArray)) {
            let result = collaborationArray.map((ele: ICollaboration) => {
              ele.productId.category = (
                ele.productId.category as unknown as { name: string }[]
              )?.map((cat) => String(cat?.name));
              ele.productId.tags = ele.productId.tags;
              return { ...ele };
            });
            setCollaborations([...result]);
            setTotalPages(Math.ceil(collaborationCount / pageSize));
          } else {
            setCollaborations([]);
            setCurrentPage(1);
          }
          setLoading(false);
          setInternalLoader(false)
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
  }, [axios, pageSize]);

  useEffect(() => {
    getCreatorList(currentPage);
  }, []);
  const handlePageChange = (page:number) => {
    page !== currentPage && getCreatorList(page,true);
    setCurrentPage(page);
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      {loading ? <Loading /> : (!loading && collaborations?.length > 0) ? <><div className="flex justify-between items-center flex-wrap gap-2">
        <div className="text-[20px] text-500">
          <Input
            value={search}
            onChange={handleSearch}
            placeholder={t("Search_product")}
          />
        </div>
        <div className="flex items-center gap-[10px]">
          <PiListChecksLight size={35} />
          <IoGridOutline size={30} />
        </div>
      </div>
      <CollaborationTable
        data={collaborations}
        filter={filter}
        user={getUserType()}
        refreshCentral={() => getCreatorList(currentPage)}
        loader={internalLoader}
      />
        <div className="flex justify-end items-center mt-4">
          <TablePagination
            totalPages={totalPages}
            activePage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
        </>:<EmptyPlaceHolder title={"No_Collaborations_Available_Title"} description={"No_Collaborations_Available_Description"}/>}
    </div>
  );
}
