"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { IChannel, ICreator } from "./list";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
function formatNumber(num: number = 0) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num === 0 ? "" : num.toString();
}

interface ICreatorTableProps {
  data: ICreator[];
  filter: string;
}
const CreatorTable = ({ data, filter }: ICreatorTableProps) => {
  const translate = useTranslations();
  const router = useRouter();
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
    router.push(`/vendor/creators/${id}`);
  };
  return (
    <div className="overflow-auto">
      <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
        <TableHeader className="bg-stroke">
          <TableRow>
            <CustomTableHead className="w-1/6">
              {translate("Creator_Name")}
            </CustomTableHead>
            <CustomTableHead className="w-1/4">
              {translate("Creator_Bio")}
            </CustomTableHead>
            <CustomTableHead className="w-1/6">
              {translate("Categories")}
            </CustomTableHead>
            <CustomTableHead className="w-1/8">
              {translate("Instagram_View")}
            </CustomTableHead>
            <CustomTableHead className="w-1/8">
              {translate("YouTube_View")}
            </CustomTableHead>
            <CustomTableHead className="w-1/6">
              {translate("Past_Sales")}
            </CustomTableHead>
            <CustomTableHead className="w-1/4">
              {translate("Tags_Collaboration")}
            </CustomTableHead>
            <CustomTableHead className="w-1/6 text-center">
              {translate("Action")}
            </CustomTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            <>
              {data.map((creator: any, index: number) => (
                <TableRow key={index} className="even:bg-gray-100 odd:bg-white">
                  <CustomTableCell>
                    <div
                      className="flex items-center gap-2"
                      onClick={() => handleViewCreatorDetails(creator._id)}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={creator.profile_image} />
                        <AvatarImage
                          src={"/assets/creator/creator-image.svg"}
                        />
                      </Avatar>
                      {creator.full_name}
                    </div>
                  </CustomTableCell>
                  <CustomTableCell>
                    {creator.short_description || creator.long_description}
                  </CustomTableCell>
                  <CustomTableCell>{creator.categories}</CustomTableCell>
                  <CustomTableCell className="text-center">
                    {getInstagramView(creator.channels)}
                  </CustomTableCell>
                  <CustomTableCell className="text-center">
                    {getYoutubeView(creator.channels)}
                  </CustomTableCell>
                  <CustomTableCell>{creator.pastSales ?? ""}</CustomTableCell>
                  <CustomTableCell>{creator.tag}</CustomTableCell>
                  <CustomTableCell className="text-center">
                    <Button
                      variant="outline"
                      className="whitespace-nowrap  bg-red-500 text-white rounded-md transition-all hover:bg-red-200 py-3 px-[10px] text-sm"
                    >
                      {translate("Collaborate_Now")}
                    </Button>
                  </CustomTableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={8}>
                <EmptyPlaceHolder />
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CreatorTable;
export function EmptyPlaceHolder() {
  const translate = useTranslations();
  return (
    <div className=" flex items-center justify-center flex-col flex-1 col-span-full text-center h-[200px] text-gray-500 p-4 bg-white ">
      <Info className="mx-auto mb-2 text-gray-400" />
      <h2 className="text-lg font-semibold">
        {translate("No_Creators_Available_Title")}
      </h2>
      <p className="text-sm">
        {translate("No_Creators_Available_Description")}
      </p>
    </div>
  );
}
