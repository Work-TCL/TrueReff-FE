"use client";

import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Eye, Heart } from "lucide-react";
import { translate } from "@/lib/utils/translate";
import { CustomTableHead } from "../../components-common/tables/CustomTableHead";
import { CustomTableCell } from "../../components-common/tables/CustomTableCell";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TablePagination } from "../../components-common/tables/Pagination";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { getCreatorList } from "@/lib/web-api/auth";
import Loading from "@/app/creator/loading";
import Loader from "../../components-common/layout/loader";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";

interface ITableProps {
  title: string;
}
export interface ICategory {
  _id: string;
  name: string;
}
interface IChannel {
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
  instagramViews?: string;
  youtubeViews?: string;
  pastSales?: string;
}
function formatNumber(num: number = 0) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num === 0 ? "" : num.toString();
}
export default function Creators({title}:ITableProps) {
  const router = useRouter();
  const [currentPage,setCurrentPage] = useState<number>(1);
  const [totalPages,setTotalPages] = useState<number>(0);
  const [creators,setCreators] = useState<ICreator[]>([])
  const [loading,setLoading] = useState<boolean>(true);
  const [internalLoading,setInternalLoading] = useState<boolean>(false);
  const limit = 10;
  const [filter,setFilter] = useState("5");

  const getInstagramView: (channels: IChannel[]) => string = (
      channels: IChannel[]
    ) => {
      let instagram = channels.find(
        (ele: { channelType: string }) => ele.channelType === "instagram"
      );
      return "";
    };
    const getYoutubeView: (channels: IChannel[]) => string = (
      channels: IChannel[]
    ) => {
      let youtube = channels.find(
        (ele: { channelType: string }) => ele.channelType === "youtube"
      );
      return youtube
        ? formatNumber(
            filter === "5" ? youtube?.lastFiveVideoViews : youtube?.lastMonthViews
          )
        : "-";
    };
    const handleViewCreatorDetails = (id: string) => {
      router.push(`/creator/profile/${id}`);
    };
    useEffect(() => {
      fetchCreatorList(currentPage);
    },[])
    const fetchCreatorList = async (page:number,internalLoading:boolean = false) => {
      internalLoading ? setInternalLoading(true) : setLoading(true);
      try{
        const response = await getCreatorList(page,limit)
       const data = response?.list;
       const count = response?.count;
       if(data?.length > 0){
        const creatorList = data?.map((creator:ICreator) => {
          creator.categories = creator?.category?.length > 0 ? creator?.category.map((cat:ICategory) => cat?.name)?.join(", "):"";
          creator.tag = creator?.tags?.length > 0 ? creator?.tags.map((tg:string) => tg)?.join(", "):"";
          return {...creator};
        })
        setCreators(creatorList);
        setTotalPages(Math.ceil(count / limit));
        setCurrentPage(page);
       } else {
        setCreators([]);
        setTotalPages(0);
        setCurrentPage(1);
       }
      } catch(error) {
        let errorMessage = await getErrorMessage(error);
        toastMessage.error(errorMessage);
      } finally{
        setLoading(false);
        setInternalLoading(false);
      }
    }
    const handlePageChange = (page:number) => {
      page !== currentPage && fetchCreatorList(page,true);
    }
  return (
    <div className="relative flex flex-col gap-3 p-4 bg-white rounded-[20px]">
      <div className="flex justify-between items-center">
        <h2 className="md:text-xl text-base text-text font-semibold">
          {translate(title)}
        </h2>
      </div>
      {internalLoading && <Loading isTransparent={true} height="fit"/>}
      {loading ? <Loading height="fit"/> : creators?.length > 0 ? <div className="overflow-auto">
        <Table className="min-w-full border border-gray-200 rounded-2xl">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <CustomTableHead className="w-2/6 p-2 text-text text-left text-sm">
                {translate("Creator_Name")}
              </CustomTableHead>
              <CustomTableHead className="w-2/6 p-2 text-text text-left text-sm">
                {translate("Creator_Bio")}
              </CustomTableHead>
              <CustomTableHead className="w-1/6 p-2 text-text text-left text-sm">
                {translate("Category")}
              </CustomTableHead>
              <CustomTableHead className="w-1/6 p-2 text-text text-left text-sm">
                {translate("Tag")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creators.map((creator, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleViewCreatorDetails(creator?._id)}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={creator?.profile_image ? creator?.profile_image : "/assets/profile/profile-image.png" } />
                    </Avatar>
                    {creator?.full_name}
                  </div>
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <span className="text-text ">
                    {" "}
                    <TruncateWithToolTip
                      checkHorizontalOverflow={false}
                      linesToClamp={2}
                      text={creator?.short_description? creator?.short_description : creator?.long_description}
                    />
                  </span>
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <span className="text-text ">
                    {" "}
                    <TruncateWithToolTip
                      checkHorizontalOverflow={false}
                      linesToClamp={2}
                      text={creator?.categories}
                    />
                  </span>
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={creator?.tag}
                  />
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>:<EmptyPlaceHolder
                  title={"No_Creators_Available"}
                  description={
                    "It seems there are currently no creators to display. Please check back later."
                  }
                />}
      {totalPages > 1 && <TablePagination totalPages={totalPages} activePage={currentPage} onPageChange={handlePageChange}  />}
    </div>
  );
}
