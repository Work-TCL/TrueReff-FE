"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { useRouter } from "next/navigation";
import { Info, X } from "lucide-react";
import { ICollaboration } from "./collaboration";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { boolean } from "yup";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
function formatNumber(num:number = 0) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num === 0 ? "": num.toString();
}

interface ICreatorTableProps {
    data: ICollaboration[],
    filter: string,
    user: string,
}
const CollaborationTable = ({data,filter,user}: ICreatorTableProps) => {
    const router = useRouter();
    const axios = useAxiosAuth();
    const [loading,setLoading] = useState<boolean>(false);
    const badgeColor = {Live:"bg-[#098228] text-[#098228]",Paused:"bg-[#FF9500] text-[#FF9500]",Expired:"bg-[#FF3B30] text-[#FF3B30]"}
    const handleViewCreatorDetails = (id: string) => {
        router.push(`/vendor/collaboration/${id}`)
    }
    const handleRejectRequest = async () => {
        setLoading(true);
        try {
            const response: any = await axios.post(
                `/product/collaboration/creator/request`, 
            //     {
            //     "productId": storeProductId ? storeProductId : productId,
            //     "creatorId": creator?._id,
            //     "vendorId": productId ? params?.id : "",
            //     "discountType": "PERCENTAGE", //"PERCENTAGE", "FIXED_AMOUNT"
            //     "discountValue": 10,
            //     "couponCode": "ABCD",
            //     "expiresAt": "2025-12-31T23:59:59Z"
            // }
            );
            if (response.status === 200) {
                toast.success(response.data.message);
            }
            if (response.status === 201) {
                let data = response?.data?.data?.newCollaboration;
                if (data && data?.collaborationStatus) {
                    // setCollaborationStatus(data?.collaborationStatus)
                }
                toast.success(response.data.message);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            setLoading(false)
        }
    }
    return (
        <div className="">
            <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                <TableHeader className="bg-stroke">
                    <TableRow >
                        <CustomTableHead className="w-1/6">{translate("Product_Image")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Product_Name")}</CustomTableHead>
                        <CustomTableHead className="w-1/6">{translate("Product_Category")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate(`${user}_Name`)}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("Units_Sold")}</CustomTableHead>
                        <CustomTableHead className="w-1/6">{translate("Collab_Last_Date")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Status")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Action")}</CustomTableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (<>
                        {data.map((collaboration:ICollaboration, index:number) => (
                            <TableRow key={index} className="bg-white">
                                <CustomTableCell>
                                    <div className="flex items-center gap-2" onClick={()=> handleViewCreatorDetails(collaboration._id)}>
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={collaboration?.productId?.media[0]} />
                                            <AvatarImage src={"/assets/collaboration/collaboration-image.svg"} />
                                        </Avatar>
                                    </div>
                                </CustomTableCell>
                                <CustomTableCell>{collaboration?.productId?.title}</CustomTableCell>
                                <CustomTableCell>{collaboration?.productId?.category.join(", ")}</CustomTableCell>
                                <CustomTableCell>{""}</CustomTableCell>
                                <CustomTableCell>{""}</CustomTableCell>
                                <CustomTableCell>{""}</CustomTableCell>
                                <CustomTableCell className="w-[80px]">
                                    <div className={`rounded-[6px] bg-opacity-10 text-center p-2 ${badgeColor[index === 0 ? "Paused" : "Live"]}`}>{collaboration?.collaborationStatus                                    }</div>
                                </CustomTableCell>
                                <CustomTableCell>
                                    <X className="cursor-pointer" onClick={() => handleRejectRequest()}/>
                                </CustomTableCell>
                            </TableRow>
                        ))}</>) : <tr><td colSpan={7}><EmptyPlaceHolder/></td></tr>}
                </TableBody>
            </Table>
        </div>
    );
}

export default CollaborationTable;

export function EmptyPlaceHolder() {
    return (
      <div className=" flex items-center justify-center flex-col flex-1 col-span-full text-center h-[200px] text-gray-500 p-4 bg-white ">
        <Info className="mx-auto mb-2 text-gray-400" />
        <h2 className="text-lg font-semibold">
          {translate("No_Collaborations_Available_Title")}
        </h2>
        <p className="text-sm">{translate("No_Collaborations_Available_Description")}</p>
      </div>
    );
  }
