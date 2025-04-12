"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { useRouter } from "next/navigation";
import { IProduct } from "./";
import { useTranslations } from "next-intl";
import StatusBadge from "../../components-common/status-badge";
import { CircleFadingPlus, Eye, XCircle } from "lucide-react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import CancelRequest from "../../components-common/dialogs/cancel-request";
import { useCreatorStore } from "@/lib/store/creator";
interface IProductTableProps {
    data: IProduct[];
    handleUpdateProduct: () => void;
}
export default function ProductTable({ data, handleUpdateProduct }: IProductTableProps) {
    const router = useRouter();
    const translate = useTranslations();
    const { creator } = useCreatorStore();
    const axios = useAxiosAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<string>("");
    const handleDetailView = (id: string) => {
        router.push(`/creator/product-management/${id}`);
    }
    const getRequestStatus = (product: IProduct) => {
        const { collaboration, request } = product;
        if (collaboration && request) {
            if (request?.collaborationStatus === "REQUESTED" || request?.collaborationStatus === "REJECTED") {
                return request?.collaborationStatus;
            } else {
                return collaboration?.collaborationStatus;
            }
        } else return "SEND_REQUEST";
    }
    const handleSendRequest = async (product: IProduct) => {
        setLoading(true);
        try {
            const response: any = await axios.post(
                `/product/collaboration/creator/request`,
                {
                    "productIds": [product?._id],
                    "creatorId": creator?.creatorId,
                    "vendorId": product?.vendor?._id
                }
            );
            if (response.status === 201) {
                let data = response?.data?.data?.results;
                if (data && data?.length > 0 && data[0]?.data) {
                    handleUpdateProduct()
                }
                if (data && data?.length > 0 && data[0]?.message) {
                    toast.success(data[0]?.message);
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            setLoading(false);
        }
    };
    const handleRejectRequest = async (collaborationId: string) => {
        setLoading(true);
        try {
            const response: any = await axios.delete(
                `/product/collaboration/request/cancel/${collaborationId}`
            );
            if (response.status === 200) {
                toast.success(response.data.message);
                handleUpdateProduct()
                setLoading(false);
                setIsOpen("");
            } else {
                setLoading(false);
                setIsOpen("");
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            setLoading(false);
            setIsOpen("");
        }
    };
    const handleStatusChangeRequest = async (
        status: "accepted" | "rejected",
        collaborationId: string = ""
    ) => {
        setLoading(true);
        try {
            const response: any = await axios.put(
                `/product/collaboration/request/status`,
                {
                    status,
                    collaborationId,
                }
            );
            if (response.status === 200) {
                toast.success(response.data.message);
                handleUpdateProduct();
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    const handleAction = (status: string | null, product: IProduct) => {
        if (status === "REQUESTED" && product?.collaboration?._id) {
            setIsOpen(product?.collaboration?._id)
        } else {
            handleSendRequest(product);
        }
    }
    return (
        <div className="overflow-auto">
            <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                <TableHeader className="bg-stroke">
                    <TableRow >
                        <CustomTableHead className="w-1/8">{translate("Product_Name")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("Description")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("Brand_Name")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("Category")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("Tags")}</CustomTableHead>
                        <CustomTableHead className="w-1/8 text-center">{translate("Status")}</CustomTableHead>
                        <CustomTableHead className="w-1/8 text-center">{translate("View")}</CustomTableHead>
                        <CustomTableHead className="w-1/8 text-center">{translate("Action")}</CustomTableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((product: IProduct, index: number) => {
                        const status = getRequestStatus(product)
                        return (
                            <TableRow key={index} className="bg-white">
                                <CustomTableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={product.media[0]} />
                                        </Avatar>
                                        {product.title}
                                    </div>
                                </CustomTableCell>
                                <CustomTableCell>{product?.description}</CustomTableCell>
                                <CustomTableCell>{product?.vendor?.business_name}</CustomTableCell>
                                <CustomTableCell>{product?.categories}</CustomTableCell>
                                <CustomTableCell>{product.tag}</CustomTableCell>
                                <CustomTableCell className="flex justify-center">
                                    {(status === "REJECTED" || status === "REQUESTED" && product?.request?.requestFrom === "CREATOR") ? <StatusBadge status={status} /> : null}
                                </CustomTableCell>
                                <CustomTableCell className="flex justify-center">
                                    <Eye
                                        color="#FF4979"
                                        className=" cursor-pointer"
                                        onClick={() =>
                                            handleDetailView(product._id)
                                        }
                                        size={25}
                                    />
                                </CustomTableCell>
                                <CustomTableCell className="flex justify-center">
                                    <CustomTableCell className="flex justify-center">
                                        {{
                                            REQUESTED: {
                                                CREATOR: <XCircle className="cursor-pointer" size={25} color="#ef4444"
                                                    onClick={() => handleAction(status, product)}
                                                />, VENDOR: null
                                            }[product?.request?.requestFrom ?? ""],
                                            SEND_REQUEST: <CircleFadingPlus
                                                color="#3b82f680"
                                                className="cursor-pointer"
                                                onClick={() => handleAction(status, product)}
                                                size={25}
                                            />,
                                            // PENDING: <MessagesSquare
                                            //     color="#3b82f680"
                                            //     className="cursor-pointer"
                                            //     onClick={() =>
                                            //         router.push(
                                            //             `/creator/`
                                            //         )
                                            //     }
                                            //     size={25}
                                            // />
                                        }[status]}
                                    </CustomTableCell>
                                </CustomTableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            {isOpen && (
                <CancelRequest
                    onClose={() => setIsOpen("")}
                    collaborationId={isOpen}
                    handleCancelRequest={handleRejectRequest}
                />
            )}
        </div>
    );
}
