"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { IBrand } from "./list";
import { useParams, useRouter } from "next/navigation";
import { Eye, UserPlus, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import CancelRequest from "@/app/_components/components-common/dialogs/cancel-request";
import StatusBadge from "@/app/_components/components-common/status-badge";
import { useCreatorStore } from "@/lib/store/creator";
import axios from "@/lib/web-api/axios";
import ToolTip from "@/app/_components/components-common/tool-tip";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";

interface ICreatorTableProps {
  data: IBrand[];
  handleUpdateCollaboration: () => void;
}
export default function BrandProductTable({
  data,
  handleUpdateCollaboration,
}: ICreatorTableProps) {
  const router = useRouter();
  const params = useParams();
  const { creator } = useCreatorStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<string>("");
  const handleDetailView = (id: string) => {
    router.push(`/creator/brandsList/${params.id}/${id}`);
  };

  const getRequestStatus = (brand: IBrand) => {
    const { collaboration, request } = brand;
    if (collaboration && request) {
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
  const handleSendRequest = async (brand: IBrand) => {
    setLoading(true);
    try {
      const response: any = await axios.post(
        `/product/collaboration/creator/request`,
        {
          productIds: [brand?._id],
          creatorId: creator?.creatorId,
          vendorId: brand?.vendor?._id,
        }
      );
      if (response.status === 201) {
        let data = response?.data?.data?.results;
        if (data && data?.length > 0 && data[0]?.data) {
          handleUpdateCollaboration();
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
        handleUpdateCollaboration();
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
  const handleAction = (status: string | null, brand: IBrand) => {
    if (status === "REQUESTED" && brand?.collaboration?._id) {
      setIsOpen(brand?.collaboration?._id);
    } else {
      handleSendRequest(brand);
    }
  };
  return (
    <div className="overflow-auto">
      <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
        <TableHeader className="bg-stroke">
          <TableRow>
            <CustomTableHead className="w-1/9">
              {translate("Product_Name")}
            </CustomTableHead>
            <CustomTableHead className="w-1/9">
              {translate("Description")}
            </CustomTableHead>
            <CustomTableHead className="w-1/9">
              {translate("Brand_Name")}
            </CustomTableHead>
            <CustomTableHead className="w-1/9">
              {translate("Category")}
            </CustomTableHead>
            <CustomTableHead className="w-1/9">
              {translate("Sub_category")}
            </CustomTableHead>
            <CustomTableHead className="w-1/9">
              {translate("Tags")}
            </CustomTableHead>
            <CustomTableHead className="w-1/9 text-center">
              {"Status"}
            </CustomTableHead>
            <CustomTableHead className="w-1/9 text-center">
              {"View"}
            </CustomTableHead>
            <CustomTableHead className="w-1/9 text-center">
              {translate("Action")}
            </CustomTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((brand: IBrand, index: number) => {
            let status = getRequestStatus(brand);
            return (
              <TableRow key={index} className="bg-white hover:bg-gray-100">
                <CustomTableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      {brand.media?.length > 0 && (
                        <AvatarImage src={brand.media[0]} />
                      )}
                      <AvatarImage src={"/assets/brand/brand-image.svg"} />
                    </Avatar>
                    <TruncateWithToolTip
                      checkHorizontalOverflow={false}
                      linesToClamp={2}
                      text={brand.title}
                    />
                  </div>
                </CustomTableCell>
                <CustomTableCell>
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={brand?.description}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={brand?.vendor?.business_name}
                  />
                </CustomTableCell>
                <CustomTableCell>
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={
                      brand.categories?.length
                        ? brand.categories?.join(", ")
                        : ""
                    }
                  />
                </CustomTableCell>
                <CustomTableCell>
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={
                      brand.subCategories?.length
                        ? brand.subCategories?.join(", ")
                        : ""
                    }
                  />
                </CustomTableCell>
                <CustomTableCell>
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={brand?.tags?.length ? brand.tags.join(", ") : ""}
                  />
                </CustomTableCell>
                {/* <CustomTableCell>{brand.pastSales??''}</CustomTableCell> */}
                <CustomTableCell className="flex justify-center">
                  {status === "REJECTED" ||
                    (status === "REQUESTED" &&
                      brand?.request?.requestFrom === "CREATOR") ? (
                    <StatusBadge status={status} />
                  ) : null}
                </CustomTableCell>
                <CustomTableCell className="flex justify-center">
                  <ToolTip content="View Product" delayDuration={1000}>
                    <Eye
                      color="#FF4979"
                      className=" cursor-pointer"
                      onClick={() => handleDetailView(brand._id)}
                      size={25}
                    />
                  </ToolTip>
                </CustomTableCell>
                <CustomTableCell className="flex justify-center">
                  {
                    {
                      REQUESTED:
                        brand?.request?.requestFrom === "CREATOR" ? (
                          <ToolTip
                            content="Cancel Request"
                            delayDuration={1000}
                          >
                            <XCircle
                              className="cursor-pointer"
                              size={25}
                              color="#ef4444"
                              onClick={() => handleAction(status, brand)}
                            />
                          </ToolTip>
                        ) : null,
                      SEND_REQUEST: (
                        <ToolTip
                          content="Send Collaboration Request"
                          delayDuration={1000}
                        >
                          <UserPlus
                            color="#3b82f680"
                            className="cursor-pointer"
                            onClick={() => handleAction(status, brand)}
                            size={25}
                          />
                        </ToolTip>
                      ),
                    }[status]
                  }
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {isOpen && (
        <CancelRequest
          onClose={() => setIsOpen("")}
          collaborationId={isOpen}
          handleCancelRequest={handleRejectRequest}
          loading={loading}
        />
      )}
    </div>
  );
}
