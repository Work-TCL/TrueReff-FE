"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IChannel, ICreator } from "./list";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components-common/data-table";
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

  const creatorColumns: ColumnDef<ICreator>[] = [
    {
      id: "creator_name",
      header: () => translate("Creator_Name"),
      cell: ({ row }) => {
        const creator = row.original;
        return (
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
        );
      },
    },
    {
      id: "bio",
      header: () => translate("Creator_Bio"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.short_description || row.original.long_description}
        />
      ),
    },
    {
      id: "categories",
      header: () => translate("Categories"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.categories ?? ""}
        />
      ),
    },
    {
      id: "tags",
      header: () => translate("Tags"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.tag ?? ""}
        />
      ),
    },
    {
      id: "instagram_view",
      header: () => (
        <div className="text-center">{translate("Instagram_View")}</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {getInstagramView(row.original.channels)}
        </div>
      ),
    },
    {
      id: "youtube_view",
      header: () => (
        <div className="text-center">{translate("YouTube_View")}</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {getYoutubeView(row.original.channels)}
        </div>
      ),
    },
    {
      id: "past_sales",
      header: () => translate("Past_Sales"),
      cell: ({ row }) => row.original.pastSales ?? "",
    },
    {
      id: "action",
      header: () => <div className="text-center">{translate("Action")}</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="whitespace-nowrap border border-[#FFEDF2] bg-[#FFEDF2] text-[#FF4979] rounded-md transition-all py-3 px-[10px] text-sm"
            onClick={() => handleCollaborateNow(row.original._id)}
          >
            {translate("Collaborate_Now")}
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable data={data} columns={creatorColumns} />;
};

export default CreatorTable;
