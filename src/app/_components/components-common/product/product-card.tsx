"use client";
import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { translate } from "@/lib/utils/translate";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { Card, CardContent } from "@/components/ui/card";

export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // or Date if parsed
  updatedAt: string; // or Date
}
export interface IProduct {
  vendor: any;
  collaboration: any;
  request: any;
  _id: string;
  title: string;
  channelProductId: string;
  vendorId: string;
  sku: string;
  description: string;
  media: string[]; // assuming media is an array of image/video URLs or paths
  channelName: string; // extend as needed
  category: ICategory[];
  tags: string[]; // if tags are strings
  createdAt: string; // or Date
  updatedAt: string;
  categories?: string;
  subCategories?: string;
  tag?: string;
  price?: string;
  crmLink?: string;
}
const ProductCard = ({
  item: product,
  productDetailLink,
}: {
  item: IProduct;
  productDetailLink: string;
}) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => router?.push(`${product?.crmLink}`)}
      className="cursor-pointer w-full  border border-stroke rounded-xl p-4 flex flex-col items-center text-center gap-3 hover:shadow-sm transition-shadow bg-white overflow-hidden"
    >
      <CardContent className="w-full p-0 flex flex-col items-center gap-3">
        <div className="bg-background rounded-lg max-w-full aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
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
        <div className="flex flex-col gap-2 text-start w-full overflow-hidden">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-xs sm:text-sm md:text-lg font-semibold w-full line-clamp-none truncate"
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
      </CardContent>
    </Card>
  );
};

export default ProductCard;
