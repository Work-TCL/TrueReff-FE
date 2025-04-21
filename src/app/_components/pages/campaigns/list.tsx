"use client";

import { useCallback, useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { Eye, PencilLine, Search, Trash2 } from "lucide-react";
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


const campaignStatus:{[key:string]:string} = {
  ACTIVE: "Running",
  PENDING: "Hold",
  EXPIRED: "Completed"
}

export default function CampaignList() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [campaigns, setCampaigns] = useState<ICampaignData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const pageSize = 20;
  const [totalPages,setTotalPages] = useState<number>(0);
  const fetchCampaignList = async (page:number,internalLoader:boolean = false,searchValue:string = '',status:string = '') => {
    internalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await getCampaignList({ page, limit:pageSize,search:searchValue,status });
      if(response?.campaigns?.length){
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
    control: (base:any) => ({
      ...base,
      width: "200px",
      borderRadius: '8px'
    })
  };

  const handlePageChange = (page:number) => {
    page !== currentPage && fetchCampaignList(page,true,search,status)
    setCurrentPage(page); 
  }

  const debouncedSearch = useCallback(
    debounce((value: string, status: string) => {
      fetchCampaignList(1, true, value, status);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value, selectedStatus)
  };

  const handleOnSelectStatus = (selectedOption:any) => {
    setSelectedStatus(selectedOption?.value??"");
    fetchCampaignList(1,true,search,selectedOption?.value);
  }

  return (
    <div className="p-4 rounded-lg flex flex-col gap-3 h-full">
      {internalLoading && <Loader/>}
      {loading ? <Loading/> : <><div className="flex md:flex-row flex-col justify-between items-center gap-2">
        <div className={`relative`}>
          <Input
            value={search}
            onChange={handleSearch}
            placeholder={translate("Search_Campaign")}
            className="p-3 rounded-lg bg-white pl-10 max-w-[320px] w-full gray-color" // Add padding to the left for the icon
          />
          <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />{" "}
        </div>
        <div className="flex md:flex-row flex-col gap-2 w-full justify-end">
          <Select
            styles={customStyles}
            value={[{ value: selectedStatus, label: selectedStatus? campaignStatus[selectedStatus]: "Select Status" }]}
            onChange={handleOnSelectStatus}
            options={[
              {value:"",label: "Select Status"},
              {value:"ACTIVE",label: "Running"},
              {value:"PENDING",label: "Hold"},
              {value:"EXPIRED",label: "Completed"},
            ]}
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder="Select Status"
          />
        </div>
      </div>
      {campaigns?.length > 0 ? <><div className="overflow-auto">
        <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
          <TableHeader className="bg-stroke">
            <TableRow>
              <CustomTableHead className="w-1/7">
                {translate("Campaign_Name")}
              </CustomTableHead>
              <CustomTableHead className="w-1/7">
                {translate("Product_Name")}
              </CustomTableHead>
              <CustomTableHead className="w-1/7">
                {translate("Total_Sales")}
              </CustomTableHead>
              <CustomTableHead className="w-1/7">
                {translate("Total_Views")}
              </CustomTableHead>
              <CustomTableHead className="w-1/7">
                {translate("Omni_Channel")}
              </CustomTableHead>
              <CustomTableHead className="w-1/7 text-center">
                {translate("Status")}
              </CustomTableHead>
              <CustomTableHead className="w-1/7 text-center">
                {translate("Action")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign, index) => (
              <TableRow key={index} className="even:bg-gray-100 odd:bg-white">
                <CustomTableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      {campaign?.imageUrls?.length > 0 && <AvatarImage src={campaign?.imageUrls[0]} />}
                    </Avatar>
                    {campaign.name}
                  </div></CustomTableCell>
                <CustomTableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      {campaign?.productId?.media?.length && <AvatarImage src={campaign?.productId?.media[0]} />}
                    </Avatar>
                    {campaign.productId?.title}
                  </div>
                </CustomTableCell>
                <CustomTableCell>{"-"}</CustomTableCell>
                <CustomTableCell>{"-"}</CustomTableCell>
                <CustomTableCell>{campaign.channels?.join(", ")}</CustomTableCell>
                <CustomTableCell className="flex justify-center">
                  <div
                    className={`w-1/2 ${
                      campaign.status === "ACTIVE"
                        ? "bg-[#5856D61A] text[#5856D6]"
                        : campaign.status === "EXPIRED"
                        ? "bg-[#0982281A] text-[#098228]"
                        : "bg-[#FF95001A] text-[#FF9500]"
                    } p-2 rounded-md text-center`}
                  >
                    {campaignStatus[campaign.status]}
                  </div>
                </CustomTableCell>
                <CustomTableCell>
                  <div className="flex justify-center gap-3">
                    <Eye strokeWidth={1.5}
                      color="#FF4979"
                      className="cursor-pointer"
                      onClick={() => router.push(`/vendor/campaign/${campaign?._id}?view=true`)}
                    />
                    <PencilLine strokeWidth={1.5}
                      className="cursor-pointer"
                      onClick={() => router.push(`/vendor/campaign/${campaign?._id}`)}
                    />
                    <Trash2 strokeWidth={1.5} color="#FF3B30" className="cursor-pointer" />
                  </div>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
        {totalPages > 1 && <TablePagination
          totalPages={totalPages}
          activePage={currentPage}
          onPageChange={handlePageChange}
        />}</>: <EmptyPlaceHolder title="No_Campaigns_Available_Title" description="NO_Campaigns_Available_Description"/>}</>}
    </div>
  );
}
