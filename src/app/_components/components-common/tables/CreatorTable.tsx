"use client";

import { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableCell } from "./CustomTableCell";
import { CustomTableHead } from "./CustomTableHead";
import { TablePagination } from "./Pagination";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";

// Sample Data
const creators = [
  {
    avatar: "/monica.png",
    name: "Monica Bing",
    bio: "Fashion stylist sharing trendy looks and budget finds",
    category: "Jewelry",
    instagramView: "120K",
    youtubeView: "200K",
    pastSales: "850 Products",
    collaboration: 'Collaborated on "Fall Collection Campaign"',
  },
  {
    avatar: "/rachel.png",
    name: "Rachel Green",
    bio: "Interior designer sharing chic home decor ideas",
    category: "Home Decor",
    instagramView: "80K",
    youtubeView: "150K",
    pastSales: "500 Products",
    collaboration: 'Collaborated on "Summer Home Makeover"',
  },
  {
    avatar: "/chandler.png",
    name: "Chandler Bing",
    bio: "Tech guru exploring the latest gadgets and tech trends",
    category: "Gadgets",
    instagramView: "150K",
    youtubeView: "250K",
    pastSales: "300 Products",
    collaboration: 'Collaborated on "Smart Home Innovation"',
  },
  {
    avatar: "/phoebe.png",
    name: "Phoebe Buffay",
    bio: "Musician and songwriter spreading positivity through melodies",
    category: "Music",
    instagramView: "70K",
    youtubeView: "120K",
    pastSales: "200 Songs",
    collaboration: 'Collaborated on "Feel Good Vibes Album"',
  },
  {
    avatar: "/joey.png",
    name: "Joey Tribbiani",
    bio: "Food enthusiast exploring the world's most delicious cuisines",
    category: "Food",
    instagramView: "100K",
    youtubeView: "180K",
    pastSales: "100 Recipes",
    collaboration: 'Collaborated on "Taste Around the Globe"',
  },
  {
    avatar: "/ross.png",
    name: "Ross Geller",
    bio: "Paleontologist uncovering ancient mysteries and fossils",
    category: "Science",
    instagramView: "90K",
    youtubeView: "160K",
    pastSales: "50 Articles",
    collaboration: 'Collaborated on "Dinosaur Discoveries Exhibition"',
  },
  {
    avatar: "/janice.png",
    name: "Janice Litman",
    bio: "Lifestyle coach motivating individuals to achieve their goals",
    category: "Motivation",
    instagramView: "60K",
    youtubeView: "110K",
    pastSales: "100 Coaching Sessions",
    collaboration: 'Collaborated on "Life Transformation Program"',
  },
  {
    avatar: "/gunther.png",
    name: "Gunther",
    bio: "Coffee connoisseur brewing the perfect cup of coffee",
    category: "Coffee",
    instagramView: "50K",
    youtubeView: "100K",
    pastSales: "50 Coffee Blends",
    collaboration: 'Collaborated on "Barista\'s Choice Collection"',
  },
  {
    avatar: "/estelle.png",
    name: "Estelle Leonard",
    bio: "Talent agent discovering new stars in the entertainment industry",
    category: "Entertainment",
    instagramView: "110K",
    youtubeView: "200K",
    pastSales: "10 Rising Talents",
    collaboration: 'Collaborated on "Star Search Showcase"',
  },
  {
    avatar: "/mike.png",
    name: "Mike Hannigan",
    bio: "Jazz musician creating soulful melodies and tunes",
    category: "Music",
    instagramView: "95K",
    youtubeView: "180K",
    pastSales: "150 Songs",
    collaboration: 'Collaborated on "Jazz Fusion Project"',
  },
  {
    avatar: "/emily.png",
    name: "Emily Waltham",
    bio: "Fashion expert showcasing the latest trends in couture",
    category: "Fashion",
    instagramView: "130K",
    youtubeView: "220K",
    pastSales: "700 Products",
    collaboration: 'Collaborated on "London Fashion Week"',
  },
  {
    avatar: "/richard.png",
    name: "Richard Burke",
    bio: "Ophthalmologist sharing insights on eye health",
    category: "Health",
    instagramView: "40K",
    youtubeView: "80K",
    pastSales: "200 Medical Papers",
    collaboration: 'Collaborated on "Vision Awareness Campaign"',
  },
];

export default function CreatorTable() {
  const translate = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(creators.length / pageSize);

  const paginatedData = creators.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 bg-white shadow-sm rounded-lg">
      <div className="overflow-auto">
        <Table className="min-w-full border border-gray-200 overflow-hidde  n rounded-2xl">
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
            {paginatedData.map((creator, index) => (
              <TableRow key={index} className="even:bg-gray-100 odd:bg-white">
                <CustomTableCell>
                  <div className="flex items-center gap-2">
                    {creator.avatar ? (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={creator.avatar} />
                      </Avatar>
                    ) : (
                      <ImageOff className="w-6 h-6 text-gray-400" />
                    )}
                    <TruncateWithToolTip
                      checkHorizontalOverflow={false}
                      linesToClamp={2}
                      text={creator.name}
                    />
                  </div>
                </CustomTableCell>
                <CustomTableCell>
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={creator.bio}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  {" "}
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={creator.category}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  {" "}
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={creator.instagramView}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  {" "}
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={creator.youtubeView}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  {" "}
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={creator.pastSales}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  {" "}
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={creator.collaboration}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  <Button
                    variant="outline"
                    className="whitespace-nowrap  bg-red-500 text-white rounded-md transition-all hover:bg-red-200 py-3 px-[10px] text-sm"
                  >
                    {translate("Collaborate_Now")}
                  </Button>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <TablePagination
          totalPages={totalPages}
          activePage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
