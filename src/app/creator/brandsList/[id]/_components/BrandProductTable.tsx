"use client";
import React from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { IBrand } from "./list";
import { useRouter } from "next/navigation";
import { UserPlus, XCircle } from "lucide-react";
import StatusBadge from "@/app/_components/components-common/status-badge";
import ToolTip from "@/app/_components/components-common/tool-tip";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";

interface ICreatorTableProps {
  data: IBrand[];
  onView: (id: string) => void;
  onAction: (status: string, brand: IBrand) => void;
}
export default function BrandProductTable({
  data,
  onView,
  onAction,
}: ICreatorTableProps) {
  const router = useRouter();

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
            {/* <CustomTableHead className="w-1/9 text-center">
              {"View"}
            </CustomTableHead> */}
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
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onView(brand._id)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        className={brand.media?.length > 0 ? "" : "opacity-50"}
                        src={
                          brand.media?.length > 0
                            ? brand.media[0]
                            : "/assets/profile/profile-image.png"
                        }
                      />
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
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      router.push(`/vendor/profile/${brand?.vendor?._id}`)
                    }
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        className={
                          brand?.vendor?.profile_image ? "" : "opacity-50"
                        }
                        src={
                          brand?.vendor?.profile_image
                            ? brand?.vendor?.profile_image
                            : "/assets/profile/profile-image.png"
                        }
                      />
                    </Avatar>
                    <TruncateWithToolTip
                      checkHorizontalOverflow={false}
                      linesToClamp={2}
                      text={brand?.vendor?.business_name}
                    />
                  </div>
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
                {/* <CustomTableCell className="flex justify-center">
                  <ToolTip content="View Product" delayDuration={1000}>
                    <Eye
                      color="#FF4979"
                      className=" cursor-pointer"
                      onClick={() => handleDetailView(brand._id)}
                      size={25}
                    />
                  </ToolTip>
                </CustomTableCell> */}
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
                              onClick={() => onAction(status, brand)}
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
                            onClick={() => onAction(status, brand)}
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
    </div>
  );
}
