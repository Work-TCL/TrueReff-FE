"use client";
import { IProduct } from "./list";
import { useRouter } from "next/navigation";
import { translate } from "@/lib/utils/translate";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";

const ProductCard = ({ item: product }: { item: IProduct }) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between h-full p-4 border border-stroke hover:shadow-lg">
      {/* Image */}
      <div className="w-full aspect-[3/1] rounded-lg overflow-hidden mb-3">
        {product.media?.length > 0 && (
          <img
            src={product.media?.[0] || "/placeholder.png"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        )}
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
          <div className="text-gray-500 text-sm mt-1 flex flex-wrap gap-2 mt-2">
            {product.tags?.slice(0, 4).map((v) => (
              <span className="bg-background py-1 px-2 rounded">#{v}</span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {/* <div className="flex justify-around text-center w-full border-t pt-3 text-sm mb-3">
        <div>
          <div className="font-semibold">9800</div>
          <div className="text-gray-500">Total Sale</div>
        </div>
        <div>
          <div className="font-semibold">3M+</div>
          <div className="text-gray-500">Total Views</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 font-semibold">
            <FaStar className="text-yellow-500 text-base" /> 4.8
          </div>
          <div className="text-gray-500">Rating</div>
        </div>
      </div> */}

      {/* Button */}
      <button
        onClick={() => router.push(`/creator/my-store/${product._id}`)}
        className="w-full py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-all"
      >
        {translate("Collaborate_Now")}
      </button>

      {/* Social Icons */}
      {/* <div className="flex justify-center gap-4 mt-3">
        <button className="text-pink-500 hover:text-pink-600">
          <FaInstagram size={20} />
        </button>
        <button className="text-red-600 hover:text-red-700">
          <FaYoutube size={20} />
        </button>
      </div> */}
    </div>
  );
};

export default ProductCard;
