"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { useRouter } from "next/navigation";
import { CheckCircle, ImageOff, MessagesSquare, XCircle } from "lucide-react";
import { ICollaboration, IRequest } from "./collaboration";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import Loader from "../../components-common/layout/loader";
import StatusBadge from "../../components-common/status-badge";
import CancelRequest from "../../components-common/dialogs/cancel-request";
import axios from "@/lib/web-api/axios";
import ToolTip from "../../components-common/tool-tip";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";

interface ICreatorTableProps {
  data: ICollaboration[];
  user: string;
  refreshCentral: () => void;
  loader: boolean;
}
interface IRequestCancel {
  collaborationId: string;
  status: string;
  show: boolean;
}
const CollaborationTable = ({
  data,
  user,
  loader = false,
  refreshCentral = () => {},
}: ICreatorTableProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const initialValue = { show: false, collaborationId: "", status: "" };
  const [isOpen, setIsOpen] = useState<IRequestCancel>(initialValue);
  const handleViewCreatorDetails = (id: string) => {
    router.push(`/vendor/creators/${id}`);
  };
  const handleStatusChangeRequest = async (
    status: "accepted" | "rejected",
    collaborataionId: string
  ) => {
    setLoading(true);
    try {
      const response: any = await axios.put(
        `/product/collaboration/request/status`,
        {
          status: status,
          collaborationId: collaborataionId,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        refreshCentral();
        setIsOpen(initialValue);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsOpen(initialValue);
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
  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      const response: any = await axios.delete(
        `/product/collaboration/request/cancel/${isOpen?.collaborationId}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        refreshCentral();
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

  const handleConfirm = () => {
    if (isOpen?.status === "cancel") {
      handleCancelRequest();
    } else {
      handleStatusChangeRequest("rejected", isOpen?.collaborationId);
    }
  };
  const getMessages = (status: string, request: IRequest) => {
    let userStatus: { [key: string]: string } = {
      CREATOR: "REQUESTED_CREATOR_TO_VENDOR",
      VENDOR: "REQUESTED_VENDOR_TO_CREATOR",
    };
    return status === "REQUESTED" && request?.requestFrom
      ? userStatus[request?.requestFrom]
      : status;
  };
  return (
    <div className="overflow-auto">
      {(loading || loader) && <Loader />}
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
              {translate("Creator")}
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
                  <div className="flex items-center gap-2 cursor-pointer">
                    {collaboration?.product?.media[0] ? (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={collaboration?.product?.media[0]} />
                        <AvatarImage
                          src={"/assets/collaboration/collaboration-image.svg"}
                        />
                      </Avatar>
                    ) : (
                      <ImageOff className="w-6 h-6 text-gray-400" />
                    )}
                    <TruncateWithToolTip
                      checkHorizontalOverflow={false}
                      linesToClamp={2}
                      text={collaboration?.product?.title}
                    />
                  </div>
                </CustomTableCell>
                <CustomTableCell>
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={collaboration?.product?.category ?? ""}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={collaboration?.product?.tag ?? ""}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/creator/profile/${collaboration?.fromUser?._id}`
                      )
                    }
                  >
                    {collaboration?.fromUser?.profile_image ? (
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={collaboration?.fromUser?.profile_image}
                        />
                      </Avatar>
                    ) : (
                      <TruncateWithToolTip
                        checkHorizontalOverflow={false}
                        linesToClamp={2}
                        text={collaboration?.fromUser?.user_name}
                      />
                    )}
                  </div>
                </CustomTableCell>
                <CustomTableCell className="flex justify-center">
                  {status ? (
                    <StatusBadge
                      status={status}
                      messageStatus={getMessages(
                        status,
                        collaboration?.request
                      )}
                    />
                  ) : null}
                </CustomTableCell>
                <CustomTableCell>
                  <div className={`flex gap-4 justify-center`}>
                    {
                      {
                        REQUESTED: {
                          CREATOR: (
                            <div className="flex justify-between gap-3">
                              <ToolTip
                                content="Accept Request"
                                delayDuration={1000}
                              >
                                <CheckCircle
                                  strokeWidth={1.5}
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
                              <ToolTip
                                content="Reject Request"
                                delayDuration={1000}
                              >
                                <XCircle
                                  strokeWidth={1.5}
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
                          VENDOR: (
                            <ToolTip
                              content="Cancel Request"
                              delayDuration={1000}
                            >
                              <XCircle
                                strokeWidth={1.5}
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
                          <ToolTip
                            content="Start Bargaining"
                            delayDuration={1000}
                          >
                            <MessagesSquare
                              strokeWidth={1.5}
                              color="#3b82f680"
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/vendor/creators/collaboration/${collaboration?._id}`
                                )
                              }
                              size={25}
                            />
                          </ToolTip>
                        ),
                      }[status]
                    }
                  </div>
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
