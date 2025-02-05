"use client";

import { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/tables/CustomTableCell";
import { TablePagination } from "@/app/_components/tables/Pagination";
import { Input } from "@/components/ui/input";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import { FaSlidersH } from "react-icons/fa";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";


// Sample Data
const products = [
    {
        productId: "#15646",
        productImageUrl: "/monica.png",
        productName: "Tiffany Diamond Ring",
        category: "Jewelry",
        tags: "Elegant, Timeless",
        SKU: "TDR-3050",
        sellingPrice: "$850",
        discount: "15%",
        status: "Inactive",
    },
    {
        productId: "#15647",
        productImageUrl: "/omega_watch.png",
        productName: "Omega Seamaster",
        category: "Watches",
        tags: "Luxury, Classic",
        SKU: "OSM-1248",
        sellingPrice: "$4,200",
        discount: "10%",
        status: "Active",
    },
    {
        productId: "#15648",
        productImageUrl: "/leather_bag.png",
        productName: "Louis Vuitton Leather Bag",
        category: "Bags",
        tags: "Stylish, Premium",
        SKU: "LVL-7890",
        sellingPrice: "$3,150",
        discount: "20%",
        status: "Active",
    },
    {
        productId: "#15649",
        productImageUrl: "/airpods_pro.png",
        productName: "Apple AirPods Pro",
        category: "Electronics",
        tags: "Wireless, Noise-cancelling",
        SKU: "AAP-9988",
        sellingPrice: "$249",
        discount: "5%",
        status: "Inactive",
    },
    {
        productId: "#15650",
        productImageUrl: "/sneakers.png",
        productName: "Nike Air Max 270",
        category: "Footwear",
        tags: "Comfort, Sporty",
        SKU: "NAM-270X",
        sellingPrice: "$150",
        discount: "12%",
        status: "Active",
    }
];


export default function ProductList() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(products.length / pageSize);

    const paginatedData = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="p-4 rounded-lg flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="text-[20px] text-500">
                    <Input placeholder="Search product..." />
                </div>
                <div className="flex items-center gap-[10px]">
                    <PiListChecksLight size={35} />
                    <IoGridOutline size={30} />
                    <Button variant="outline" className="text-black w-[100px] rounded-[4px]">
                        <FaSlidersH /> Filters
                    </Button>
                </div>
            </div>
            <div className="overflow-auto">
                <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                    <TableHeader className="bg-stroke">
                        <TableRow >
                            <CustomTableHead className="w-1/6">Product ID</CustomTableHead>
                            <CustomTableHead className="w-1/4">Product Name</CustomTableHead>
                            <CustomTableHead className="w-1/6">Categories</CustomTableHead>
                            <CustomTableHead className="w-1/4">Tags</CustomTableHead>
                            <CustomTableHead className="w-1/4">SKU</CustomTableHead>
                            <CustomTableHead className="w-1/6">Selling Price</CustomTableHead>
                            <CustomTableHead className="w-1/8">Discount</CustomTableHead>
                            <CustomTableHead className="w-1/4">Status</CustomTableHead>
                            <CustomTableHead className="w-1/6 text-center">Action</CustomTableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((product, index) => (
                            <TableRow key={index} className="even:bg-gray-100 odd:bg-white">
                                <CustomTableCell >{product.productId}</CustomTableCell>
                                <CustomTableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={'/assets/product/image-square.svg'} />
                                        </Avatar>
                                        {product.productName}
                                    </div>
                                </CustomTableCell>
                                <CustomTableCell >{product.category}</CustomTableCell>
                                <CustomTableCell>{product.tags}</CustomTableCell>
                                <CustomTableCell>{product.SKU}</CustomTableCell>
                                <CustomTableCell>{product.sellingPrice}</CustomTableCell>
                                <CustomTableCell>{product.discount}</CustomTableCell>
                                <CustomTableCell><div className={`${product.status === "Active" ? "bg-[#0982281A] text-[#098228]" : "bg-[#FF3B301A] text-[#FF3B30]"} p-2 rounded-md`}>{product.status}</div></CustomTableCell>
                                <CustomTableCell>
                                    <div className="flex justify-center gap-3">
                                        <Eye color="#FF4979" className="cursor-pointer" onClick={() => router.push(`/product/${index}?view=true`)} />
                                        <PencilLine className="cursor-pointer" onClick={() => router.push(`/product/${index}`)} />
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
                <TablePagination totalPages={totalPages} activePage={currentPage} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}
