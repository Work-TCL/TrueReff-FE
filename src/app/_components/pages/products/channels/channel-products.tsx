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
import { CircleFadingPlus, Eye, Info } from "lucide-react";
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
import ChannleToProduct from "@/lib/components/dialogs/channel-to-product";
import { useTranslations } from "next-intl";
import Loader from "@/app/_components/components-common/layout/loader";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";

interface IProduct {
  handle: string;
  id: string;
  image: string;
  title: string;
  category: string;
  tags: string[];
  sku: string;
  price: string;
}
interface IProps {
  channelName: string;
}
export default function ChannelProductList({
  channelName = "shopify",
}: IProps) {
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [internalLoader,setInternalLoader] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<IProduct | null>(null);
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

  const translate = useTranslations();

  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    ItemPerPage: number,
    cursor: string | null = null,
    isInternalLoader = false,
  ) => {
    isInternalLoader ? setInternalLoader(true): setLoading(true);
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
      setLoading(false);
      setInternalLoader(false);
    } catch (error) {
      setLoading(false);
      setInternalLoader(false);
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
      {loading ? <Loading/> : productList?.length > 0 ? <><div className="flex justify-between items-center flex-wrap gap-2">
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
      {internalLoader && <Loader />}
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
                  <CustomTableCell>
                    {product.id.split("/").pop()}
                  </CustomTableCell>
                  <CustomTableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={product.image} />
                      </Avatar>
                      {product.title}
                    </div>
                  </CustomTableCell>
                  <CustomTableCell>{product.category}</CustomTableCell>
                  <CustomTableCell>{product.tags.join(", ")}</CustomTableCell>
                  <CustomTableCell>{product.sku}</CustomTableCell>
                  <CustomTableCell>{product.price}</CustomTableCell>
                  {/*                <CustomTableCell>{product.discount}</CustomTableCell>
                                <CustomTableCell><div className={`${product.status === "Active" ? "bg-[#0982281A] text-[#098228]" : "bg-[#FF3B301A] text-[#FF3B30]"} p-2 rounded-md`}>{product.status}</div></CustomTableCell> */}
                  <CustomTableCell>
                    <div className="flex justify-center gap-3">
                      <Link href={`shopify/view?id=${product.id}`} className="">
                        <Eye color="#FF4979" className="cursor-pointer" />
                      </Link>
                      <div
                        onClick={() => {
                          setCurrentData(product);
                        }}
                        className=""
                      >
                        <CircleFadingPlus
                          color="#3b82f680"
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </CustomTableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
      {currentData !== null && (
        <ChannleToProduct
          product={{
            productId: currentData.id,
            channelName: channelName,
            handle: currentData.handle,
            id: currentData.id,
            image: currentData.image,
            title: currentData.title,
            category: currentData.category,
            tags: currentData.tags,
            sku: currentData.sku,
            price: currentData.price,
          }}
          onClose={(refresh = false) => {
            setCurrentData(null);
            if (refresh) {
              fetProductsList(20);
            }
          }}
        />
      )}
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
                      : "cursor-pointer"
                  }`}
                  showArrow={false}
                  onClick={handlePreviousPage}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  className={`text-sm px-3 py-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 ${
                    !cursors.hasNextPage ? "cursor-not-allowed opacity-50" : "cursor-pointer"
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
