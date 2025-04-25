"use client";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import { FaSlidersH } from "react-icons/fa";
import { translate } from "@/lib/utils/translate";
import Loading from "@/app/vendor/loading";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";

export interface ICommonItem {
  _id: string;
  [key: string]: any;
}

interface ProductLayoutProps<T = ICommonItem> {
  fetchData: (
    page: number,
    pageSize: number
  ) => Promise<{ data: T[]; total: number }>;
  CardComponent: React.ComponentType<{ item: T }>;
  TableComponent: React.ComponentType<{
    data: T[];
    type?: "table" | "card";
    CardComponent?: (item: any) => ReactElement;
  }>;
  pageSize?: number;
  initialViewMode?: "table" | "card";
}

export default function ProductLayout<T>({
  fetchData,
  CardComponent,
  TableComponent,
  pageSize = 20,
  initialViewMode = "table",
}: ProductLayoutProps<T>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<T[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "card">(initialViewMode);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchData(currentPage, pageSize);
      setItems(res.data);
      setTotalPages(Math.ceil(res.total / pageSize));
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    getData();
  }, [currentPage]);

  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full ">
      <div className="flex justify-between items-center gap-2">
        <div className="relative md:text-[20px] text-base text-500 max-w-[350px] w-full">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={translate("Search_creator")}
            className="md:h-10 h-8 w-full"
          />
        </div>
        <div className="flex items-center gap-[10px]">
          <PiListChecksLight
            className={`cursor-pointer md:size-[30px] size-6 ${
              viewMode === "table" ? "text-blue-600" : "text-gray-400"
            }`}
            onClick={() => setViewMode("table")}
          />
          <IoGridOutline
            className={`cursor-pointer md:size-[30px] size-6 ${
              viewMode === "card" ? "text-blue-600" : "text-gray-400"
            }`}
            onClick={() => setViewMode("card")}
          />
          <Button
            variant="outline"
            className="text-black w-[100px] rounded-[4px] md:h-10 h-8"
          >
            <FaSlidersH /> {translate("Filters")}
          </Button>
        </div>
      </div>

      {loading && <Loading />}

      {!loading && (
        <TableComponent
          data={items}
          type={viewMode}
          CardComponent={(item) => (
            <div key={item?._id} className="flex h-full">
              <CardComponent item={item} />
            </div>
          )}
        />
      )}

      {items?.length > 0 && (
        <div className="flex justify-end items-center mt-4">
          <TablePagination
            totalPages={totalPages}
            activePage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
