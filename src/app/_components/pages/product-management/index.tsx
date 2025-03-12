"use client";

import { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { Input } from "@/components/ui/input";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import { FaSlidersH } from "react-icons/fa";
import { translate } from "@/lib/utils/translate";
import { PencilLine } from "lucide-react";

interface IProducts {
    productImage: string,
    name: string,
    category: string,
    trendingTag: string,
    affiliateLink: string
}
// Sample Data
const products = [
    {
        productImage: "/monica.png",
        name: "Monica Bing",
        category: "Jewelry",
        trendingTag: 'Top Product',
        affiliateLink: "https://affiliate.com/bag1"
    },
    {
        productImage: "/lucy.png",
        name: "Lucy Hall",
        category: "Clothing",
        trendingTag: 'New Arrival',
        affiliateLink: "https://affiliate.com/bag2"
    },
    {
        productImage: "/sophia.png",
        name: "Sophia Lopez",
        category: "Accessories",
        trendingTag: 'Best Seller',
        affiliateLink: "https://affiliate.com/bag3"
    },
    {
        productImage: "/emma.png",
        name: "Emma Stone",
        category: "Beauty",
        trendingTag: 'Limited Edition',
        affiliateLink: "https://affiliate.com/bag4"
    },
    {
        productImage: "/ava.png",
        name: "Ava Green",
        category: "Home Decor",
        trendingTag: 'Most Popular',
        affiliateLink: "https://affiliate.com/bag5"
    },
    {
        productImage: "/mia.png",
        name: "Mia Bright",
        category: "Footwear",
        trendingTag: 'Top Seller',
        affiliateLink: "https://affiliate.com/bag6"
    },
    {
        productImage: "/olivia.png",
        name: "Olivia Brown",
        category: "Jewelry",
        trendingTag: 'Trending',
        affiliateLink: "https://affiliate.com/bag7"
    },
    {
        productImage: "/isabella.png",
        name: "Isabella Rose",
        category: "Accessories",
        trendingTag: 'Hot Deal',
        affiliateLink: "https://affiliate.com/bag8"
    },
    {
        productImage: "/chloe.png",
        name: "Chloe Harris",
        category: "Electronics",
        trendingTag: 'On Sale',
        affiliateLink: "https://affiliate.com/bag9"
    },
    {
        productImage: "/ella.png",
        name: "Ella White",
        category: "Clothing",
        trendingTag: 'Summer Collection',
        affiliateLink: "https://affiliate.com/bag10"
    },
    {
        productImage: "/lucas.png",
        name: "Lucas Turner",
        category: "Jewelry",
        trendingTag: 'Top Seller',
        affiliateLink: "https://affiliate.com/bag11"
    },
    {
        productImage: "/mia2.png",
        name: "Mia Clark",
        category: "Footwear",
        trendingTag: 'Exclusive',
        affiliateLink: "https://affiliate.com/bag12"
    },
    {
        productImage: "/james.png",
        name: "James Bond",
        category: "Clothing",
        trendingTag: 'New Style',
        affiliateLink: "https://affiliate.com/bag13"
    },
    {
        productImage: "/lucy2.png",
        name: "Lucy Perez",
        category: "Accessories",
        trendingTag: 'Hot Pick',
        affiliateLink: "https://affiliate.com/bag14"
    },
    {
        productImage: "/max.png",
        name: "Max Taylor",
        category: "Home Decor",
        trendingTag: 'Fresh Finds',
        affiliateLink: "https://affiliate.com/bag15"
    },
    {
        productImage: "/chris.png",
        name: "Chris Walker",
        category: "Electronics",
        trendingTag: 'Latest Tech',
        affiliateLink: "https://affiliate.com/bag16"
    },
    {
        productImage: "/julia.png",
        name: "Julia Thomas",
        category: "Beauty",
        trendingTag: 'Natural Products',
        affiliateLink: "https://affiliate.com/bag17"
    },
    {
        productImage: "/diana.png",
        name: "Diana Smith",
        category: "Footwear",
        trendingTag: 'Stylish',
        affiliateLink: "https://affiliate.com/bag18"
    },
    {
        productImage: "/olga.png",
        name: "Olga Davis",
        category: "Jewelry",
        trendingTag: 'Luxury',
        affiliateLink: "https://affiliate.com/bag19"
    },
    {
        productImage: "/nina.png",
        name: "Nina Green",
        category: "Accessories",
        trendingTag: 'Best Offer',
        affiliateLink: "https://affiliate.com/bag20"
    }
];




export default function ProductManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(products.length / pageSize);

    const paginatedData = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="p-4 rounded-lg flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="text-[20px] text-500">
                    <Input placeholder={translate("Search_product")} />
                </div>
                <div className="flex items-center gap-[10px]">
                    <PiListChecksLight size={35} />
                    <IoGridOutline size={30} />
                    <Button variant="outline" className="text-black w-[100px] rounded-[4px]">
                        <FaSlidersH /> {translate("Filters")}
                    </Button>
                </div>
            </div>
            <div className="overflow-auto">
                <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                    <TableHeader className="bg-stroke">
                        <TableRow >
                            <CustomTableHead className="w-1/6">{translate("Product_Image")}</CustomTableHead>
                            <CustomTableHead className="w-1/4">{translate("Products_Name")}</CustomTableHead>
                            <CustomTableHead className="w-1/6">{translate("Category")}</CustomTableHead>
                            <CustomTableHead className="w-1/4">{translate("Trending_Tag")}</CustomTableHead>
                            <CustomTableHead className="w-1/4">{translate("Affiliate_Link")}</CustomTableHead>
                            <CustomTableHead className="w-1/6 text-center">{translate("Action")}</CustomTableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((creator, index) => (
                            <TableRow key={index} className="even:bg-gray-100 odd:bg-white">
                                <CustomTableCell>
                                    <div className="flex items-center gap-2">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="4" fill="#F2F4F5"/>
<rect width="32" height="32" rx="4" fill="url(#pattern0_1206_3031)"/>
<defs>
<pattern id="pattern0_1206_3031" patternContentUnits="objectBoundingBox" width="1" height="1">
<use transform="scale(0.000520833)"/>
</pattern>
<image id="image0_1206_3031" width="1920" height="1920" preserveAspectRatio="none"/>
</defs>
</svg>

                                        {/* <Avatar className="w-8 h-8">
                                            <AvatarImage src={creator.productImage} />
                                        </Avatar> */}
                                    </div>
                                </CustomTableCell>
                                <CustomTableCell >{creator.name}</CustomTableCell>
                                <CustomTableCell>{creator.category}</CustomTableCell>
                                <CustomTableCell>{creator.trendingTag}</CustomTableCell>
                                <CustomTableCell><span className="text-[#007AFF]">{creator.affiliateLink}</span></CustomTableCell>
                                <CustomTableCell>
                                    <PencilLine color="#FF4979"/>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination */}
            <div className="flex justify-end items-center mt-4">
                <TablePagination totalPages={totalPages} activePage={currentPage} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}
