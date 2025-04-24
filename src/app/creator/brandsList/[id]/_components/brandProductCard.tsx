import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, XCircle, Eye, ImageOff } from "lucide-react";
import ToolTip from "@/app/_components/components-common/tool-tip";
import StatusBadge from "@/app/_components/components-common/status-badge";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import { IBrand } from "./list";
import { translate } from "@/lib/utils/translate";

interface IProductCardProps {
  brand: IBrand;
  onView: (id: string) => void;
  onAction: (status: string, brand: IBrand) => void;
}

const ProductCard = ({ brand, onView, onAction }: IProductCardProps) => {
  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full transition hover:shadow-lg">
      {/* Image */}
      <div
        className="w-full aspect-[3/2] rounded-lg overflow-hidden mb-3 flex justify-center items-center bg-background cursor-pointer"
        onClick={() => onView(brand._id)}
      >
        {brand.media?.length > 0 ? (
          <img
            src={brand.media[0]}
            alt={brand.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff className="w-8 h-8 text-gray-400" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col p-4 gap-2 flex-1 justify-between text-center">
        {/* Info */}
        <div className="mb-3 px-2 text-center">
          <div className="text-lg font-semibold">
            {" "}
            <TruncateWithToolTip
              checkHorizontalOverflow={true}
              linesToClamp={2}
              text={brand.title}
            />
          </div>
          <div className="text-gray-700 text-sm mt-1 line-clamp-2">
            <TruncateWithToolTip
              checkHorizontalOverflow={true}
              linesToClamp={2}
              text={brand.description}
            />
          </div>
          <div className="text-gray-500 text-sm mt-1">
            {translate("SKU")} : {brand.sku}
          </div>
          <div className="text-gray-500 text-sm mt-1">
            <TruncateWithToolTip
              checkHorizontalOverflow={true}
              linesToClamp={1}
              text={`${translate("Categories")} : ${
                brand.categories || "Uncategorized"
              }`}
            />
          </div>
          {brand.tags?.length > 0 && (
            <div className="text-gray-500 text-sm mt-1">
              {" "}
              <TruncateWithToolTip
                checkHorizontalOverflow={true}
                linesToClamp={1}
                text={`${translate("Tags")} : ${brand.tags?.join(", ") || ""}`}
              />
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex justify-center mb-3 !text-sm absolute top-0 left-0 m-3 bg-white rounded">
          {(brand.status === "REJECTED" ||
            (brand.status === "REQUESTED" &&
              brand?.request?.requestFrom === "CREATOR")) && (
            <StatusBadge status={brand.status} />
          )}
        </div>
        {/*  Actions */}
        <div className="flex items-center justify-around items-center gap-3 mt-2 pt-3 border-t text-sm text-gray-600">
          {/* Brand Info */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onView(`/vendor/profile/${brand?.vendor?._id}`)}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={
                  brand?.vendor?.profile_image ||
                  "/assets/profile/profile-image.png"
                }
                className={brand?.vendor?.profile_image ? "" : "opacity-50"}
              />
            </Avatar>
            <div className="text-sm text-gray-700 font-medium">
              {brand?.vendor?.business_name || "Unknown Vendor"}
            </div>
          </div>
          {/* Action */}
          {(() => {
            if (
              brand.status === "REQUESTED" &&
              brand?.request?.requestFrom === "CREATOR"
            ) {
              return (
                <div
                  onClick={() => onAction(brand.status, brand)}
                  className="flex items-center gap-2 cursor-pointer"
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
            if (brand.status === "SEND_REQUEST") {
              return (
                <div
                  onClick={() => onAction(brand.status, brand)}
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
      </div>
    </div>
  );
};

export default ProductCard;
