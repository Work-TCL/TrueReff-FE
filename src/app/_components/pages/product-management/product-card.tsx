"use client";
import React, { useState } from "react";
import { ImageOff, Eye, XCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { IProduct } from "../products/list";
import StatusBadge from "../../components-common/status-badge";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import CancelRequest from "../../components-common/dialogs/cancel-request";
import { useCreatorStore } from "@/lib/store/creator";
import axios from "@/lib/web-api/axios";
import Loader from "../../components-common/layout/loader";
import ToolTip from "../../components-common/tool-tip";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const ProductCard = ({
  item: product,
  handleUpdateProduct,
}: {
  item: IProduct;
  handleUpdateProduct: () => void;
}) => {
  const translate = useTranslations();
  const router = useRouter();
  const { creator } = useCreatorStore();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState("");

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

  const status = getRequestStatus(product);

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/product/collaboration/creator/request`,
        {
          productIds: [product?._id],
          creatorId: creator?.creatorId,
          vendorId: product?.vendor?._id,
        }
      );
      if (response.status === 201) {
        handleUpdateProduct();
        toast.success(
          response?.data?.data?.results[0]?.message || "Request sent"
        );
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (collaborationId: string) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `/product/collaboration/request/cancel/${collaborationId}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        handleUpdateProduct();
        setIsOpen("");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    if (status === "REQUESTED" && product?.collaboration?._id) {
      setIsOpen(product?.collaboration?._id);
    } else {
      handleSendRequest();
    }
  };

  return (
    <Card className="cursor-pointer w-full border border-stroke rounded-xl p-4 flex flex-col items-center text-center gap-3 hover:shadow-sm transition-shadow bg-white overflow-hidden">
      <CardContent className="w-full p-0 flex flex-col items-center gap-3">
        {loading && <Loader />}
        {/* Image */}
        <div
          className="bg-background rounded-lg max-w-full aspect-[4/3] w-full flex items-center justify-center overflow-hidden"
          onClick={() => handleDetailView(product._id)}
        >
          {product.media?.length > 0 ? (
            <img
              src={product.media[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageOff className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 text-start w-full overflow-hidden">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-xs sm:text-sm md:text-lg font-semibold w-full  line-clamp-none truncate"
            text={product.title}
          />
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-700 text-sm mt-1 w-full line-clamp-none truncate"
            text={`${product.description ? product.description : "-"}`}
          />
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-500 text-[10px] sm:text-sm  mt-1 w-full line-clamp-none truncate"
            text={`${translate("Categories")} : ${
              product.categories || "Uncategorized"
            }`}
          />
          {product.tags?.length > 0 ? (
            <div className="flex gap-2 mt-1">
              {product.tags.slice(0, 2).map((tag, index) => (
                <TruncateWithToolTip
                  checkHorizontalOverflow={true}
                  className="md:text-xs text-[10px] md:px-3 text-center px-1 py-1 bg-gray-100 text-gray-800 rounded-full border border-gray-300 w-fit line-clamp-none truncate"
                  text={`#${tag}`}
                />
              ))}
            </div>
          ) : (
            "-"
          )}
        </div>

        {/* Stats */}
        {/* <div className="flex justify-around text-center w-full pt-3 text-sm mb-3 border-t">
          <div className="">
            <div className="font-semibold">{product?.channelName || "-"}</div>
            <div className="text-gray-500">{translate("Channel")}</div>
          </div>
          <div className="border-r" />
          <div>
            <div className="font-semibold">{product?.price || "-"}</div>
            <div className="text-gray-500">{translate("Price")}</div>
          </div>
        </div> */}

        {/* Status */}
        <div className="flex justify-center mb-3 !text-sm absolute top-0 left-0 m-3 bg-white rounded">
          {(status === "REJECTED" ||
            (status === "REQUESTED" &&
              product?.request?.requestFrom === "CREATOR")) && (
            <StatusBadge status={status} />
          )}
        </div>

        {/* Actions */}
        {((status === "REQUESTED" &&
          product?.request?.requestFrom === "CREATOR") ||
          status === "SEND_REQUEST") && (
          <div className="flex justify-around items-center text-center w-full pt-3 text-sm border-t">
            {/* <div
          onClick={() => handleDetailView(product._id)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ToolTip content="View Product">
            <Eye className="text-pink-500 cursor-pointer" size={24} />
          </ToolTip>
          {translate("View")}
        </div> */}
            {/* {(() => {
              if (
                status === "REQUESTED" &&
                product?.request?.requestFrom === "CREATOR"
              ) {
                return (
                  <div
                    onClick={() => handleAction()}
                    className="flex items-center gap-2 cursor-pointer w-full border p-2 rounded-xl  justify-center bg-background"
                  >
                    <ToolTip content="Cancel Request">
                      <XCircle
                        className="text-red-500 cursor-pointer"
                        size={24}
                      />
                    </ToolTip>
                    {translate("Cancel")}
                  </div>
                );
              }
              if (status === "SEND_REQUEST") {
                return (
                  <div
                    onClick={() => handleAction()}
                    className="flex items-center gap-2 cursor-pointer w-full border p-2 rounded-xl  justify-center bg-background"
                  >
                    <ToolTip content="Send Collaboration Request">
                      <UserPlus
                        className="text-blue-500 cursor-pointer"
                        size={24}
                      />
                    </ToolTip>
                    {translate("Collobrate")}
                  </div>
                );
              }
              return null;
            })()} */}
            {(() => {
              const isCancel =
                status === "REQUESTED" &&
                product?.request?.requestFrom === "CREATOR";
              const isSendRequest = status === "SEND_REQUEST";

              if (isCancel || isSendRequest) {
                const actionIcon = isCancel ? (
                  <XCircle className="text-red-500" size={20} />
                ) : (
                  <UserPlus className="text-blue-500" size={20} />
                );

                const tooltipText = isCancel
                  ? "Cancel Request"
                  : "Send Collaboration Request";
                const buttonText = isCancel
                  ? translate("Cancel")
                  : translate("Collaborate");

                return (
                  <button
                    onClick={handleAction}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm border rounded-xl bg-background hover:bg-gray-50 transition-all sm:text-base sm:gap-3"
                  >
                    <ToolTip content={tooltipText}>{actionIcon}</ToolTip>
                    <span className="truncate">{buttonText}</span>
                  </button>
                );
              }

              return null;
            })()}
          </div>
        )}

        {isOpen && (
          <CancelRequest
            onClose={() => setIsOpen("")}
            collaborationId={isOpen}
            handleCancelRequest={handleRejectRequest}
            loading={loading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
