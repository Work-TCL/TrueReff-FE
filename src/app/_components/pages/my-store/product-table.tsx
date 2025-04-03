"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { useParams, useRouter } from "next/navigation";
import { Eye, Info } from "lucide-react";
import { IProduct } from "./list";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import Button from "../../ui/button";
function formatNumber(num: number = 0) {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num === 0 ? "" : num.toString();
}

interface IProductTableProps {
    data: IProduct[]
}
export default function BrandProductTable({ data }: IProductTableProps) {
    const router = useRouter();
    const handleDetailView = (id: string) => {
        router.push(`/creator/my-store/${id}`);
    }
    return (
        <div className="overflow-auto">
            <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                <TableHeader className="bg-stroke">
                    <TableRow >
                        <CustomTableHead className="w-1/6">{translate("Product_Image")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Product_Name")}</CustomTableHead>
                        {/* <CustomTableHead className="w-1/6">{translate("Rating")}</CustomTableHead> */}
                        {/* <CustomTableHead className="w-1/8">{translate("Price")}</CustomTableHead> */}
                        {/* <CustomTableHead className="w-1/8">{translate("YouTube_View")}</CustomTableHead> */}
                        {/* <CustomTableHead className="w-1/6">{translate("Discount")}</CustomTableHead> */}
                        <CustomTableHead className="w-1/4">{translate("Category")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("Tags")}</CustomTableHead>
                        <CustomTableHead className="w-1/6">{translate("Action")}</CustomTableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (<>
                        {data.map((product: IProduct, index: number) => (
                            <TableRow key={index} className="bg-white">
                                <CustomTableCell>
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={product.media[0]} />
                                    </Avatar>
                                </CustomTableCell>
                                <CustomTableCell>{product.title}</CustomTableCell>
                                <CustomTableCell>{product?.categories}</CustomTableCell>
                                {/* <CustomTableCell>{product?.tag}</CustomTableCell> */}
                                {/* <CustomTableCell>{product.pastSales??''}</CustomTableCell> */}
                                <CustomTableCell>{product.tag}</CustomTableCell>
                                <CustomTableCell>
                                    <Button type="button" className="whitespace-nowrap w-[150px] bg-red-500 text-white rounded-md transition-all hover:bg-red-200 py-3 px-[10px] text-sm" onClick={() => handleDetailView(product._id)}>
                                        {translate("Collaborate_Now")}
                                    </Button>
                                </CustomTableCell>
                            </TableRow>
                        ))}</>) : <tr><td colSpan={8}><EmptyPlaceHolder /></td></tr>}
                </TableBody>
            </Table>
        </div>
    );
}
export function EmptyPlaceHolder() {
    return (
        <div className=" flex items-center justify-center flex-col flex-1 col-span-full text-center h-[200px] text-gray-500 p-4 bg-white ">
            <Info className="mx-auto mb-2 text-gray-400" />
            <h2 className="text-lg font-semibold">
                {translate("No_Products_Available_Title")}
            </h2>
            <p className="text-sm">{translate("No_Products_Available_Description")}</p>
        </div>
    );
}
