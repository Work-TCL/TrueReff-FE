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

interface IProducts {
    productImage: string,
    name: string,
    rating: string,
    category: string,
    price: string,
    discount: string,
    sold: string,
    trendingTag: string,
}
// Sample Data
const products:  IProducts[]= [
    {
        productImage: "/monica.png",
        name: "Monica Bing",
        rating: "4.8",
        category: "Jewelry",
        price: "$25",
        discount: "15%",
        sold: "320",
        trendingTag: 'Top Product',
    },
    {
        productImage: "/lucy.png",
        name: "Lucy Hall",
        rating: "4.7",
        category: "Clothing",
        price: "$45",
        discount: "20%",
        sold: "250",
        trendingTag: 'New Arrival',
    },
    {
        productImage: "/sophia.png",
        name: "Sophia Lopez",
        rating: "4.9",
        category: "Accessories",
        price: "$30",
        discount: "10%",
        sold: "400",
        trendingTag: 'Best Seller',
    },
    {
        productImage: "/emma.png",
        name: "Emma Stone",
        rating: "4.5",
        category: "Beauty",
        price: "$18",
        discount: "5%",
        sold: "220",
        trendingTag: 'Limited Edition',
    },
    {
        productImage: "/ava.png",
        name: "Ava Green",
        rating: "4.6",
        category: "Home Decor",
        price: "$40",
        discount: "25%",
        sold: "500",
        trendingTag: 'Most Popular',
    },
    {
        productImage: "/mia.png",
        name: "Mia Bright",
        rating: "4.7",
        category: "Footwear",
        price: "$60",
        discount: "30%",
        sold: "350",
        trendingTag: 'Top Seller',
    },
    {
        productImage: "/olivia.png",
        name: "Olivia Brown",
        rating: "4.8",
        category: "Jewelry",
        price: "$22",
        discount: "15%",
        sold: "150",
        trendingTag: 'Trending',
    },
    {
        productImage: "/isabella.png",
        name: "Isabella Rose",
        rating: "4.9",
        category: "Accessories",
        price: "$55",
        discount: "10%",
        sold: "430",
        trendingTag: 'Hot Deal',
    },
    {
        productImage: "/chloe.png",
        name: "Chloe Harris",
        rating: "4.6",
        category: "Electronics",
        price: "$120",
        discount: "18%",
        sold: "300",
        trendingTag: 'On Sale',
    }
];



export default function ProductList() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(products.length / pageSize);

    const paginatedData = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="p-4 rounded-lg flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="text-[20px] text-500">
                    <Input placeholder={translate("Search_product...")} />
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
                            <CustomTableHead className="w-1/6">{translate("Rating")}</CustomTableHead>
                            <CustomTableHead className="w-1/8">{translate("Price")}</CustomTableHead>
                            <CustomTableHead className="w-1/8">{translate("Discount")}</CustomTableHead>
                            <CustomTableHead className="w-1/6">{translate("Category")}</CustomTableHead>
                            <CustomTableHead className="w-1/4">{translate("Sold_(Last_Week)")}</CustomTableHead>
                            <CustomTableHead className="w-1/4">{translate("Trending_Tag")}</CustomTableHead>
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
                                <CustomTableCell>{creator.rating}</CustomTableCell>
                                <CustomTableCell>{creator.price}</CustomTableCell>
                                <CustomTableCell>{creator.discount}</CustomTableCell>
                                <CustomTableCell>{creator.category}</CustomTableCell>
                                <CustomTableCell>{creator.sold}</CustomTableCell>
                                <CustomTableCell>{creator.trendingTag}</CustomTableCell>
                                <CustomTableCell>
                                    <Switch />
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
