"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { IChannel, ICreator } from "./list";
import { useRouter } from "next/navigation";
import Loader from "../../components-common/layout/loader";
import { useTranslations } from "next-intl";
import CollaborateRequest from "../../components-common/dialogs/collaborate-creator-form";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { ImageOff } from "lucide-react";
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
  loader: boolean;
  handleCollaborateNow: (creatorId: string) => void;
}
const CreatorTable = ({
  data,
  filter,
  loader,
  handleCollaborateNow,
}: ICreatorTableProps) => {
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
    router.push(`/creator/profile/${id}`);
  };
  return (
    <div className="overflow-auto">
      {loader && <Loader />}
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
            <CustomTableHead className="w-1/4">
              {translate("Tags")}
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
            <CustomTableHead className="w-1/6 text-center">
              {translate("Action")}
            </CustomTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((creator: any, index: number) => (
            <TableRow key={index} className="bg-white hover:bg-gray-100">
              <CustomTableCell>
                <div
                  className="flex items-center justify-start cursor-pointer gap-2"
                  onClick={() => handleViewCreatorDetails(creator._id)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      className={creator.profile_image ? "" : "opacity-50"}
                      src={
                        creator.profile_image
                          ? creator.profile_image
                          : "/assets/profile/profile-image.png"
                      }
                    />
                  </Avatar>
                  {creator.full_name}
                </div>
              </CustomTableCell>
              <CustomTableCell>
                <TruncateWithToolTip
                  checkHorizontalOverflow={false}
                  linesToClamp={2}
                  text={creator.short_description || creator.long_description}
                />
              </CustomTableCell>
              <CustomTableCell>
                <TruncateWithToolTip
                  checkHorizontalOverflow={false}
                  linesToClamp={2}
                  text={creator.categories ?? ""}
                />
              </CustomTableCell>
              <CustomTableCell>
                <TruncateWithToolTip
                  checkHorizontalOverflow={false}
                  linesToClamp={2}
                  text={creator.tag}
                />
              </CustomTableCell>
              <CustomTableCell className="text-center">
                {getInstagramView(creator.channels)}
              </CustomTableCell>
              <CustomTableCell className="text-center">
                {getYoutubeView(creator.channels)}
              </CustomTableCell>
              <CustomTableCell>{creator.pastSales ?? ""}</CustomTableCell>
              <CustomTableCell className="text-center">
                <Button
                  variant="outline"
                  className="whitespace-nowrap  border border-[#FFEDF2] bg-[#FFEDF2] text-[#FF4979] rounded-md transition-all py-3 px-[10px] text-sm"
                  onClick={() => handleCollaborateNow(creator?._id)}
                >
                  {translate("Collaborate_Now")}
                </Button>
              </CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CreatorTable;
