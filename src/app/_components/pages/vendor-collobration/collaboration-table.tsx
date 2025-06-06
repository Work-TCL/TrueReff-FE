"use client";

import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ImageOff,
  IndianRupee,
  MessagesSquare,
  XCircle,
} from "lucide-react";
import { IChannel, ICollaboration, IRequest } from "./collaboration";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import Loader from "../../components-common/layout/loader";
import StatusBadge from "../../components-common/status-badge";
import CancelRequest from "../../components-common/dialogs/cancel-request";
import axios from "@/lib/web-api/axios";
import ToolTip from "../../components-common/tool-tip";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components-common/data-table";
import { useTranslations } from "next-intl";
import { IFollowers } from "@/lib/types-api/creator-dashboard";
import { formatNumber } from "@/lib/utils/constants";

interface ICreatorTableProps {
  data: ICollaboration[];
  user: string;
  refreshCentral: () => void;
  loader: boolean;
  isDashboard?: boolean;
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
  isDashboard = false,
}: ICreatorTableProps) => {
  const translate = useTranslations();
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

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      const response: any = await axios.delete(
        `/product/collaboration/vendor/cancel-request/${isOpen?.collaborationId}`
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
  const getInstagramView: (channels: IChannel[]) => string = (
    channels: IChannel[]
  ) => {
    let instagram = channels.find(
      (ele: { channelType: string }) => ele.channelType === "instagram"
    );
    return instagram ? formatNumber(instagram?.followers) : "-";
  };
  const getYoutubeView: (channels: IChannel[]) => string = (
    channels: IChannel[]
  ) => {
    let youtube = channels.find(
      (ele: { channelType: string }) => ele.channelType === "youtube"
    );
    return youtube ? formatNumber(youtube?.followers) : "-";
  };

  const productCollaborationColumns: ColumnDef<ICollaboration>[] = [
    {
      id: "product_name",
      header: () => translate("Product_Name"),
      cell: ({ row }) => {
        const collaboration = row.original;
        const router = useRouter();
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() =>
              router.push(
                `/vendor/products/view/${collaboration?.productId?._id}`
              )
            }
          >
            {collaboration?.productId?.media?.[0] ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={collaboration.productId.media[0]} />
                <AvatarImage src="/assets/collaboration/collaboration-image.svg" />
              </Avatar>
            ) : (
              <ImageOff className="w-6 h-6 text-gray-400" />
            )}
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={collaboration?.productId?.title}
            />
          </div>
        );
      },
    },
    // ...(!isDashboard
    //   ? ([
    //       {
    //         id: "product_tags",
    //         header: () => translate("Product_Tags"),
    //         cell: ({ row }) => (
    //           <TruncateWithToolTip
    //             checkHorizontalOverflow={false}
    //             linesToClamp={2}
    //             text={row.original.productId?.tag ?? ""}
    //           />
    //         ),
    //       },
    //     ] as ColumnDef<ICollaboration>[])
    //   : []),
    {
      id: "creator",
      header: () => translate("Creator"),
      cell: ({ row }) => {
        const collaboration = row.original;
        const router = useRouter();
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() =>
              router.push(
                `/vendor/creator-profile/${collaboration?.creatorId?._id}`
              )
            }
          >
            <ToolTip
              content={
                <div className="flex gap-2 justify-center">
                  <div className="flex flex-col space-y-1 items-center p-1">
                    <div className="bg-gray-200 p-1 rounded-full">
                      <img
                        src="/assets/creator/insta-gram.svg"
                        width={18}
                        height={18}
                      />
                    </div>
                    <p className="text-sm">
                      {getInstagramView(collaboration?.creatorId?.channels)}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1 items-center p-1">
                    <div className="bg-gray-200 p-1 rounded-full">
                      <img
                        src="/assets/creator/you-tube.svg"
                        width={18}
                        height={18}
                      />
                    </div>
                    <p className="text-sm">
                      {getYoutubeView(collaboration?.creatorId?.channels)}
                    </p>
                  </div>
                </div>
              }
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  className={
                    collaboration?.creatorId?.profile_image ? "" : "opacity-50"
                  }
                  src={
                    collaboration?.creatorId?.profile_image
                      ? collaboration?.creatorId?.profile_image
                      : "/assets/profile/profile-image.png"
                  }
                />
              </Avatar>
            </ToolTip>
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={collaboration?.creatorId?.user_name}
            />
          </div>
        );
      },
    },
    {
      id: "product_category",
      header: () => translate("Creator_Category"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.creatorId?.categories ?? ""}
        />
      ),
    },
    {
      id: "last-bid",
      header: () => <div className="text-center">{translate("Last_Bid")}</div>,
      cell: ({ row }) => {
        const bids =
          row.original?.bids?.length > 0 ? row.original?.bids[0] : null;
        return bids ? (
          <div className="flex justify-center">
            {!bids?.isSeen ? (
              <div
                className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm text-center text-white bg-primary/90 flex items-center`}
              >
                {bids?.type === "FIXED_AMOUNT" ? <IndianRupee size={15} /> : ""}
                {bids?.proposal}
                {bids?.type === "FIXED_AMOUNT" ? "" : "%"}
              </div>
            ) : (
              <div
                className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm text-center text-primary flex items-center`}
              >
                {bids?.type === "FIXED_AMOUNT" ? <IndianRupee size={15} /> : ""}
                {bids?.proposal}
                {bids?.type === "FIXED_AMOUNT" ? "" : "%"}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">-</div>
        );
      },
    },
    {
      id: "status",
      header: () => <div className="text-center">{translate("Status")}</div>,
      cell: ({ row }) => {
        const collaboration = row.original;
        return (
          <div className="flex justify-center">
            {collaboration?.collaborationStatus ? (
              <StatusBadge
                status={collaboration?.collaborationStatus}
                messageStatus={collaboration?.collaborationStatus}
              />
            ) : null}
          </div>
        );
      },
    },
    {
      id: "action",
      header: () => <div className="text-center">{translate("Action")}</div>,
      cell: ({ row }) => {
        const collaboration = row.original;
        const router = useRouter();

        return (
          <div className="flex gap-4 justify-center">
            {
              {
                REQUESTED:
                  {
                    creator: (
                      <div className="flex justify-between gap-3">
                        <ToolTip content="Accept Request" delayDuration={1000}>
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
                        <ToolTip content="Reject Request" delayDuration={1000}>
                          <XCircle
                            strokeWidth={1.5}
                            color="#ef4444"
                            className="cursor-pointer"
                            size={25}
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
                    vendor: (
                      <ToolTip content="Cancel Request" delayDuration={1000}>
                        <XCircle
                          strokeWidth={1.5}
                          color="#ef4444"
                          className="cursor-pointer"
                          size={25}
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
                  }[collaboration?.requestedBy ?? ""] ?? null,
                PENDING: (
                  <div className="relative">
                    <ToolTip content="Start Bargaining" delayDuration={1000}>
                      <MessagesSquare
                        strokeWidth={1.5}
                        color="#3b82f6"
                        className="cursor-pointer"
                        size={25}
                        onClick={() =>
                          router.push(
                            `/vendor/creators/collaboration/${collaboration?._id}`
                          )
                        }
                      />
                    </ToolTip>
                    {collaboration?.lastMessage &&
                      collaboration?.lastMessage?.isRead === false && (
                        <div className="w-2 h-2 rounded-full bg-primary absolute top-0 right-0 -mb-1" />
                      )}
                  </div>
                ),
                ACTIVE: (
                  <div className="relative">
                    <ToolTip content="Start Bargaining" delayDuration={1000}>
                      <MessagesSquare
                        strokeWidth={1.5}
                        color="#3b82f6"
                        className="cursor-pointer"
                        size={25}
                        onClick={() =>
                          router.push(
                            `/vendor/creators/collaboration/${collaboration?._id}`
                          )
                        }
                      />
                      {collaboration?.lastMessage &&
                        collaboration?.lastMessage?.isRead === false && (
                          <div className="w-2 h-2 rounded-full bg-primary absolute top-0 right-0 -mb-1" />
                        )}
                    </ToolTip>
                  </div>
                ),
                EXPIRED: (
                  <div className="relative">
                    <ToolTip content="Start Bargaining" delayDuration={1000}>
                      <MessagesSquare
                        strokeWidth={1.5}
                        color="#3b82f6"
                        className="cursor-pointer"
                        size={25}
                        onClick={() =>
                          router.push(
                            `/vendor/creators/collaboration/${collaboration?._id}`
                          )
                        }
                      />
                      {collaboration?.lastMessage &&
                        collaboration?.lastMessage?.isRead === false && (
                          <div className="w-2 h-2 rounded-full bg-primary absolute top-0 right-0 -mb-1" />
                        )}
                    </ToolTip>
                  </div>
                ),
              }[collaboration?.collaborationStatus]
            }
          </div>
        );
      },
    },
  ];
  return (
    <>
      {(loading || loader) && <Loader />}
      <DataTable columns={productCollaborationColumns} data={data} />
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
