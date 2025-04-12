"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { useRouter } from "next/navigation";
import { CheckCircle, MessagesSquare, XCircle } from "lucide-react";
import { ICollaboration, IRequest } from "./collaboration";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import Loader from "../../components-common/layout/loader";
import StatusBadge from "../../components-common/status-badge";
import CancelRequest from "../../components-common/dialogs/cancel-request";

interface ICreatorTableProps {
  data: ICollaboration[];
  filter: string;
  user: string;
  refreshCentral: () => void;
  loader: boolean
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
  loader = false,
  refreshCentral = () => { },
}: ICreatorTableProps) => {
  const router = useRouter();
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const initialValue = {show:false,collaborationId:"",status:""};
  const [isOpen, setIsOpen] = useState<IRequestCancel>(initialValue);
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
    const { requestId } = collaboration;
    if (requestId) {
      if (requestId?.collaborationStatus === "REQUESTED" || requestId?.collaborationStatus === "REJECTED") {
        return requestId?.collaborationStatus;
      } else {
        return collaboration?.collaborationStatus;
      }
    } else return "SEND_REQUEST";
  }
  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      const response: any = await axios.delete(
        `/product/collaboration/request/cancel/${isOpen?.collaborationId}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        refreshCentral()
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
    if(isOpen?.status === "cancel"){
      handleCancelRequest()
    } else {
      handleStatusChangeRequest("rejected",isOpen?.collaborationId)
    }
  }
  const getMessages = (status:string,request:IRequest) => {
    let userStatus:{[key:string]:string} = {
      "CREATOR": "REQUESTED_CREATOR_TO_VENDOR",
      "VENDOR": "REQUESTED_VENDOR_TO_CREATOR",
    }
    return (status === "REQUESTED" && request?.requestFrom) ? userStatus[request?.requestFrom] : status;
  }
  return (
    <div className="">
      {(loading || loader) && <Loader />}
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
            let status = getRequestStatus(collaboration)
            return (
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
                  {collaboration?.productId?.description}
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.productId?.categories}
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.productId?.tag}
                </CustomTableCell>
                <CustomTableCell>
                  {collaboration?.creatorId?.user_name}
                </CustomTableCell>
                <CustomTableCell className="flex justify-center">
                  {status ? <StatusBadge status={status} messageStatus={getMessages(status,collaboration?.requestId)}/> : null}
                </CustomTableCell>
                <CustomTableCell>
                  <div className={`flex gap-4 justify-center`}>
                    {{
                      REQUESTED: {CREATOR:<div className="flex justify-between gap-3"><CheckCircle color="#22c55e"
                        className="cursor-pointer"
                        size={25}
                        onClick={() =>
                          handleStatusChangeRequest(
                            "accepted",
                            collaboration?._id
                          )
                        }
                      /><XCircle className="cursor-pointer" size={25} color="#ef4444"
                        onClick={() =>
                          setIsOpen({show:true,collaborationId: collaboration?._id,status:"reject"})
                        }
                        /></div>,VENDOR:<XCircle className="cursor-pointer" size={25} color="#ef4444"
                        onClick={() =>
                          setIsOpen({show:true,collaborationId: collaboration?._id,status:"cancel"})
                        }
                        />}[collaboration?.requestId?.requestFrom??""],
                      PENDING: <MessagesSquare
                        color="#3b82f680"
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/creator/collaboration/${collaboration?.productId?._id}?isChatView=true`)
                        }
                        size={25}
                      />
                    }[status]}
                  </div>
                </CustomTableCell>
              </TableRow>
            )
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
