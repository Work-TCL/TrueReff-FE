"use client";

import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { IProduct } from "./list";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { cn } from "@sohanemon/utils";

const ProductCard = ({ item: product }: { item: IProduct }) => {
  const translate = useTranslations();
  const router = useRouter();
  const { chipText, chipColor } = calculateStatusChip(product);

  return (
    <Card
      onClick={() => router?.push(`/vendor/products/view/${product?._id}`)}
      className="cursor-pointer w-full border border-stroke rounded-xl p-4 flex flex-col items-center text-center gap-3 hover:shadow-sm transition-shadow bg-white overflow-hidden relative"
    >
      {/* Status / Expiration Chip */}
      <div
        className={`absolute top-2 right-2 md:text-[10px] text-[8px] px-2 py-1 rounded-full font-semibold uppercase ${chipColor}`}
      >
        {chipText}
      </div>

      <CardContent className="w-full p-0 flex flex-col items-center gap-3">
        {/* Product Image */}
        <div className="bg-background rounded-lg max-w-full aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
          {product.media?.length > 0 ? (
            <img
              src={product.media[0]}
              alt={product.title}
              className="w-full h-full"
            />
          ) : (
            <ImageOff className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-1 text-start w-full overflow-hidden">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-xs sm:text-sm md:text-lg font-semibold w-full truncate"
            text={product.title}
          />
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-500 text-xs w-full truncate"
            text={`${translate("Channel")} : ${product.channelName || "-"}`}
          />
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-500 text-[10px] sm:text-xs w-full truncate"
            text={`${translate("Categories")} : ${
              product.categories || "Uncategorized"
            }`}
          />
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-500 text-[10px] sm:text-xs w-full truncate"
            text={`${translate("Creator_Commision")} : ${
              product.commission_type === "FIXED_AMOUNT" ? "₹" : "$"
            } ${product.commission}`}
          />
          {/* Tags */}
          {product.tags?.length > 0 ? (
            <div className="flex gap-2 mt-1 flex-wrap">
              {product.tags.slice(0, 2).map((tag, index) => (
                <TruncateWithToolTip
                  key={index}
                  checkHorizontalOverflow={true}
                  className={cn(
                    "flex items-center gap-1 text-[10px] md:px-3 text-center px-1 py-0.5 rounded-full bg-muted text-muted-foreground border border-muted-foreground"
                  )}
                  text={`#${tag}`}
                />
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

export function calculateStatusChip(product: IProduct) {
  const now = new Date();
  const endDate = new Date(product.endDate || "");
  const isExpired =
    !product.lifeTime &&
    product.endDate &&
    endDate.getTime() <= now.getTime();

  let chipText = product.status || "Unknown";
  let chipColor = "bg-gray-800 text-white";

  if (isExpired) {
    chipText = "Expired";
    chipColor = "bg-red-700 text-white";
  } else if (product.status === "ACTIVE") {
    if(endDate && !product.lifeTime){
      const diffMs = endDate.getTime() - now.getTime();
      const minutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);

      if (weeks > 0) chipText = `${weeks} Week${weeks > 1 ? "s" : ""} Left`;
      else if (days > 0) chipText = `${days} Day${days > 1 ? "s" : ""} Left`;
      else if (hours > 0)
        chipText = `${hours} Hour${hours > 1 ? "s" : ""} Left`;
      else chipText = `${minutes} Minute${minutes > 1 ? "s" : ""} Left`;
    } else if(product.lifeTime){
      chipText = "Never Expire";
    }

    chipColor = "bg-green-700 text-white";
  } else if (product.status === "PENDING") {
    chipText = "Pending";
    chipColor = "bg-yellow-100 text-yellow-700";
  }

  return { chipText, chipColor };
}
