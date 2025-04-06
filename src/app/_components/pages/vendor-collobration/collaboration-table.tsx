"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { useRouter } from "next/navigation";
import { Check, Info, MessagesSquare, Pencil, X } from "lucide-react";
import { ICollaboration } from "./collaboration";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { boolean } from "yup";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { RiGhostFill } from "react-icons/ri";
import {
  COLLABORATION_STATUS_TYPE,
  COLLOBRATION_STATUS,
} from "@/lib/utils/constants";
import {
  badgeColor,
  capitalizeFirstLetter,
  EmptyPlaceHolder,
} from "../creator/collaboration-table";
import Loader from "../../components-common/layout/loader";
function formatNumber(num: number = 0) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num === 0 ? "" : num.toString();
}

interface ICreatorTableProps {
  data: ICollaboration[];
  filter: string;
  user: string;
  refreshCentral: () => void;
}
const CollaborationTable = ({
  data,
  filter,
  user,
  refreshCentral = () => {},
}: ICreatorTableProps) => {
  const router = useRouter();
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const handleViewCreatorDetails = (id: string) => {
    router.push(`/creator/collaboration/${id}`);
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
        refreshCentral && refreshCentral();
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      {loading && <Loader />}
      <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
        <TableHeader className="bg-stroke">
          <TableRow>
            <CustomTableHead className="w-1/6">
              {translate("Product_Image")}
            </CustomTableHead>
            <CustomTableHead className="w-1/4">
              {translate("Product_Name")}
            </CustomTableHead>
            <CustomTableHead className="w-1/6">
              {translate("Product_Category")}
            </CustomTableHead>
            <CustomTableHead className="w-1/8">
              {translate(`${user}_Name`)}
            </CustomTableHead>
            <CustomTableHead className="w-1/8">
              {translate("Units_Sold")}
            </CustomTableHead>
            <CustomTableHead className="w-1/6">
              {translate("Collab_Last_Date")}
            </CustomTableHead>
            <CustomTableHead className="w-1/4">
              {translate("Status")}
            </CustomTableHead>
            <CustomTableHead className="w-1/4">
              {translate("Action")}
            </CustomTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            <>
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
                    </div>
                  </CustomTableCell>
                  <CustomTableCell>
                    {collaboration?.productId?.title}
                  </CustomTableCell>
                  <CustomTableCell>
                    {collaboration?.productId?.category.join(", ")}
                  </CustomTableCell>
                  <CustomTableCell>
                    {" "}
                    {collaboration?.creatorId?.user_name}
                  </CustomTableCell>
                  <CustomTableCell>{""}</CustomTableCell>
                  <CustomTableCell>{""}</CustomTableCell>
                  <CustomTableCell className="w-fit">
                    <div
                      className={`rounded-[6px] bg-opacity-10 text-center p-2`}
                    >
                      <span
                        className={`${
                          badgeColor[collaboration?.collaborationStatus]
                        } bg-opacity-10 text-xs font-medium me-2 px-2 py-2 rounded-xl dark:bg-blue-900 dark:text-blue-300`}
                      >
                        {capitalizeFirstLetter(
                          collaboration?.collaborationStatus
                        )}
                      </span>
                    </div>
                  </CustomTableCell>
                  <CustomTableCell>
                    <div className={`flex gap-4 justify-center`}>
                      {collaboration?.collaborationStatus ===
                        COLLOBRATION_STATUS.REQUESTED && (
                        <Check
                          className="cursor-pointer"
                          onClick={() =>
                            handleStatusChangeRequest(
                              "accepted",
                              collaboration?._id
                            )
                          }
                        />
                      )}
                      {collaboration?.collaborationStatus ===
                        COLLOBRATION_STATUS.REQUESTED && (
                        <X
                          className="cursor-pointer"
                          onClick={() =>
                            handleStatusChangeRequest(
                              "rejected",
                              collaboration?._id
                            )
                          }
                        />
                      )}
                      {collaboration?.collaborationStatus ===
                        COLLOBRATION_STATUS.PENDING && (
                        <MessagesSquare
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/vendor/products/view/${collaboration?.productId?._id}?isChatView=true&creatorId=${collaboration?.creatorId?._id}`
                            )
                          }
                        />
                      )}
                    </div>
                  </CustomTableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={8}>
                <EmptyPlaceHolder />
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CollaborationTable;
