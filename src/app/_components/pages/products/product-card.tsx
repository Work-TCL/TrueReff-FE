"use client";
import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { IProduct } from "./list";
import { translate } from "@/lib/utils/translate";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";

const ProductCard = ({ item: product }: { item: IProduct }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router?.push(`/vendor/products/view/${product?._id}`)}
      className="bg-white rounded-xl overflow-hidden flex flex-col justify-between h-full p-4 flex-1 border border-stroke hover:shadow-lg cursor-pointer"
    >
      {/* Image */}
      <div className="p-3">
        <div className="w-full aspect-[3/2] rounded-lg overflow-hidden mb-3 flex justify-center items-center bg-background">
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
      </div>

      {/* Title + Category */}
      <div className="text-left mb-3">
        <div className="text-lg font-semibold">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            linesToClamp={2}
            text={product.title}
          />
        </div>
        <div className="text-gray-700 text-sm mt-1 line-clamp-2 overflow-hidden text-ellipsis">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            linesToClamp={2}
            text={product.description}
          />
        </div>
        <div className="text-gray-500 text-sm mt-1">
          {translate("SKU")} : {product.sku}
        </div>
        <div className="text-gray-500 text-sm mt-1">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            linesToClamp={1}
            text={`${translate("Categories")} : ${
              product.categories || "Uncategorized"
            }`}
          />
        </div>
        {product.tags?.length > 0 && (
          <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-2">
            {product.tags?.slice(0, 4).map((v) => (
              <span className="bg-background py-1 px-2 rounded">#{v}</span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-around text-center w-full border-t pt-5 p-3 text-sm items-center">
        <div>
          <div className="font-semibold">{product?.channelName || "-"}</div>
          {/* <div className="text-gray-500 flex items-center gap-2">
            {translate("Channel")}
          </div> */}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-gray-500 flex items-center">
            {translate("Price")}
          </div>
          <div className="font-semibold">{product?.price || "-"}</div>
        </div>
      </div>

      {/* Button */}
      {/* <button
        onClick={() => handleCollaborateNow(product._id)}
        className="w-full py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-all"
      >
        {translate("Collaborate_Now")}
      </button> */}
    </div>
  );
};

export default ProductCard;
