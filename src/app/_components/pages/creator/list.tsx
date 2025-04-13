"use client";

import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import CreatorTable from "./creator-table";
import Loading from "@/app/vendor/loading";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useTranslations } from "next-intl";
export interface ICategory {
  _id: string;
  name: string;
}

export interface IChannel {
  _id: string;
  creatorId: string;
  channelId: string;
  channelName: string;
  handleName: string;
  token: string;
  channelType: string;
  createdAt: string;
  updatedAt: string;
  lastFiveVideoViews: number;
  lastMonthViews: number;
}
export interface ICreator {
  _id: string;
  accountId: string;
  full_name: string;
  user_name: string;
  phone: string;
  title: string;
  long_description: string;
  short_description: string;
  profile_image: string;
  banner_image: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  sub_category: string[];
  category: ICategory[];
  channels: IChannel[];
  categories?: string;
  tag?: string;
}

export default function CreatorList() {
  const axios = useAxiosAuth();
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [creators, setCreators] = useState<ICreator[]>([]);
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);

  // Get Creator list
  const getCreatorList = useCallback(
    async (page: number, isInternalLoader?: boolean) => {
      isInternalLoader ? setInternalLoader(true) : setLoading(true);
      try {
        const response = await axios.get(
          `/auth/creator/list?page=${page}&limit=${pageSize}`
        );
        if (response.status === 200) {
          const creatorData = response.data.data;
          if (creatorData && typeof creatorData === "object") {
            const creatorsArray = creatorData.list || [];
            const creatorsCount = creatorData.count || 0;

            if (Array.isArray(creatorsArray)) {
              let result = creatorsArray.map((ele: ICreator) => {
                ele.categories = ele.category
                  ?.map((ele: { name: string }) => ele?.name)
                  .join(",");
                ele.tag = ele.tags?.join(",");
                return { ...ele };
              });
              setCreators([...result]);
              setTotalPages(Math.ceil(creatorsCount / pageSize));
            } else {
              setCreators([]);
              setCurrentPage(1);
            }
            setLoading(false);
            setInternalLoader(false);
          } else {
            setCreators([]);
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
    getCreatorList(currentPage);
  }, []);
  const handlePageChange = (page: number) => {
    page !== currentPage && getCreatorList(page, true);
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
  };
  const getFilterData = (data: ICreator[]) => {
    let result = data;
    if (search) {
      result = result.filter((ele: ICreator) => {
        return (
          ele?.full_name
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          ele?.short_description
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          ele?.long_description
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          (ele?.tag ?? "")
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          (ele?.categories ?? "")
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
        );
      });
    }
    return result;
  };
  const handleFilterValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      {loading ? (
        <Loading />
      ) : creators?.length > 0 ? (
        <>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="md:text-[20px] text-base text-500">
              <Input
                value={search}
                onChange={handleSearch}
                placeholder={translate("Search_creator")}
                className="md:h-10 h-8"
              />{" "}
            </div>
            <div className="flex items-center gap-[10px]">
              <PiListChecksLight className="md:size-[30px] size-6" />
              <IoGridOutline className="md:size-[30px] size-6" />
              {/* <Button variant="outline" className="text-black w-[100px] rounded-[4px]">
                        <FaSlidersH /> {translate("Filters")}
                    </Button> */}
              <select
                className="bg-white rounded-sm border border-black h-[30px]"
                value={filter}
                onChange={handleFilterValue}
              >
                <option value="" disabled>
                  Filters
                </option>
                <option value={5}>Last 5 Videos</option>
                <option value={1}>Last 1 Month</option>
              </select>
            </div>
          </div>
          <CreatorTable
            data={creators}
            filter={filter}
            loader={internalLoader}
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
          title={"No_Creators_Available_Title"}
          description={"No_Creators_Available_Description"}
        />
      )}
    </div>
  );
}
