"use client";
import React, { ReactElement, useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { useRouter } from "next/navigation";
import { IProduct } from "./";
import { useTranslations } from "next-intl";
import StatusBadge from "../../components-common/status-badge";
import { Eye, ImageOff, UserPlus, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import CancelRequest from "../../components-common/dialogs/cancel-request";
import { useCreatorStore } from "@/lib/store/creator";
import axios from "@/lib/web-api/axios";
import Loader from "../../components-common/layout/loader";
import ToolTip from "../../components-common/tool-tip";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components-common/data-table";
interface IProductTableProps {
  data: IProduct[];
  type?: "table" | "card";
  CardComponent?: (item: any) => ReactElement;
  handleUpdateProduct: () => void;
}
export default function ProductTable({
  data,
  type = "table",
  CardComponent,
  handleUpdateProduct,
}: IProductTableProps) {
  const router = useRouter();
  const translate = useTranslations();
  const { creator } = useCreatorStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<string>("");
  const handleDetailView = (id: string) => {
    router.push(`/creator/product-management/${id}`);
  };
  const getRequestStatus = (product: IProduct) => {
    const { collaboration, request } = product;
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
  const handleSendRequest = async (product: IProduct) => {
    setLoading(true);
    try {
      const response: any = await axios.post(
        `/product/collaboration/creator/request`,
        {
          productIds: [product?._id],
          creatorId: creator?.creatorId,
          vendorId: product?.vendor?._id,
        }
      );
      if (response.status === 201) {
        let data = response?.data?.data?.results;
        if (data && data?.length > 0 && data[0]?.data) {
          handleUpdateProduct();
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
        handleUpdateProduct();
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
  const handleStatusChangeRequest = async (
    status: "accepted" | "rejected",
    collaborationId: string = ""
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
        handleUpdateProduct();
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleAction = (status: string | null, product: IProduct) => {
    if (status === "REQUESTED" && product?.collaboration?._id) {
      setIsOpen(product?.collaboration?._id);
    } else {
      handleSendRequest(product);
    }
  };

  const productColumns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "title",
      header: () => translate("Product_Name"),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <span
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleDetailView(product._id)}
          >
            {product.media?.length > 0 && product.media[0] ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={product.media[0]} />
              </Avatar>
            ) : (
              <ImageOff className="w-6 h-6 text-gray-400" />
            )}
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={product.title ?? ""}
            />
          </span>
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
          text={row.original.description ?? ""}
        />
      ),
    },
    {
      accessorKey: "vendor.business_name",
      header: () => translate("Brand_Name"),
      cell: ({ row }) => {
        const vendor = row.original.vendor;
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push(`/vendor/profile/${vendor?._id}`)}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                className={vendor?.profile_image ? "" : "opacity-50"}
                src={
                  vendor?.profile_image
                    ? vendor.profile_image
                    : "/assets/profile/profile-image.png"
                }
              />
            </Avatar>
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={vendor?.business_name ?? ""}
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
          text={row.original.categories ?? ""}
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
          text={row.original.subCategories ?? ""}
        />
      ),
    },
    {
      accessorKey: "tag",
      header: () => translate("Tags"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.tag ?? ""}
        />
      ),
    },
    {
      id: "status",
      header: () => (
        <div className="flex justify-center mx-auto">{translate("Status")}</div>
      ),
      cell: ({ row }) => {
        const product = row.original;
        const status = getRequestStatus(product);
        if (
          status === "REJECTED" ||
          (status === "REQUESTED" &&
            product?.request?.requestFrom === "CREATOR")
        ) {
          return (
            <div className="flex justify-center text-nowrap">
              <StatusBadge status={status} />
            </div>
          );
        }
        return null;
      },
    },
    {
      id: "action",
      header: () => (
        <div className="flex justify-center mx-auto">{translate("Action")}</div>
      ),
      cell: ({ row }) => {
        const product = row.original;
        const status = getRequestStatus(product);
        return (
          <div className="flex justify-center mx-auto">
            {
              {
                REQUESTED: {
                  CREATOR: (
                    <ToolTip content="Cancel Request" delayDuration={1000}>
                      <XCircle
                        strokeWidth={1.5}
                        className="cursor-pointer"
                        size={25}
                        color="#ef4444"
                        onClick={() => handleAction(status, product)}
                      />
                    </ToolTip>
                  ),
                  VENDOR: null,
                }[product?.request?.requestFrom ?? ""],
                SEND_REQUEST: (
                  <ToolTip
                    content="Send Collaboration Request"
                    delayDuration={1000}
                  >
                    <UserPlus
                      strokeWidth={1.5}
                      color="#3b82f680"
                      className="cursor-pointer"
                      onClick={() => handleAction(status, product)}
                      size={25}
                    />
                  </ToolTip>
                ),
              }[status]
            }
          </div>
        );
      },
    },
  ];

  return (
    <div className="overflow-auto">
      {loading && <Loader />}
      {!loading && (
        <DataTable
          columns={productColumns}
          data={data}
          type={type}
          CardComponent={(item) =>
            CardComponent ? CardComponent(item) : <></>
          }
        />
      )}
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
