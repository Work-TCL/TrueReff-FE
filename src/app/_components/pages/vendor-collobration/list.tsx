"use client";

import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { translate } from "@/lib/utils/translate";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import CreatorTable from "./creator-table";
import Loading from "@/app/vendor/loading";
import axios from "@/lib/web-api/axios";
import { SearchInput } from "../../components-common/search-field";
import SingleSelect from "../../components-common/single-select";
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

const filterOption = [
  { value: "5", label: "Last 5 Videos" },
  { value: "30", label: "Last 1 Month" },
];
export default function CreatorList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [creators, setCreators] = useState<ICreator[]>([]);
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);

  // Get Creator list
  const getCreatorList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/auth/creator/list?page=${currentPage}&limit=${pageSize}`
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
        } else {
          setCreators([]);
          setCurrentPage(1);
          setLoading(false);
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    getCreatorList();
  }, [currentPage]);

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
  const handleFilterValue = (value: string) => {
    setFilter(value);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder={translate("Search_creator")}
        />
        <div className="flex items-center gap-[10px]">
          {/* <PiListChecksLight size={35} />
          <IoGridOutline size={30} /> */}
          {/* <Button variant="outline" className="text-black w-[100px] rounded-[4px]">
                        <FaSlidersH /> {translate("Filters")}
                    </Button> */}
          <SingleSelect
            placeholder="Select Status"
            options={filterOption}
            value={filter}
            onChange={handleFilterValue}
          />
        </div>
      </div>
      {loading && <Loading />}
      {creators?.length > 0 && <CreatorTable data={creators} filter={filter} />}
      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <TablePagination
          totalPages={totalPages}
          activePage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
