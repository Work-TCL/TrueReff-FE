"use client";

import { useCallback, useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { Eye, ImageOff, PencilLine, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { translate } from "../../../../lib/utils/translate";
import { getCategories } from "@/lib/web-api/auth";
import { ICategoryData } from "../creator-registration/components/profile-setup";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { getCampaignList } from "@/lib/web-api/campaign";
import { ICampaignData } from "@/lib/types-api/campaign";
import Loader from "../../components-common/layout/loader";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import Loading from "@/app/vendor/loading";
import { debounce } from "lodash";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import CampaignCard from "./_components/campaign-card";
import { SearchInput } from "../../components-common/search-field";
import { ViewToggle } from "../../components-common/view-toggle";
import DataTable from "../../components-common/data-table";
import { ColumnDef } from "@tanstack/react-table";
import SingleSelect from "../../components-common/single-select";

export const campaignStatus: { [key: string]: string } = {
  ACTIVE: "Running",
  PENDING: "Hold",
  EXPIRED: "Completed",
};

export default function CampaignList() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [campaigns, setCampaigns] = useState<ICampaignData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const pageSize = 20;
  const [totalPages, setTotalPages] = useState<number>(0);
  const fetchCampaignList = async (
    page: number,
    internalLoader: boolean = false,
    searchValue: string = "",
    status: string = ""
  ) => {
    internalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await getCampaignList({
        page,
        limit: pageSize,
        search: searchValue,
        status,
      });
      if (response?.campaigns?.length) {
        setCampaigns([...response?.campaigns]);
        setCurrentPage(page);
        setTotalPages(Math.ceil(response?.count / pageSize));
        setLoading(false);
        setInternalLoading(false);
      } else {
        setLoading(false);
        setInternalLoading(false);
        setCurrentPage(1);
        setTotalPages(0);
        setCampaigns([]);
      }
    } catch (error) {
      setLoading(false);
      setInternalLoading(false);
      setCurrentPage(1);
      setTotalPages(0);
      setCampaigns([]);
    }
  };

  useEffect(() => {
    fetchCampaignList(currentPage);
  }, []);

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

  const handlePageChange = (page: number) => {
    page !== currentPage && fetchCampaignList(page, true, search, status);
    setCurrentPage(page);
  };

  const debouncedSearch = useCallback(
    debounce((value: string, status: string) => {
      fetchCampaignList(1, true, value, status);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value, selectedStatus);
  };

  const handleOnSelectStatus = (selectedOption: any) => {
    setSelectedStatus(selectedOption?.value ?? "");
    fetchCampaignList(1, true, search, selectedOption?.value);
  };

  const campaignColumns: ColumnDef<ICampaignData>[] = [
    {
      id: "campaign_name",
      header: () => translate("Campaign_Name"),
      cell: ({ row }) => {
        const campaign = row.original;
        const router = useRouter();
        return (
          <div
            className="flex items-center justify-start gap-2 cursor-pointer"
            onClick={() =>
              router.push(`/vendor/campaign/${campaign?._id}?view=true`)
            }
          >
            {campaign?.imageUrls?.length > 0 && campaign.imageUrls[0] ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={campaign.imageUrls[0]} />
              </Avatar>
            ) : (
              <ImageOff className="w-6 h-6 text-gray-400" />
            )}
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={campaign.name}
            />
          </div>
        );
      },
    },
    {
      id: "product_name",
      header: () => translate("Product_Name"),
      cell: ({ row }) => {
        const campaign = row.original;
        const router = useRouter();
        return (
          <div
            className="flex items-center justify-start gap-2 cursor-pointer"
            onClick={() =>
              router.push(`/vendor/products/view/${campaign?.productId?._id}`)
            }
          >
            {campaign?.productId?.media?.length > 0 &&
            campaign.productId.media[0] ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={campaign.productId.media[0]} />
              </Avatar>
            ) : (
              <ImageOff className="w-6 h-6 text-gray-400" />
            )}
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={campaign.productId?.title}
            />
          </div>
        );
      },
    },
    {
      id: "total_sales",
      header: () => translate("Total_Sales"),
      cell: () => "-",
    },
    {
      id: "total_views",
      header: () => translate("Total_Views"),
      cell: () => "-",
    },
    {
      id: "omni_channel",
      header: () => translate("Omni_Channel"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.channels?.join(", ") ?? ""}
        />
      ),
    },
    {
      id: "status",
      header: () => <div className="text-center">{translate("Status")}</div>,
      cell: ({ row }) => {
        const campaign = row.original;
        const statusColorClass =
          {
            ACTIVE: "bg-[#5856D61A] text-[#5856D6]",
            EXPIRED: "bg-[#0982281A] text-[#098228]",
            UPCOMING: "bg-[#FF95001A] text-[#FF9500]",
          }[campaign.status] || "bg-gray-100 text-gray-500";

        return (
          <div className="flex justify-center">
            <div
              className={`w-full p-2 rounded-md text-center ${statusColorClass}`}
            >
              {campaignStatus[campaign.status]}
            </div>
          </div>
        );
      },
    },
    {
      id: "action",
      header: () => <div className="text-center">{translate("Action")}</div>,
      cell: ({ row }) => {
        const campaign = row.original;
        const router = useRouter();
        return (
          <div className="flex justify-center gap-3">
            <PencilLine
              strokeWidth={1.5}
              className="cursor-pointer"
              onClick={() => router.push(`/vendor/campaign/${campaign?._id}`)}
            />
          </div>
        );
      },
    },
  ];

  const tableContent = () => {
    return <DataTable columns={campaignColumns} data={campaigns} />;
  };

  return (
    <div className="p-4 rounded-lg flex flex-col gap-3 h-full">
      {internalLoading && <Loader />}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex md:flex-row flex-col justify-between items-center gap-2 flex-wrap">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_Campaign")}
            />
            <div className="flex flex-row gap-2 justify-end items-center md:w-fit w-full">
              <SingleSelect
                value={selectedStatus}
                onChange={handleOnSelectStatus}
                options={[
                  { value: "", label: "Select Status" },
                  { value: "ACTIVE", label: "Running" },
                  { value: "PENDING", label: "Hold" },
                  { value: "EXPIRED", label: "Completed" },
                ]}
                placeholder="Select Status"
              />
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
          {campaigns?.length > 0 ? (
            <>
              {" "}
              {viewMode === "table" && tableContent()}
              {viewMode === "card" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4 h-full bg-white p-4 rounded-[20px] overflow-auto">
                  {campaigns.map((item: any, i) => (
                    <div key={i} className="flex h-fit w-full">
                      <CampaignCard item={item} />
                    </div>
                  ))}
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
              title="No_Campaigns_Available_Title"
              description="NO_Campaigns_Available_Description"
            />
          )}
        </>
      )}
    </div>
  );
}
