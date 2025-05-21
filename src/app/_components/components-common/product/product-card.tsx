"use client";
import { Heart, ImageOff, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/commonUtils";
import ToolTip from "../tool-tip";
import { useVendorStore } from "@/lib/store/vendor";
import { useCreatorStore } from "@/lib/store/creator";

export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // or Date if parsed
  updatedAt: string; // or Date
}
export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  sku: string;
  description: string;
  media: string[]; // Array of image/video URLs
  price: number;
  channelName: string;
  category: ICategory[]; // Array of categories
  subCategory: string[]; // Array of sub-category IDs
  tags: string[]; // Array of tags
  lifeTime: boolean;
  startDate: string | null; // You can use `Date` if parsed
  endDate: string | null; // You can use `Date` if parsed
  status: string; // e.g., "ACTIVE"
  commission: number; // Commission value
  commission_type: "PERCENTAGE" | "FIXED_AMOUNT"; // Commission type
  videoType: string[]; // Array of video types
  channels: string[]; // Array of channel names
  createdAt: string; // You can use `Date` if parsed
  updatedAt: string; // You can use `Date` if parsed
  crmLink: string; // CRM link
  categories?: string; // Comma-separated string of category names
  tag?: string; // Comma-separated string of tags
}
const ProductCard = ({
  item: product,
}: {
  item: IProduct;
}) => {
  const translate = useTranslations();
  const router = useRouter();
  const {vendor} = useVendorStore();
  const {creator} = useCreatorStore();
  return (
    <Card className="relative cursor-pointer w-full border border-stroke rounded-xl p-2 md:p-3 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-shadow bg-white overflow-hidden">
      <CardContent className="w-full p-0 flex flex-col items-center gap-3">
        {/* Image */}
        <div
          className="bg-background rounded-lg max-w-full aspect-[4/3] w-full flex items-center justify-center overflow-hidden"
          onClick={() => router.push(`/product-detail/${product?._id}`)}
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
          {/* Title */}
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-md font-semibold w-full truncate"
            text={product.title}
          />
          {/* Price and Discount */}
          <div className="flex justify-between items-center w-full text-sm">
            <span className="text-green-600 px-2 py-1 font-bold">
              ₹ {" "}{product.price || "0.00"}
            </span>
            {product.commission && (
              <span className="text-red-500 text-xs bg-red-100 px-2 py-1 rounded-full">
                {product.commission} {product.commission_type === "PERCENTAGE" ? "% " : "₹ "}{translate("Off")}
              </span>
            )}
          </div>
          {(vendor?.vendorId === "" && creator?.creatorId === "") && <div className="flex items-center justify-between w-full">
            <button
              className="flex items-center w-full justify-center gap-1 mt-2 px-4 py-2 text-center text-sm font-medium text-black border border-black rounded-lg hover:bg-black hover:text-white transition"
              onClick={() => {
                
              }}
            >
              <Heart size={15} /> Add </button>
          </div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
