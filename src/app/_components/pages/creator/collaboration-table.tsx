"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { useRouter } from "next/navigation";
import { CheckCircle, Eye, MessagesSquare, X, XCircle } from "lucide-react";
import { ICollaboration } from "./collaboration";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import CancelRequest from "../../components-common/dialogs/cancel-request";
import { useTranslations } from "next-intl";

export function capitalizeFirstLetter(word: string = "") {
  if (!word) return ""; // Handle empty strings
  return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
}

export const badgeColor: { [key: string]: string } = {
  LIVE: "bg-[#098228] text-[#098228]",
  REQUESTED: "bg-[#FF9500] text-[#FF9500]",
  EXPIRED: "bg-[#FF3B30] text-[#FF3B30]",
  REJECTED: "bg-[#FF3B30] text-[#FF3B30]",
  PENDING: "bg-[#FF9500] text-[#FF9500]",
};

interface ICreatorTableProps {
  data: ICollaboration[];
  filter: string;
  user: string;
  fetchCollaboration: () => void;
}
const CollaborationTable = ({
  data,
  filter,
  user,
  fetchCollaboration,
}: ICreatorTableProps) => {
  const router = useRouter();
  const translate = useTranslations();
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState("");
  const badgeColor: { [key: string]: string } = {
    LIVE: "bg-[#098228] text-[#098228]",
    REQUESTED: "bg-[#FF9500] text-[#FF9500]",
    EXPIRED: "bg-[#FF3B30] text-[#FF3B30]",
    REJECTED: "bg-[#FF3B30] text-[#FF3B30]",
    PENDING: "bg-[#FF9500] text-[#FF9500]",
  };
  const handleViewCreatorDetails = (id: string) => {
    router.push(`/vendor/collaboration/${id}`);
  };
  const handleRejectRequest = async (collaborationId: string) => {
    setLoading(true);
    try {
      const response: any = await axios.delete(
        `/product/collaboration/request/cancel/${collaborationId}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchCollaboration();
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
  const handleChatView = (productId: string) => {
    router.push(`/creator/collaboration/${productId}?isChatView=true`);
  };

  const handleProductDetail = (productId: string) => {
    router.push(`/creator/collaboration/${productId}`);
  };
  return (
    <div className="">
      <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
        <TableHeader className="bg-stroke">
          <TableRow>
            <CustomTableHead className="w-1/6">
              {translate("Product_Name")}
            </CustomTableHead>
            <CustomTableHead className="w-1/6">
              {translate("Product_Category")}
            </CustomTableHead>
            <CustomTableHead className="w-1/6">
              {translate(`${user}_Name`)}
            </CustomTableHead>
            {/* <CustomTableHead className="w-1/8">{translate("Units_Sold")}</CustomTableHead> */}
            {/* <CustomTableHead className="w-1/6">{translate("Collab_Last_Date")}</CustomTableHead> */}
            <CustomTableHead className="w-1/6 text-center">
              {translate("Status")}
            </CustomTableHead>
            <CustomTableHead className="w-1/6 text-center">
              {translate("Action")}
            </CustomTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((collaboration: ICollaboration, index: number) => (
            <TableRow key={index} className="bg-white">
              <CustomTableCell>
                <div
                  className="flex items-center gap-2"
                  onClick={() =>
                    handleViewCreatorDetails(collaboration._id)
                  }
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={collaboration?.productId?.media[0]} />
                    <AvatarImage
                      src={"/assets/collaboration/collaboration-image.svg"}
                    />
                  </Avatar>
                  {collaboration?.productId?.title}
                </div>
              </CustomTableCell>
              <CustomTableCell>
                {collaboration?.productId?.categories}
              </CustomTableCell>
              <CustomTableCell>
                {collaboration?.vendorId?.business_name}
              </CustomTableCell>
              {/* <CustomTableCell>{""}</CustomTableCell> */}
              {/* <CustomTableCell>{""}</CustomTableCell> */}
              <CustomTableCell className="flex justify-center">
                <div
                  className={`${badgeColor[collaboration?.collaborationStatus]
                    } bg-opacity-10 text-sm font-medium px-3 py-2 rounded-md dark:bg-blue-900 dark:text-blue-300`}
                >
                  {capitalizeFirstLetter(
                    collaboration?.collaborationStatus
                  )}
                </div>
              </CustomTableCell>
              <CustomTableCell className="flex justify-center">
                {
                  {
                    REQUESTED: (
                      <XCircle className="cursor-pointer" size={25} color="#ef4444"
                        onClick={() => setIsOpen(collaboration?._id)}
                      />
                    ),
                    PENDING: (
                      <div className="flex gap-3">
                        <Eye
                        color="#FF4979"
                          className=" cursor-pointer"
                          onClick={() =>
                            handleProductDetail(
                              collaboration?.productId?._id
                            )
                          }
                          size={25}
                        />
                        <MessagesSquare
                        color="#3b82f6"
                          className="cursor-pointer"
                          onClick={() =>
                            handleChatView(collaboration?.productId?._id)
                          }
                          size={25}
                        />
                      </div>
                    ),
                    REJECTED: null,
                  }[collaboration?.collaborationStatus]
                }
              </CustomTableCell>
            </TableRow>
          ))}
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
};

export default CollaborationTable;
