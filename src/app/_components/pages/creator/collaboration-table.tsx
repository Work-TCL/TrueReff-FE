"use client";

import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Copy,
  Eye,
  ImageOff,
  MessageSquareText,
  MessagesSquare,
  XCircle,
} from "lucide-react";
import { ICollaboration } from "./collaboration";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import CancelRequest from "../../components-common/dialogs/cancel-request";
import { useTranslations } from "next-intl";
import StatusBadge from "../../components-common/status-badge";
import axios from "@/lib/web-api/axios";
import ToolTip from "../../components-common/tool-tip";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components-common/data-table";
import { toastMessage } from "@/lib/utils/toast-message";
import { currency } from "@/lib/utils/constants";

export function capitalizeFirstLetter(word: string = "") {
  if (!word) return ""; // Handle empty strings
  return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
}

interface ICreatorTableProps {
  data: ICollaboration[];
  filter?: string;
  user?: string;
  isDashboard?: boolean;
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
  isDashboard = false,
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
    return collaboration?.collaborationStatus;
  };
  const handleCopyLink = async (textToCopy: string | null) => {
    try {
      await navigator.clipboard.writeText(textToCopy ?? "");
      toastMessage.success("Text copied to clipboard!");
    } catch (err) {
      toastMessage.error("Failed to copy!");
    }
  };
  const getMessages = (status: string, request:string) => {
    let userStatus: { [key: string]: string } = {
      creator: "REQUESTED_CREATOR_FROM_VENDOR",
      vendor: "REQUESTED_VENDOR_FROM_CREATOR",
    };
    return status === "REQUESTED" && request
      ? userStatus[request]
      : status;
  };
  const getCommission = (collaboration: ICollaboration) => {

    if(collaboration?.collaborationStatus === "REQUESTED") {
      let product = collaboration?.productId;
      return product?.commission ? `${product?.commission_type === "FIXED_AMOUNT" ? currency["INR"]:""} ${product?.commission} ${product?.commission_type === "PERCENTAGE" ? "%":""}` : "-";
    } else if (collaboration?.bids?.length > 0) {
      const bid = collaboration?.bids?.[collaboration?.bids?.length - 1];
      if (bid?.proposal) {
        return `${bid?.type === "FIXED_AMOUNT" ? currency["INR"]:""} ${bid?.proposal} ${bid?.type === "PERCENTAGE" ? "%":""}`;
      } else {
        return "-";
      }
    }
    // return "-"
  }

  const columns: ColumnDef<ICollaboration>[] = [
    {
      accessorKey: "product.title",
      header: () => translate("Product_Name"),
      cell: ({ row }) => {
        const product = row.original.productId;
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleProductDetail(product?._id)}
          >
            {product?.media?.[0] ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={product.media[0]} />
                <AvatarImage src={"/assets/product/image-square.svg"} />
              </Avatar>
            ) : (
              <ImageOff className="w-6 h-6 text-gray-400" />
            )}
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={product?.title}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "product.category",
      header: () => translate("Product_Category"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.productId?.categories?.join(", ") ?? ""}
        />
      ),
    },
    ...(!isDashboard
      ? ([
          {
            accessorKey: "product.tag",
            header: () => translate("Product_Tags"),
            cell: ({ row }) => (
              <TruncateWithToolTip
                checkHorizontalOverflow={false}
                linesToClamp={2}
                text={row.original.productId?.tag ?? ""}
              />
            ),
          },
        ] as ColumnDef<ICollaboration>[])
      : []),
    {
      accessorKey: "fromUser.business_name",
      header: () => translate("Brand"),
      cell: ({ row }) => {
        const fromUser = row.original.vendorId;
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            // onClick={() => router.push(`/creator/vendor-profile/${fromUser?._id}`)}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                className={fromUser?.profile_image ? "" : "opacity-50"}
                src={
                  fromUser?.profile_image
                    ? fromUser.profile_image
                    : "/assets/profile/profile-image.png"
                }
              />
            </Avatar>
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={fromUser?.business_name}
            />
          </div>
        );
      },
    },
    ...(isDashboard
      ? ([
          {
            accessorKey: "product.tag",
            header: () => translate("Commission"),
            cell: ({ row }) => (
              <TruncateWithToolTip
                checkHorizontalOverflow={false}
                linesToClamp={2}
                text={getCommission(row?.original)}
              />
            ),
          },
        ] as ColumnDef<ICollaboration>[])
      : []),
    {
      id: "status",
      header: () => <div className="text-center">{translate("Status")}</div>,
      cell: ({ row }) => {
        const collaboration = row.original;
        const status = getRequestStatus(collaboration);
        return status ? (
          <div className="flex justify-center">
            <StatusBadge
              status={status}
              messageStatus={status}
            />
          </div>
        ) : null;
      },
    },
    {
      id: "action",
      header: () => <div className="text-center">{translate("Action")}</div>,
      cell: ({ row }) => {
        const collaboration = row.original;
        const product = row.original.productId;
        const status = getRequestStatus(collaboration);

        // if (isDashboard) {
        //   return (
        //     <div className="flex justify-between w-fit gap-3 mx-auto">
        //       {collaboration?.crmLink && (
        //         <ToolTip content="Copy Link" delayDuration={1000}>
        //           <Copy
        //             strokeWidth={1.5}
        //             color="#22c55e"
        //             className="cursor-pointer"
        //             size={25}
        //             onClick={() => handleCopyLink(collaboration?.crmLink)}
        //           />
        //         </ToolTip>
        //       )}
        //       <ToolTip content="View Detail" delayDuration={1000}>
        //         <Eye
        //           strokeWidth={1.5}
        //           className="cursor-pointer"
        //           size={25}
        //           color="#ef4444"
        //           onClick={() => handleProductDetail(product?._id)}
        //         />
        //       </ToolTip>
        //     </div>
        //   );
        // } else {
          if (status === "REQUESTED") {
            if (collaboration?.requestedBy === "vendor") {
              return (
                <div className="flex justify-between w-fit gap-3 mx-auto">
                  <ToolTip content="Accept Request" delayDuration={1000}>
                    <CheckCircle
                      strokeWidth={1.5}
                      color="#22c55e"
                      className="cursor-pointer"
                      size={25}
                      onClick={() =>
                        handleStatusChangeRequest("accepted", collaboration._id)
                      }
                    />
                  </ToolTip>
                  <ToolTip content="Reject Request" delayDuration={1000}>
                    <XCircle
                      strokeWidth={1.5}
                      className="cursor-pointer"
                      size={25}
                      color="#ef4444"
                      onClick={() =>
                        setIsOpen({
                          show: true,
                          collaborationId: collaboration._id,
                          status: "reject",
                        })
                      }
                    />
                  </ToolTip>
                </div>
              );
            } else if (collaboration?.requestedBy === "creator") {
              return (
                <div className="flex gap-3 mx-auto w-fit">
                  <ToolTip content="Cancel Request" delayDuration={1000}>
                    <XCircle
                      strokeWidth={1.5}
                      className="cursor-pointer"
                      size={25}
                      color="#ef4444"
                      onClick={() =>
                        setIsOpen({
                          show: true,
                          collaborationId: collaboration._id,
                          status: "cancel",
                        })
                      }
                    />
                  </ToolTip>
                </div>
              );
            }
          } else if (status === "PENDING" || status === "ACTIVE") {
            return (
              <div className="flex gap-3 mx-auto w-fit">
                <ToolTip content="Start Bargaining" delayDuration={1000}>
                  <MessageSquareText
                    strokeWidth={1}
                    color="#3b82f6"
                    className="cursor-pointer"
                    size={25}
                    onClick={() => handleChatView(collaboration._id)}
                  />
                </ToolTip>
              </div>
            );
          }
        // }
        return null;
      },
    },
  ];
  return (
    <>
      {/* <div className="min-w-full border-2 border-gray-200 overflow-hidden rounded-2xl"> */}
      <DataTable columns={columns} data={[...data]} type={"table"} />
      {/* </div> */}
      {isOpen?.show && (
        <CancelRequest
          onClose={() => setIsOpen(initialValue)}
          collaborationId={""}
          handleCancelRequest={handleConfirm}
          loading={loading}
        />
      )}
    </>
  );
};

export default CollaborationTable;
