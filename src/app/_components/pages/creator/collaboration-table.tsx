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
import ToolTip from "../../components-common/tool-tip";

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
    <div className="overflow-auto">
      <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
        <TableHeader className="bg-stroke">
          <TableRow>
            <CustomTableHead className="w-1/5">
              {translate("Product_Name")}
            </CustomTableHead>
            <CustomTableHead className="w-1/5">
              {translate("Product_Category")}
            </CustomTableHead>
            <CustomTableHead className="w-1/5">
              {translate("Product_Tags")}
            </CustomTableHead>
            <CustomTableHead className="w-1/5">
              {translate(`Brand`)}
            </CustomTableHead>
            <CustomTableHead className="w-1/5 text-center">
              {translate("Status")}
            </CustomTableHead>
            <CustomTableHead className="w-1/5 text-center">
              {translate("Action")}
            </CustomTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((collaboration: ICollaboration, index: number) => {
            let status = getRequestStatus(collaboration);
            return (
              <TableRow key={index} className="bg-white hover:bg-gray-100">
                <CustomTableCell>
                  <div
                    className="flex items-center gap-2"
                    onClick={() => handleViewCreatorDetails(collaboration._id)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={collaboration?.product?.media[0]??"/assets/product/image-square.svg"} />
                      <AvatarImage
                        src={"/assets/product/image-square.svg"}
                      />
                    </Avatar>
                    {collaboration?.product?.title}
                  </div>
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.product?.category}
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.product?.tag}
                </CustomTableCell>
                <CustomTableCell>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.push(`/vendor/profile/${collaboration?.fromUser?._id}`)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={collaboration?.fromUser?.profile_image} />
                    </Avatar>
                    {collaboration?.fromUser?.business_name}
                  </div>
                </CustomTableCell>
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
                            
                            <ToolTip content="Accept Request" delayDuration={1000}>
                              <CheckCircle strokeWidth={1.5}
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
                            </ToolTip>
                            <ToolTip content="Reject Request" delayDuration={1000}>
                            <XCircle strokeWidth={1.5}
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
                            </ToolTip>
                          </div>
                        ),
                        CREATOR: (
                          <ToolTip content="Cancel Request" delayDuration={1000}>
                            <XCircle strokeWidth={1.5}
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
                          </ToolTip>
                        ),
                      }[collaboration?.request?.requestFrom ?? ""],
                      PENDING: (
                        <div className="flex gap-3">
                          <ToolTip content="View Product" delayDuration={1000}>
                            <Eye strokeWidth={1.5}
                            color="#FF4979"
                            className=" cursor-pointer"
                            onClick={() =>
                              handleProductDetail(collaboration?.product?._id)
                            }
                            size={25}
                          />
                          </ToolTip>
                          <ToolTip content="Start Bargaining" delayDuration={1000}>
                          <MessagesSquare strokeWidth={1.5}
                            color="#3b82f680"
                            className="cursor-pointer"
                            onClick={() =>
                              handleChatView(collaboration?._id)
                            }
                            size={25}
                          />
                          </ToolTip>
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
          loading={loading}
        />
      )}
    </div>
  );
};

export default CollaborationTable;
