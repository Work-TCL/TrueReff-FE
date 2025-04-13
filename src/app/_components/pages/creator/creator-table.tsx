"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { IChannel, ICreator } from "./list";
import { useRouter } from "next/navigation";
import Loader from "../../components-common/layout/loader";
import { useTranslations } from "next-intl";
import CollaborateRequest from "../../components-common/dialogs/collaborate-creator-form";
function formatNumber(num: number = 0) {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num === 0 ? "" : num.toString();
}

interface ICreatorTableProps {
    data: ICreator[],
    filter: string;
    loader: boolean
}
const CreatorTable = ({ data, filter,loader }: ICreatorTableProps) => {
    const translate = useTranslations();
    const router = useRouter();
    const initialValue = {show:false,creatorId:""};
    const [isOpen,setIsOpen] = useState(initialValue)
    const getInstagramView: (channels: IChannel[]) => string = (channels: IChannel[]) => {
        let instagram = channels.find((ele: { channelType: string }) => ele.channelType === "instagram")
        return ""
    }
    const getYoutubeView: (channels: IChannel[]) => string = (channels: IChannel[]) => {
        let youtube = channels.find((ele: { channelType: string }) => ele.channelType === "youtube");
        return youtube ? formatNumber(filter === "5" ? youtube?.lastFiveVideoViews : youtube?.lastMonthViews) : "-"
    }
    const handleViewCreatorDetails = (id: string) => {
        router.push(`/vendor/creators/${id}`)
    }
    const handleCollaborateNow = (creatorId:string) => {
        setIsOpen({show:true,creatorId})
      }
      const handleOnClose = () => {
        setIsOpen(initialValue);
      }
    return (
        <div className="overflow-auto">
            {loader && <Loader/>}
            <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                <TableHeader className="bg-stroke">
                    <TableRow >
                        <CustomTableHead className="w-1/6">{translate("Creator_Name")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Creator_Bio")}</CustomTableHead>
                        <CustomTableHead className="w-1/6">{translate("Categories")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("Instagram_View")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("YouTube_View")}</CustomTableHead>
                        <CustomTableHead className="w-1/6">{translate("Past_Sales")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Tags_Collaboration")}</CustomTableHead>
                        <CustomTableHead className="w-1/6 text-center">{translate("Action")}</CustomTableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((creator: any, index: number) => (
                        <TableRow key={index} className="bg-white">
                            <CustomTableCell>
                                <div className="flex items-center gap-2" onClick={() => handleViewCreatorDetails(creator._id)}>
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={creator.profile_image} />
                                        <AvatarImage src={"/assets/creator/creator-image.svg"} />
                                    </Avatar>
                                    {creator.full_name}
                                </div>
                            </CustomTableCell>
                            <CustomTableCell>{creator.short_description || creator.long_description}</CustomTableCell>
                            <CustomTableCell>{creator.categories}</CustomTableCell>
                            <CustomTableCell>{getInstagramView(creator.channels)}</CustomTableCell>
                            <CustomTableCell>{getYoutubeView(creator.channels)}</CustomTableCell>
                            <CustomTableCell>{creator.pastSales ?? ''}</CustomTableCell>
                            <CustomTableCell>{creator.tag}</CustomTableCell>
                            <CustomTableCell>
                                <Button variant="outline" className="whitespace-nowrap  border border-[#FFEDF2] bg-[#FFEDF2] text-[#FF4979] rounded-md transition-all py-3 px-[10px] text-sm" onClick={()=> handleCollaborateNow(creator?._id)}>
                                    {translate("Collaborate_Now")}
                                </Button>
                            </CustomTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {isOpen?.show && <CollaborateRequest open={isOpen?.show} onClose={handleOnClose} creatorId={isOpen?.creatorId} />}
        </div>
    );
}

export default CreatorTable;
