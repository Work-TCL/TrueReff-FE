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
        <div className="text-center">{translate("Followers")}</div>
      ),
      cell: ({ row }) => (
          <div className="flex gap-2 justify-center">
          <div className="flex flex-col items-center p-2">
            <div>
              <img
                src="/assets/creator/Instagram-icon.svg"
                width={30}
                height={30}
              />
            </div>
              <div>{row?.original?.instagramFollowers}</div>
          </div>
          <div className="flex flex-col items-center p-2">
            <div>
              <img
                src="/assets/creator/Youtube-icon.svg"
                width={30}
                height={30}
              />
            </div>
              <div>{row?.original?.youtubeFollowers}</div>
          </div>
        </div>
      ),
    },
    // {
    //   id: "youtube_view",
    //   header: () => (
    //     <div className="text-center">{translate("Youtube_followers")}</div>
    //   ),
    //   cell: ({ row }) => (
    //     <div className="text-center">
    //       {getYoutubeView(row.original.channels)}
    //     </div>
    //   ),
    // },
    {
      id: "orders",
      header: () => translate("Orders"),
      cell: ({ row }) => row.original.pastSales ?? "",
    },
    {
      id: "revenue",
      header: () => translate("Revenues"),
      cell: ({ row }) => row.original.pastSales ?? "",
    },
    {
      id: "conversion_rate",
      header: () => translate("Conversion_Rate"),
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
