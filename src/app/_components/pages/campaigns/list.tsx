"use client";

import { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { Input } from "@/components/ui/input";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import { FaSlidersH } from "react-icons/fa";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { translate } from "../../../../lib/utils/translate";

// Sample Data
const campaigns = [
  {
    campaignName: "Summer Boost",
    productImageUrl: "/monica.png",
    productName: "Sneakers",
    category: "Fashion",
    creatorName: "Sophia Taylor",
    totalSales: "2,500",
    totalViews: "1.2M",
    sellingPrice: "$850",
    omniChannel: "IG, YT",
    status: "Running",
  },
  {
    campaignName: "Winter Essentials",
    productImageUrl: "/winter_jacket.png",
    productName: "Winter Jacket",
    category: "Apparel",
    creatorName: "Liam Johnson",
    totalSales: "1,800",
    totalViews: "850K",
    sellingPrice: "$320",
    omniChannel: "FB, IG",
    status: "Completed",
  },
  {
    campaignName: "Tech Explosion",
    productImageUrl: "/smartwatch.png",
    productName: "Smartwatch",
    category: "Gadgets",
    creatorName: "Olivia Brown",
    totalSales: "3,200",
    totalViews: "2.4M",
    sellingPrice: "$199",
    omniChannel: "YT, FB",
    status: "Hold",
  },
  {
    campaignName: "Fitness Frenzy",
    productImageUrl: "/fitness_gear.png",
    productName: "Fitness Gear",
    category: "Sports",
    creatorName: "Noah Davis",
    totalSales: "4,500",
    totalViews: "3.1M",
    sellingPrice: "$120",
    omniChannel: "IG, TT",
    status: "Running",
  },
  {
    campaignName: "Glam Up",
    productImageUrl: "/makeup_kit.png",
    productName: "Makeup Kit",
    category: "Beauty",
    creatorName: "Emma Wilson",
    totalSales: "2,100",
    totalViews: "1.8M",
    sellingPrice: "$99",
    omniChannel: "YT, FB, IG",
    status: "Completed",
  },
];

export default function CampaignList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(campaigns.length / pageSize);

  const paginatedData = campaigns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2">
      <div className="md:text-[20px] text-base text-500">
      <Input placeholder={translate("Search_campaign...")} />
        </div>
        <div className="flex items-center gap-[10px]">
          <PiListChecksLight className="md:size-[30px] size-6" />
          <IoGridOutline className="md:size-[30px] size-6" />
          <Button
            variant="outline"
            className="text-black w-[100px] rounded-[4px]"
          >
            <FaSlidersH /> {translate("Filters")}
          </Button>
        </div>
      </div>
      <div className="overflow-auto">
        <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
          <TableHeader className="bg-stroke">
            <TableRow>
              <CustomTableHead className="w-1/6">
                {translate("Product_ID")}
              </CustomTableHead>
              <CustomTableHead className="w-1/4">
                {translate("Product_Name")}
              </CustomTableHead>
              <CustomTableHead className="w-1/6">
                {translate("Categories")}
              </CustomTableHead>
              <CustomTableHead className="w-1/4">
                {translate("Creator_Name")}
              </CustomTableHead>
              <CustomTableHead className="w-1/4">
                {translate("Total_Sales")}
              </CustomTableHead>
              <CustomTableHead className="w-1/6">
                {translate("Total_Views")}
              </CustomTableHead>
              <CustomTableHead className="w-1/8">
                {translate("Omni_Channel")}
              </CustomTableHead>
              <CustomTableHead className="w-1/4">
                {translate("Status")}
              </CustomTableHead>
              <CustomTableHead className="w-1/6 text-center">
                {translate("Action")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((campaign, index) => (
              <TableRow key={index} className="even:bg-gray-100 odd:bg-white">
                <CustomTableCell>{campaign.campaignName}</CustomTableCell>
                <CustomTableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={"/assets/product/image-square.svg"} />
                    </Avatar>
                    {campaign.productName}
                  </div>
                </CustomTableCell>
                <CustomTableCell>{campaign.category}</CustomTableCell>
                <CustomTableCell>{campaign.creatorName}</CustomTableCell>
                <CustomTableCell>{campaign.totalSales}</CustomTableCell>
                <CustomTableCell>{campaign.totalViews}</CustomTableCell>
                <CustomTableCell>{campaign.omniChannel}</CustomTableCell>
                <CustomTableCell>
                  <div
                    className={`${
                      campaign.status === "Running"
                        ? "bg-[#5856D61A] text[#5856D6]"
                        : campaign.status === "Completed"
                        ? "bg-[#0982281A] text-[#098228]"
                        : "bg-[#FF95001A] text-[#FF9500]"
                    } p-2 rounded-md text-center`}
                  >
                    {campaign.status}
                  </div>
                </CustomTableCell>
                <CustomTableCell>
                  <div className="flex justify-center gap-3">
                    <Eye
                      color="#FF4979"
                      className="cursor-pointer"
                      onClick={() => router.push(`/product/${index}?view=true`)}
                    />
                    <PencilLine
                      className="cursor-pointer"
                      onClick={() => router.push(`/product/${index}`)}
                    />
                    <Trash2 color="#FF3B30" className="cursor-pointer" />
                  </div>
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