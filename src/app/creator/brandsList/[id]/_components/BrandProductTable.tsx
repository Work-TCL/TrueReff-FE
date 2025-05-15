"use client";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IBrand } from "./list";
import { useRouter } from "next/navigation";
import { UserPlus, XCircle } from "lucide-react";
import StatusBadge from "@/app/_components/components-common/status-badge";
import ToolTip from "@/app/_components/components-common/tool-tip";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/app/_components/components-common/data-table";
import { useTranslations } from "next-intl";

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
  const translate = useTranslations();
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

  const columns: ColumnDef<IBrand>[] = [
    {
      accessorKey: "title",
      header: () => translate("Product_Name"),
      cell: ({ row }) => {
        const brand = row.original;
        return (
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
        );
      },
    },
    {
      accessorKey: "description",
      header: () => translate("Description"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.description}
        />
      ),
    },
    {
      accessorKey: "vendor.business_name",
      header: () => translate("Brand_Name"),
      cell: ({ row }) => {
        const brand = row.original;
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push(`/vendor/profile/${brand?.vendor?._id}`)}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                className={brand?.vendor?.profile_image ? "" : "opacity-50"}
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
        );
      },
    },
    {
      accessorKey: "categories",
      header: () => translate("Category"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.categories?.join(", ") || ""}
        />
      ),
    },
    {
      accessorKey: "subCategories",
      header: () => translate("Sub_category"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.subCategories?.join(", ") || ""}
        />
      ),
    },
    {
      accessorKey: "tags",
      header: () => translate("Tags"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.tags?.join(", ") || ""}
        />
      ),
    },
    {
      id: "status",
      header: () => <div className="text-center">{translate("Status")}</div>,
      cell: ({ row }) => {
        const brand = row.original;
        const status = getRequestStatus(brand);
        return status === "REJECTED" ||
          (status === "REQUESTED" &&
            brand?.request?.requestFrom === "CREATOR") ? (
          <StatusBadge status={status} />
        ) : null;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{translate("Action")}</div>,
      cell: ({ row }) => {
        const brand = row.original;
        const status = getRequestStatus(brand);

        if (
          status === "REQUESTED" &&
          brand?.request?.requestFrom === "CREATOR"
        ) {
          return (
            <div className="mx-auto w-fit">
              <ToolTip content="Cancel Request" delayDuration={1000}>
                <XCircle
                  className="cursor-pointer"
                  size={25}
                  color="#ef4444"
                  onClick={() => onAction(status, brand)}
                />
              </ToolTip>
            </div>
          );
        }

        if (status === "SEND_REQUEST") {
          return (
            <div className="mx-auto w-fit">
              <ToolTip
                content="Send Collaboration Request"
                delayDuration={1000}
              >
                <UserPlus
                  className="cursor-pointer"
                  size={25}
                  color="#3b82f680"
                  onClick={() => onAction(status, brand)}
                />
              </ToolTip>
            </div>
          );
        }

        return null; // important to avoid undefined crash
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
