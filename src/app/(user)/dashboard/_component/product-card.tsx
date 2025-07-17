"use client";
import { Heart, ImageOff, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useVendorStore } from "@/lib/store/vendor";
import { useCreatorStore } from "@/lib/store/creator";
import { useAuthStore } from "@/lib/store/auth-user";
import { useState } from "react";
import { toastMessage } from "@/lib/utils/toast-message";
import axios from "@/lib/web-api/axios";
import { RiLoader3Fill } from "react-icons/ri";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import LoginDialog from "@/app/_components/components-common/dialogs/login";

export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt?: string; // or Date if parsed
  updatedAt?: string; // or Date
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
  crmLink?: string; // CRM link
  categories?: string; // Comma-separated string of category names
  tag?: string; // Comma-separated string of tags
}
const ProductCard = ({
  item: product,
  id,
  isWishListed,
  refreshData = () => {},
}: {
  item: IProduct;
  id?: string;
  isWishListed?: boolean;
  refreshData?: () => void;
}) => {
  const translate = useTranslations();
  const { account } = useAuthStore();
  const [loader, setLoader] = useState<boolean>(false);
  const [loginPopUp, setLoginPopUp] = useState<boolean>(false);
  const router = useRouter();
  const { vendor } = useVendorStore();
  const { creator } = useCreatorStore();
  const addToWishlist = async (productId: string) => {
    setLoader(true);
    try {
      if (account?.id) {
        const payload = {
          collaborationId: productId,
          userId: account?.id,
        };
        const response = await axios.post(
          `/product/wishlist/add-remove`,
          payload
        );
        if (response?.status === 200) {
          toastMessage.success(response?.data?.message);
          refreshData();
        }
      } else {
        setLoginPopUp(true);
        setLoader(false);
      }
    } catch (error: any) {
      // toast.error(error?.message || "Product Fetch Failed.");
    } finally {
      setLoader(false);
    }
  };
  return (
    <Card className="relative cursor-pointer w-full border border-stroke rounded-xl p-2 md:p-3 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-shadow bg-white overflow-hidden">
      <CardContent className="w-full p-0 flex flex-col items-center gap-3">
        {/* Image */}
        <div
          className="bg-background rounded-lg max-w-full aspect-[4/3] w-full flex items-center justify-center overflow-hidden"
          onClick={() =>
            router.push(`/product-detail/${id ? id : product?._id}`)
          }
        >
          {product?.media?.length > 0 ? (
            <img
              src={product.media[0]}
              alt={product.title}
              className="w-full h-full object-cover product-img"
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
            className="text-sm md:text-md font-semibold w-full truncate"
            text={product.title}
          />
          {/* Price and Discount */}
          <div
            className={`flex ${
              product.price > 1_000_000 ? "flex-col" : "flex-row"
            } items-center w-full text-xs md:text-sm space-x-2`}
          >
            <span className="flex items-center text-green-600 py-1 font-bold">
              <IndianRupee size={12} strokeWidth={2.5} />{" "}
              {product.price || "0.00"}
            </span>
            {product.commission && (
              <span className="flex items-center text-red-500 text-xs bg-red-100 px-2 py-1 rounded-full">
                {product.commission_type === "FIXED_AMOUNT" ? (
                  <IndianRupee size={12} />
                ) : (
                  ""
                )}
                {product.commission}{" "}
                {product.commission_type === "PERCENTAGE" ? "% " : ""}
                {translate("Off")}
              </span>
            )}
          </div>
          {vendor?.vendorId === "" && creator?.creatorId === "" && (
            <div className="flex items-center justify-between w-full">
              <button
                className="flex items-center w-full justify-center group gap-1 mt-2 px-4 py-2 text-center text-xs md:text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
                onClick={() => addToWishlist(id ? id : product?._id)}
              >
                {loader && (
                  <RiLoader3Fill className="absolute animate-spin duration-300 text-xl" />
                )}
                {isWishListed ? (
                  <span
                    className={`flex gap-2 items-center  ${
                      loader ? "opacity-0" : ""
                    }`}
                  >
                    <Heart
                      className="fill-primary group-hover:fill-white"
                      size={15}
                    />{" "}
                    {translate("Remove")}
                  </span>
                ) : (
                  <>
                    <Heart size={15} /> {translate("Add")}
                  </>
                )}{" "}
              </button>
            </div>
          )}
        </div>
      </CardContent>
      {loginPopUp && (
        <LoginDialog
          title={"Login_Required"}
          description="Login_Required_Description"
          onClose={() => setLoginPopUp(false)}
        />
      )}
    </Card>
  );
};

export default ProductCard;
