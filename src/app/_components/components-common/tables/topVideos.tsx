"use client";

import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { CustomTableHead } from "./CustomTableHead";
import { CustomTableCell } from "./CustomTableCell";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { useTranslations } from "next-intl";

// Sample Data
const videos = [
  {
    thumbnail: "/assets/creator/profile/videoThumbnail1.png",
    title: "Best Grooming Tips for Men",
    platform: "YouTube",
    views: "520K",
    likes: "18K",
    comments: "900",
    watchTime: "4,500",
  },
  {
    thumbnail: "/assets/creator/profile/videoThumbnail1.png",
    title: "Winter Skincare Hacks",
    platform: "Instagram",
    views: "410K",
    likes: "22K",
    comments: "1.2K",
    watchTime: "NA",
  },
  {
    thumbnail: "/assets/creator/profile/videoThumbnail1.png",
    title: "Affordable vs. Luxury Watches",
    platform: "TikTok",
    views: "1,700",
    likes: "25K",
    comments: "1.5K",
    watchTime: "NA",
  },
  {
    thumbnail: "/assets/creator/profile/videoThumbnail1.png",
    title: "Affordable vs. Luxury Watches",
    platform: "TikTok",
    views: "1,700",
    likes: "25K",
    comments: "1.5K",
    watchTime: "NA",
  },
];
export default function TopVideosCraetor() {
  const translate = useTranslations();
  return (
    <div className="p-4 bg-white rounded-[20px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="sm:text-xl text-base text-text font-semibold">
          {translate("top_10_videos")}
        </h2>
      </div>
      <div className="overflow-auto">
        <Table className="min-w-full border border-gray-200 rounded-2xl">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Thumbnail")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Video_Title")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Platform")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Views")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Likes")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Comments")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-center font-medium">
                {translate("Watch_Time")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video, index) => (
              <TableRow key={index} className="even:bg-gray-50">
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-10 h-10"
                  />
                </CustomTableCell>
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={video.title}
                  />
                </CustomTableCell>
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={video.platform}
                  />
                </CustomTableCell>
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={video.views}
                  />
                </CustomTableCell>

                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={video.likes}
                  />
                </CustomTableCell>
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={video.comments}
                  />
                </CustomTableCell>
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm text-center">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={video.watchTime}
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
