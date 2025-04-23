"use client";
import React, { useState } from "react";
import { ImageOff, Eye, XCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { translate } from "@/lib/utils/translate";
import { IProduct } from "../products/list";
import StatusBadge from "../../components-common/status-badge";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import CancelRequest from "../../components-common/dialogs/cancel-request";
import { useCreatorStore } from "@/lib/store/creator";
import axios from "@/lib/web-api/axios";
import Loader from "../../components-common/layout/loader";
import ToolTip from "../../components-common/tool-tip";

const ProductCard = ({
  item: product,
  handleUpdateProduct,
}: {
  item: IProduct;
  handleUpdateProduct: () => void;
}) => {
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
    <div className="bg-white rounded-xl overflow-hidden flex flex-col justify-between h-full p-4 flex-1 border border-stroke relative">
      {loading && <Loader />}
      {/* Image */}
      <div
        className="w-full aspect-[3/2] rounded-lg overflow-hidden mb-3 flex justify-center items-center bg-background cursor-pointer"
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
      <div className="text-center mb-3">
        <div className="text-lg font-semibold">
          {product.title}{" "}
          <span className="text-gray-500 text-sm">
            ({product.categories || "Uncategorized"})
          </span>
        </div>
        <div className="text-gray-700 text-sm mt-1 line-clamp-2">
          {product.description}
        </div>
        <div className="text-gray-500 text-sm mt-1">{product.tag}</div>
        <div className="text-gray-500 text-sm mt-1">
          {translate("SKU")} : {product.sku}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-around text-center w-full border-t pt-3 text-sm mb-3">
        <div>
          <div className="font-semibold">{product?.channelName || "-"}</div>
          <div className="text-gray-500">{translate("Channel")}</div>
        </div>
        <div>
          <div className="font-semibold">{product?.price || "-"}</div>
          <div className="text-gray-500">{translate("Price")}</div>
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-center mb-3 text-sm">
        {(status === "REJECTED" ||
          (status === "REQUESTED" &&
            product?.request?.requestFrom === "CREATOR")) && (
          <StatusBadge status={status} />
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-around text-center w-full border-t pt-3 text-sm mb-3">
        <div
          onClick={() => handleDetailView(product._id)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ToolTip content="View Product">
            <Eye className="text-pink-500 cursor-pointer" size={24} />
          </ToolTip>
          {translate("View")}
        </div>
        {(() => {
          if (
            status === "REQUESTED" &&
            product?.request?.requestFrom === "CREATOR"
          ) {
            return (
              <div
                onClick={() => handleAction()}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ToolTip content="Cancel Request">
                  <XCircle className="text-red-500 cursor-pointer" size={24} />
                </ToolTip>
                {translate("Decline")}
              </div>
            );
          }
          if (status === "SEND_REQUEST") {
            return (
              <div
                onClick={() => handleAction()}
                className="flex items-center gap-2 cursor-pointer"
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
        })()}
      </div>

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
};

export default ProductCard;
