"use client";
import React, { useState } from "react";
import { ImageOff, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import axios from "@/lib/web-api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { IBrandProduct } from "../list";
import Loader from "@/app/_components/components-common/layout/loader";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import CancelRequest from "@/app/_components/components-common/dialogs/cancel-request";

const ProductCard = ({
  item: product,
  handleUpdateProduct,
  size = "reguler",
}: {
  item: IBrandProduct;
  handleUpdateProduct: (id: string, collaboration: any) => void;
  size?: "reguler" | "small";
}) => {
  const router = useRouter();
  const translate = useTranslations();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState("");

  const handleDetailView = (id: string) => {
    router.push(`/creator/product-management/${id}`);
  };

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/product/collaboration/creator/request-creator`,
        {
          productId: product?._id,
          vendorId: product?.vendorId,
        }
      );
      if (response.status === 201) {
        handleUpdateProduct(product?._id, response?.data?.data?.collaboration);
        setIsOpen("");
        toast.success(response?.data?.message);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        key={product?.title}
        className="relative cursor-pointer h-full w-full border border-stroke rounded-xl p-2 md:p-2 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow bg-white overflow-hidden"
      >
        <CardContent className="w-full p-0 flex flex-col justify-between flex-grow gap-2">
          {loading && <Loader />}
          {/* Image */}
          <div
            className={`bg-background rounded-lg max-w-full w-full flex items-center justify-center overflow-hidden ${
              size === "small" ? "h-[165px]" : "aspect-[4/3]"
            }`}
            onClick={() => handleDetailView(product?._id)}
          >
            {product.media?.length > 0 ? (
              <img
                src={product.media[0]}
                alt={product.title}
                className="w-full h-full product-img"
              />
            ) : (
              <ImageOff className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2 text-start w-full overflow-hidden">
            {/* Title */}
            <TruncateWithToolTip
              checkHorizontalOverflow={true}
              className="text-xs font-semibold w-full truncate"
              text={product.title}
            />
            {/* Status */}
            {/* <div className="flex justify-center mb-3 !text-sm absolute top-0 left-0 m-3">
                        {product?.collaboration?.collaborationStatus ? (
                            <div className="p-0 pr-0 bg-white rounded"><StatusBadge status={product?.collaboration?.collaborationStatus} messageStatus={product?.collaboration?.collaborationStatus} className="w-full"/></div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shadow" onClick={() => setIsOpen(product?._id)}>
                                <ToolTip content={"Send Collaboration Request"} delayDuration={500}><Plus className="text-primary" size={20} /></ToolTip>
                            </div>
                        )}
                    </div> */}
            {/* Price and Discount */}
            <div className="flex flex-col justify-start w-full text-sm">
              <span className="text-green-600 py-1 font-bold flex items-center">
                <IndianRupee size={14} />
                {product.price || "0.00"}
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs ${
                    product.discount ? "text-black" : "text-white"
                  }`}
                >
                  {translate("Commission")}:{" "}
                </span>
                <span
                  className={`text-red-500 text-xs ${
                    product.discount ? "bg-red-100" : "bg-white text-white"
                  } px-1 py-1 rounded-full flex items-center`}
                >
                  {product.commission_type === "FIXED_AMOUNT" ? (
                    <IndianRupee size={12} />
                  ) : (
                    ""
                  )}{" "}
                  {product.discount}
                  {product.commission_type === "PERCENTAGE" ? "%" : ""}
                  {product?.discount ? "/sale" : ""}
                </span>
              </div>
            </div>

            {/* Button */}

            <button
              key={0}
              disabled={product?.collaboration !== null}
              className={cn(
                "flex items-center justify-center gap-1 px-2 py-2 text-xs md:text-md text-semibold hover:cursor-pointer rounded-xl bg-white text-primary hover:bg-primary hover:text-white border border-primary disabled:bg-muted disabled:text-muted-foreground disabled:cursor-no-drop  disabled:border-muted-foreground"
              )}
              onClick={() => setIsOpen(product?._id)}
            >
              {translate("Collab_Now")}
            </button>
          </div>
        </CardContent>
      </Card>
      {isOpen && (
        <CancelRequest
          onClose={() => setIsOpen("")}
          collaborationId={isOpen}
          handleCancelRequest={handleSendRequest}
          loading={loading}
          title={translate(
            "Are_you_sure_you_want_to_send_the_collaboration_request"
          )}
        />
      )}
    </>
  );
};

export default ProductCard;
