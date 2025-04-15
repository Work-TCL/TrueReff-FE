"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { useRouter } from "next/navigation";
import { CheckCircle, Eye, MessagesSquare, XCircle } from "lucide-react";
import { ICollaboration, IRequest } from "./collaboration";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import CancelRequest from "../../components-common/dialogs/cancel-request";
import { useTranslations } from "next-intl";
import StatusBadge from "../../components-common/status-badge";
import axios from "@/lib/web-api/axios";

export function capitalizeFirstLetter(word: string = "") {
  if (!word) return ""; // Handle empty strings
  return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
}

interface ICreatorTableProps {
  data: ICollaboration[];
  filter: string;
  user: string;
  fetchCollaboration: () => void;
}
interface IRequestCancel {
  collaborationId: string;
  status: string;
  show: boolean;
}
const CollaborationTable = ({
  data,
  filter,
  user,
  fetchCollaboration,
}: ICreatorTableProps) => {
  const router = useRouter();
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);
  const initialValue = { show: false, collaborationId: "", status: "" };
  const [isOpen, setIsOpen] = useState<IRequestCancel>(initialValue);
  const handleViewCreatorDetails = (id: string) => {
    router.push(`/vendor/collaboration/${id}`);
  };
  const handleStatusChangeRequest = async (
    status: "accepted" | "rejected",
    collaborationId: string
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
        fetchCollaboration();
        setIsOpen(initialValue);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setIsOpen(initialValue);
    } finally {
      setLoading(false);
      setIsOpen(initialValue);
    }
  };
  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      const response: any = await axios.delete(
        `/product/collaboration/request/cancel/${isOpen?.collaborationId}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchCollaboration();
        setLoading(false);
        setIsOpen(initialValue);
      } else {
        setLoading(false);
        setIsOpen(initialValue);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setIsOpen(initialValue);
    }
  };
  const handleChatView = (collaborationId: string) => {
    router.push(`/creator/collaboration/${collaborationId}`);
  };

  const handleProductDetail = (productId: string) => {
    router.push(`/creator/product-management/${productId}`);
  };
  const handleConfirm = () => {
    if (isOpen?.status === "cancel") {
      handleCancelRequest();
    } else {
      handleStatusChangeRequest("rejected", isOpen?.collaborationId);
    }
  };
  const getRequestStatus = (collaboration: ICollaboration) => {
    const { request } = collaboration;
    if (request) {
      if (
        request?.collaborationStatus === "REQUESTED" ||
        request?.collaborationStatus === "REJECTED"
      ) {
        return request?.collaborationStatus;
      } else {
        return collaboration?.collaborationStatus;
      }
    } else return "SEND_REQUEST";
  };
  const getMessages = (status: string, request: IRequest) => {
    let userStatus: { [key: string]: string } = {
      CREATOR: "REQUESTED_CREATOR_FROM_VENDOR",
      VENDOR: "REQUESTED_VENDOR_FROM_CREATOR",
    };
    return status === "REQUESTED" && request?.requestFrom
      ? userStatus[request?.requestFrom]
      : status;
  };
  return (
    <div className="">
      <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
        <TableHeader className="bg-stroke">
          <TableRow>
            <CustomTableHead className="w-1/7">
              {translate("Product_Name")}
            </CustomTableHead>
            <CustomTableHead className="w-1/7">
              {translate("Description")}
            </CustomTableHead>
            <CustomTableHead className="w-1/7">
              {translate("Product_Category")}
            </CustomTableHead>
            <CustomTableHead className="w-1/7">
              {translate("Product_Sub_Category")}
            </CustomTableHead>
            <CustomTableHead className="w-1/7">
              {translate("Product_Tags")}
            </CustomTableHead>
            <CustomTableHead className="w-1/7">
              {translate(`${user}_Name`)}
            </CustomTableHead>
            <CustomTableHead className="w-1/7 text-center">
              {translate("Status")}
            </CustomTableHead>
            <CustomTableHead className="w-1/7 text-center">
              {translate("Action")}
            </CustomTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((collaboration: ICollaboration, index: number) => {
            let status = getRequestStatus(collaboration);
            return (
              <TableRow key={index} className="bg-white">
                <CustomTableCell>
                  <div
                    className="flex items-center gap-2"
                    onClick={() => handleViewCreatorDetails(collaboration._id)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={collaboration?.product?.media[0]} />
                      <AvatarImage
                        src={"/assets/collaboration/collaboration-image.svg"}
                      />
                    </Avatar>
                    {collaboration?.product?.title}
                  </div>
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.product?.description}
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.product?.categories}
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.product?.subCategories}
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.product?.tag}
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.fromUser?.business_name}
                </CustomTableCell>
                {/* <CustomTableCell>{""}</CustomTableCell> */}
                {/* <CustomTableCell>{""}</CustomTableCell> */}
                <CustomTableCell className="flex justify-center">
                  {status && (
                    <StatusBadge
                      status={status}
                      messageStatus={getMessages(
                        status,
                        collaboration?.request
                      )}
                    />
                  )}
                </CustomTableCell>
                <CustomTableCell className="flex justify-center">
                  {
                    {
                      REQUESTED: {
                        VENDOR: (
                          <div className="flex justify-between gap-3">
                            <CheckCircle
                              color="#22c55e"
                              className="cursor-pointer"
                              size={25}
                              onClick={() =>
                                handleStatusChangeRequest(
                                  "accepted",
                                  collaboration?._id
                                )
                              }
                            />
                            <XCircle
                              className="cursor-pointer"
                              size={25}
                              color="#ef4444"
                              onClick={() =>
                                setIsOpen({
                                  show: true,
                                  collaborationId: collaboration?._id,
                                  status: "reject",
                                })
                              }
                            />
                          </div>
                        ),
                        CREATOR: (
                          <XCircle
                            className="cursor-pointer"
                            size={25}
                            color="#ef4444"
                            onClick={() =>
                              setIsOpen({
                                show: true,
                                collaborationId: collaboration?._id,
                                status: "cancel",
                              })
                            }
                          />
                        ),
                      }[collaboration?.request?.requestFrom ?? ""],
                      PENDING: (
                        <div className="flex gap-3">
                          <Eye
                            color="#FF4979"
                            className=" cursor-pointer"
                            onClick={() =>
                              handleProductDetail(collaboration?.product?._id)
                            }
                            size={25}
                          />
                          <MessagesSquare
                            color="#3b82f680"
                            className="cursor-pointer"
                            onClick={() =>
                              handleChatView(collaboration?._id)
                            }
                            size={25}
                          />
                        </div>
                      ),
                      REJECTED: null,
                    }[status]
                  }
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {isOpen?.show && (
        <CancelRequest
          onClose={() => setIsOpen(initialValue)}
          collaborationId={""}
          handleCancelRequest={handleConfirm}
        />
      )}
    </div>
  );
};

export default CollaborationTable;
