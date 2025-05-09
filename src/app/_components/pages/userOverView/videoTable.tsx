"use client";

import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Heart } from "lucide-react";
import { CustomTableHead } from "../../components-common/tables/CustomTableHead";
import { CustomTableCell } from "../../components-common/tables/CustomTableCell";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { useTranslations } from "next-intl";

const activities = [
  {
    thumbnail: "",
    VideoTitle: "Best Grooming Tips for Men",
    platform: "YouTube",
    Views: "520K",
    Likes: "18K",
  },
  {
    Thumbnail: "",
    VideoTitle: "Winter Skincare Hacks",
    platform: "Instagram",
    Views: "410K",
    Likes: "22K",
  },
];

export default function VideosTable() {
  const translate = useTranslations();
  return (
    <div className="p-4 bg-white rounded-[20px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl text-base text-text font-semibold">
          {" "}
          {translate("top_10_videos")}
        </h2>
        <Button variant="link" className="text-primary md:h-10 h-7">
          {" "}
          {translate("View_all")}
        </Button>
      </div>
      <div className="overflow-auto">
        <Table className="min-w-full border border-gray-200 rounded-2xl">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Thumbnail")}
              </CustomTableHead>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Video_Title")}
              </CustomTableHead>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Platform")}
              </CustomTableHead>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Views")}
              </CustomTableHead>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Likes")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity, index) => (
              <TableRow key={index} className="even:bg-gray-50">
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={""} />
                    </Avatar>
                  </div>
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <span className="text-secondary font-medium">
                    <TruncateWithToolTip
                      checkHorizontalOverflow={false}
                      linesToClamp={2}
                      text={activity.VideoTitle}
                    />
                  </span>
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={activity.platform}
                  />
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={activity.Views}
                  />
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={activity.Likes}
                  />
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
