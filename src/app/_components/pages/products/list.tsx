"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { Input } from "@/components/ui/input";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import { FaSlidersH } from "react-icons/fa";
import { Eye } from "lucide-react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loading from "@/app/vendor/loading";
import Link from "next/link";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import Loader from "../../components-common/layout/loader";
import { useTranslations } from "next-intl";

export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // or Date if parsed
  updatedAt: string; // or Date
}

export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  vendorId: string;
  sku: string;
  description: string;
  media: string[]; // assuming media is an array of image/video URLs or paths
  channelName: string; // extend as needed
  category: ICategory[];
  tags: string[]; // if tags are strings
  createdAt: string; // or Date
  updatedAt: string;
  categories?: string;
  tag?: string;
  price?: string;
}

export default function ProductList() {
  const axios = useAxiosAuth();
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<IProduct[]>([]);
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

  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    ItemPerPage: number,
    cursor: string | null = null,
    isInternalLoader: boolean = false
  ) => {
    isInternalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await axios.get(
        `product/vendor-product/product/list?per_page=${ItemPerPage}${
          cursor ? `&cursor=${cursor}` : ""
        }`
      );
      if (response.data.data?.data) {
        setProductList(response.data.data?.data.map((product:IProduct) => {
          let categories = product.category?.length > 0 ? product.category.map((cat:ICategory) => cat?.name)?.join(", "):"";
          let tag = product.tags?.length > 0 ? product.tags?.join(", "):"";
          return {...product,categories,tag};
        }));
      }
      setLoading(false);
      setInternalLoading(false);
    } catch (error) {
      setLoading(false);
      setProductList([]);
      setInternalLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetProductsList(20);
  }, []);

  // Update the onClick handlers for pagination buttons
  const handleNextPage = () => {
    if (cursors.next && cursors.hasNextPage) {
      fetProductsList(20, cursors.next,true);
    }
  };

  const handlePreviousPage = () => {
    if (cursors.previous && cursors.hasPreviousPage) {
      fetProductsList(20, cursors.previous,true);
    }
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? <Loading/> : productList?.length > 0 ? <><div className="flex justify-between items-center  gap-2">
        <div className="md:text-[20px] text-base text-500">
          {" "}
          <Input
            placeholder={translate("Search_product")}
            className="md:h-10 h-8"
          />
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
      {internalLoading && <Loader />}
      <div className="overflow-auto flex-1">
        <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
          <TableHeader className="bg-stroke">
            <TableRow>
              <CustomTableHead className="w-1/6">
                {translate("Channel")}
              </CustomTableHead>
              <CustomTableHead className="w-1/4">
                {translate("Product_Name")}
              </CustomTableHead>
              <CustomTableHead className="w-1/6">
                {translate("Categories")}
              </CustomTableHead>
              <CustomTableHead className="w-1/4">
                {translate("Tags")}
              </CustomTableHead>
              <CustomTableHead className="w-1/4">
                {translate("SKU")}
              </CustomTableHead>
              <CustomTableHead className="w-1/6">
                Selling {translate("Price")}
              </CustomTableHead>
              {/*              <CustomTableHead className="w-1/8">{translate("Discount")}</CustomTableHead>
                            <CustomTableHead className="w-1/4">{translate("Status")}</CustomTableHead> */}
              <CustomTableHead className="w-1/6 text-center">
                {translate("Action")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              productList.map((product, index) => (
                <TableRow key={index} className=" bg-white">
                  <CustomTableCell>{product.channelName}</CustomTableCell>
                  <CustomTableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        {product.media?.length > 0 && <AvatarImage src={product.media[0]} />}
                      </Avatar>
                      {product.title}
                    </div>
                  </CustomTableCell>
                  <CustomTableCell>{product.categories}</CustomTableCell>
                  <CustomTableCell>{product.tags.join(", ")}</CustomTableCell>
                  <CustomTableCell>{product.sku}</CustomTableCell>
                  <CustomTableCell>{product.price}</CustomTableCell>
                  {/*                <CustomTableCell>{product.discount}</CustomTableCell>
                                <CustomTableCell><div className={`${product.status === "Active" ? "bg-[#0982281A] text-[#098228]" : "bg-[#FF3B301A] text-[#FF3B30]"} p-2 rounded-md`}>{product.status}</div></CustomTableCell> */}
                  <CustomTableCell>
                    <Link
                      href={`/vendor/products/view/${product._id}`}
                      className="flex justify-center gap-3"
                    >
                      <Eye color="#FF4979" className="cursor-pointer" />
                    </Link>
                  </CustomTableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {cursors.next || cursors.previous ? ( // Only show pagination if either cursor is available
        <div className="flex justify-end items-center mt-1">
          <Pagination className="flex justify-end mt-1">
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
      ) : null}</>:<EmptyPlaceHolder title={"No_Products_Available_Title"} description={"No_Products_Available_Description"}/>}
    </div>
  );
}
