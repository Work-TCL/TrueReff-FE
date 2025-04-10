"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { IBrand } from "./list";
import { useParams, useRouter } from "next/navigation";
import { Info } from "lucide-react";
import Button from "@/app/_components/ui/button";

interface ICreatorTableProps {
    data: IBrand[],
    brandName: string;
}
export default function BrandProductTable({ data, brandName }: ICreatorTableProps) {
    const router = useRouter();
    const params = useParams();
    const handleDetailView = (id: string) => {
        router.push(`/creator/brandsList/${params.id}/${id}?brandName=${brandName}`);
    }
    return (
        <div className="overflow-auto">
            <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                <TableHeader className="bg-stroke">
                    <TableRow >
                        <CustomTableHead className="w-1/5">{translate("Product_Name")}</CustomTableHead>
                        <CustomTableHead className="w-1/5">{translate("Brand_Name")}</CustomTableHead>
                        <CustomTableHead className="w-1/5">{translate("Category")}</CustomTableHead>
                        <CustomTableHead className="w-1/5">{translate("Tags")}</CustomTableHead>
                        {/*<CustomTableHead className="w-1/6">{translate("Total_Sale")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Brand_Rating")}</CustomTableHead> */}
                        <CustomTableHead className="w-1/5 text-center">{translate("Action")}</CustomTableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                        {data.map((brand: IBrand, index: number) => (
                            <TableRow key={index} className="bg-white">
                                <CustomTableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8">
                                            {brand.productId.media?.length > 0 && <AvatarImage src={brand.productId.media[0]} />}
                                            <AvatarImage src={"/assets/brand/brand-image.svg"} />
                                        </Avatar>
                                        {brand.productId.title}
                                    </div>
                                </CustomTableCell>
                                <CustomTableCell>{brandName}</CustomTableCell>
                                <CustomTableCell>{brand.productId?.categories?.length ? brand.productId?.categories?.join(", "):""}</CustomTableCell>
                                <CustomTableCell>{brand?.productId?.tags?.length ? brand.productId.tags.join(", "):""}</CustomTableCell>
                                {/* <CustomTableCell>{brand.pastSales??''}</CustomTableCell> */}
                                {/* <CustomTableCell>{brand.tag}</CustomTableCell> */}
                                <CustomTableCell className="flex justify-center">
                                    <Button className="whitespace-nowrap w-[150px] border border-[#FFEDF2] bg-[#FFEDF2] text-[#FF4979] rounded-md transition-all py-3 px-[10px] text-sm" onClick={() => handleDetailView(brand.productId._id)}>
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