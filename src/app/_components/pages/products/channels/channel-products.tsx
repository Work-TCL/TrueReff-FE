"use client";

import { useEffect, useState } from "react";
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
import { translate } from "@/lib/utils/translate";
import axiosInstance from "@/lib/web-api/http-common";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import axios from "axios";

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
  },
];

export default function ChannelProductList() {
  const router = useRouter();
  const axios = useAxiosAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [productList, setProductList] = useState<
    { handle: string; id: string; image: string; title: string }[]
  >([]);
  const pageSize = 10;
  const totalPages = Math.ceil(products.length / pageSize);
  const [cursors, setCursors] = useState<{
    next: string | null;
    previous: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>({
    next: null,
    previous: null,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const paginatedData = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    ItemPerPage: number,
    cursor: string | null = null
  ) => {
    try {
      const response = await axios.get(
        `channel/shopify/product/list?per_page=${ItemPerPage}${
          cursor ? `&cursor=${cursor}` : ""
        }`
      );
      if (response.data.data.products) {
        setProductList(response.data.data.products);
        setCursors({
          next: response.data.data.page_info.next_cursor,
          previous: response.data.data.page_info.previous_cursor,
          hasNextPage: response.data.data.page_info.has_next_page,
          hasPreviousPage: response.data.data.page_info.has_previous_page,
        });
      }
    } catch (error) {}
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetProductsList(20);
  }, []);

  // Update the onClick handlers for pagination buttons
  const handleNextPage = () => {
    if (cursors.next) {
      fetProductsList(2, cursors.next);
    }
  };

  const handlePreviousPage = () => {
    if (cursors.previous) {
      fetProductsList(2, cursors.previous);
    }
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="text-[20px] text-500">
          <Input placeholder={translate("Search_product")} />
        </div>
        <div className="flex items-center gap-[10px]">
          <PiListChecksLight size={35} />
          <IoGridOutline size={30} />
          <Button
            variant="outline"
            className="text-black w-[100px] rounded-[4px]"
          >
            <FaSlidersH /> {translate("Filters")}
          </Button>
        </div>
      </div>
      <div className="overflow-auto flex-1">
        <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
          <TableHeader className="bg-stroke">
            <TableRow>
              <CustomTableHead className="w-1/6">
                {translate("Product_ID")}
              </CustomTableHead>
              <CustomTableHead className="w-1/4">
                {translate("Product_Name")}
              </CustomTableHead>
              {/* <CustomTableHead className="w-1/6">{translate("Categories")}</CustomTableHead>
                            <CustomTableHead className="w-1/4">{translate("Tags")}</CustomTableHead>
                            <CustomTableHead className="w-1/4">{translate("SKU")}</CustomTableHead>
                            <CustomTableHead className="w-1/6">Selling {translate("Price")}</CustomTableHead>
                            <CustomTableHead className="w-1/8">{translate("Discount")}</CustomTableHead>
                            <CustomTableHead className="w-1/4">{translate("Status")}</CustomTableHead> */}
              <CustomTableHead className="w-1/6 text-center">
                {translate("Action")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {paginatedData.map((product, index) => (
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
                        ))} */}
            {productList.map((product, index) => (
              <TableRow key={index} className="even:bg-gray-100 odd:bg-white">
                <CustomTableCell>{product.id.split("/").pop()}</CustomTableCell>
                <CustomTableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={product.image} />
                    </Avatar>
                    {product.title}
                  </div>
                </CustomTableCell>
                {/* <CustomTableCell >{product.category}</CustomTableCell>
                                <CustomTableCell>{product.tags}</CustomTableCell>
                                <CustomTableCell>{product.SKU}</CustomTableCell>
                                <CustomTableCell>{product.sellingPrice}</CustomTableCell>
                                <CustomTableCell>{product.discount}</CustomTableCell>
                                <CustomTableCell><div className={`${product.status === "Active" ? "bg-[#0982281A] text-[#098228]" : "bg-[#FF3B301A] text-[#FF3B30]"} p-2 rounded-md`}>{product.status}</div></CustomTableCell> */}
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
      {cursors.next || cursors.previous ? ( // Only show pagination if either cursor is available
        <div className="flex justify-end items-center mt-4">
          <Pagination className="flex justify-end mt-4">
            <PaginationContent className="flex items-center gap-2">
              <PaginationItem>
                <PaginationPrevious
                  className={`text-sm px-3 py-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 ${
                    !cursors.hasPreviousPage
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  showArrow={false}
                  onClick={handlePreviousPage}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  className={`text-sm px-3 py-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 ${
                    !cursors.hasNextPage ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  showArrow={false}
                  onClick={handleNextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>{" "}
        </div>
      ) : null}
    </div>
  );
}
