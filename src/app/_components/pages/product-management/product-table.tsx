"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { useRouter } from "next/navigation";
import { IProduct } from "./";
import Button from "../../ui/button";
import { useTranslations } from "next-intl";
interface IProductTableProps {
    data: IProduct[]
}
export default function ProductTable({ data }: IProductTableProps) {
    const router = useRouter();
    const translate = useTranslations();
    const handleDetailView = (id: string) => {
        router.push(`/creator/product-management/${id}`);
    }
    return (
        <div className="overflow-auto">
            <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                <TableHeader className="bg-stroke">
                    <TableRow >
                        <CustomTableHead className="w-1/4">{translate("Product_Name")}</CustomTableHead>
                        {/* <CustomTableHead className="w-1/6">{translate("Rating")}</CustomTableHead> */}
                        {/* <CustomTableHead className="w-1/8">{translate("Price")}</CustomTableHead> */}
                        {/* <CustomTableHead className="w-1/8">{translate("YouTube_View")}</CustomTableHead> */}
                        {/* <CustomTableHead className="w-1/6">{translate("Discount")}</CustomTableHead> */}
                        <CustomTableHead className="w-1/4">{translate("Category")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Tags")}</CustomTableHead>
                        <CustomTableHead className="w-1/4 text-center">{translate("Action")}</CustomTableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((product: IProduct, index: number) => (
                        <TableRow key={index} className="bg-white">
                            <CustomTableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={product.media[0]} />
                                    </Avatar>
                                    {product.title}
                                </div>
                            </CustomTableCell>
                            <CustomTableCell>{product?.categories}</CustomTableCell>
                            {/* <CustomTableCell>{product?.tag}</CustomTableCell> */}
                            {/* <CustomTableCell>{product.pastSales??''}</CustomTableCell> */}
                            <CustomTableCell>{product.tag}</CustomTableCell>
                            <CustomTableCell className="flex justify-center">
                                <Button type="button" className="whitespace-nowrap w-[150px]  bg-[#FFEDF2] text-[#FF4979] rounded-md transition-all py-3 px-[10px] text-sm" onClick={() => handleDetailView(product._id)}>
                                    {translate("Collaborate_Now")}
                                </Button>
                            </CustomTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
