"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { translate } from "../../../../lib/utils/translate";
import { getCategories } from "@/lib/web-api/auth";
import { ICategoryData } from "../creator-registration/components/profile-setup";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

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
  const translate = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategoryData[]>([]);
  const [subCategory, setSubCategory] = useState<ICategoryData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const pageSize = 10;
  const totalPages = Math.ceil(campaigns.length / pageSize);

  const paginatedData = campaigns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      const data = response?.data?.data || [];
      setCategories(data);
      setParentCategory(data.filter((ele) => ele?.parentId === null));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    const optionsSubCategory = categories.filter((ele) =>
      selectedCategories.includes(ele?.parentId || "")
    );
    setSubCategory(optionsSubCategory);

    // Filter selected subcategories to only include available ones
    const availableSubCategoriesIds = optionsSubCategory.map((v) => v._id);
    setSelectedSubCategories((prev) =>
      prev.filter((id) => availableSubCategoriesIds.includes(id))
    );
  }, [selectedCategories, categories]);

  const customStyles = {
    placeholder: (base: any) => ({
      ...base,
      fontSize: "0.875rem ", // Tailwind text-sm
      color: "#a1a1aa", // Tailwind slate-400
    }),
  };

  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      <div className="flex md:flex-row flex-col justify-between items-center gap-2">
        <Input
          placeholder={translate("Search_campaign...")}
          className="md:h-10 md:w-auto w-full"
        />
        <div className="flex md:flex-row flex-col gap-2 w-full justify-end">
          <Select
            styles={customStyles}
            value={selectedCategories.map((id) => {
              const match = parentCategory.find((cat) => cat._id === id);
              return { value: id, label: match?.name || id };
            })}
            isMulti
            onChange={(selectedOptions) => {
              const selectedIds = selectedOptions.map((opt) => opt.value);
              setSelectedCategories(selectedIds);
            }}
            options={parentCategory.map((ele) => ({
              value: ele._id,
              label: ele.name,
            }))}
            isOptionDisabled={() => selectedCategories.length >= 3}
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder="Parent Categories (max 3)"
          />
          <Select
            styles={customStyles}
            placeholder="Subcategories (max 3)"
            value={selectedSubCategories.map((id) => {
              const match = subCategory.find((cat) => cat._id === id);
              return { value: id, label: match?.name || id };
            })}
            isMulti
            onChange={(selectedOptions) => {
              const selectedIds = selectedOptions.map((opt) => opt.value);
              setSelectedSubCategories(selectedIds);
            }}
            options={subCategory.map((ele) => ({
              value: ele._id,
              label: ele.name,
            }))}
            isOptionDisabled={() => selectedSubCategories.length >= 3}
            className="basic-multi-select focus:outline-none focus:shadow-none"
            classNamePrefix="select"
          />
        </div>
        {/* <div className="hidden md:flex items-center gap-[10px]">
          <PiListChecksLight className="md:size-[30px] size-6" />
          <IoGridOutline className="md:size-[30px] size-6" />
          <Button
            variant="outline"
            className="text-black w-[100px] rounded-[4px]"
          >
            <FaSlidersH /> {translate("Filters")}
          </Button>
        </div> */}
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
                    className={`${campaign.status === "Running"
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
