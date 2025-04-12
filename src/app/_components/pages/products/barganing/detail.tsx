import { translate } from "@/lib/utils/translate";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface IProduct {
  productId: string;
  images: string[];
  name: string;
  description: string;
  price: number;
  sku: string;
  barcode: string;
  quantity: number;
  totalInventory: number;
  variants: any[];
  tags: string[];
  category?: string;
  vendorId?: string;
}

export interface ICollaboration {
  _id: string;
  creatorId: string;
  productId: string;
  vendorId: string;
  collaborationStatus: string;
  utmLink: string | null;
  discountType: string;
  discountValue: number;
  couponCode: string;
  commissionPercentage: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

const statusText: { [key: string]: string } = {
  REQUESTED: "Requested",
  REJECTED: "Rejected",
  PENDING: "Start Bargaining",
  LIVE: "Live",
  EXPIRED: "Expired",
  "": "Send Request",
};

const buttonColor: { [key: string]: string } = {
  LIVE: "bg-[#098228] text-[#098228]",
  REQUESTED: "bg-[#FF9500] text-[#FF9500]",
  EXPIRED: "bg-[#FF3B30] text-[#FF3B30]",
  REJECTED: "bg-[#FF3B30] text-[#FF3B30]",
  PENDING: "bg-[#000] text-[#FFF]",
  "": "bg-[#000] text-[#FFF]",
};
export default function BargainingDetailView({
  openUtmForm,
  isVendor,
}: {
  productData: IProduct;
  openUtmForm: () => void;
  isVendor: boolean;
}) {
    const pathName = usePathname();
  const axios = useAxiosAuth();
  const session = useSession();
  const creator = session?.data?.creator ?? { _id: "" };
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId;
  const channelType = params?.channelType;
  const searchParams = useSearchParams();
  const shopifyId = searchParams.get("id");
  const isChatView = searchParams.get("isChatView") === "true";
  const brandName = searchParams.get("brandName");
  const creatorId = searchParams.get("creatorId");

  const [loading, setLoading] = useState<boolean>(false);
  const [isUTMView, setIsUTMView] = useState<boolean>(false);
  const [collaborationStatus, setCollaborationStatus] = useState<string>("");
  const [collaborationData, setCollaborationData] = useState<ICollaboration>({
    _id: "",
    creatorId: "",
    productId: "",
    vendorId: "",
    collaborationStatus: "",
    utmLink: "",
    discountType: "",
    discountValue: 0,
    couponCode: "",
    commissionPercentage: 0,
    expiresAt: "",
    createdAt: "",
    updatedAt: "string",
  });
  const [productData, setProductData] = useState<IProduct>({
    productId: "",
    images: [],
    name: "",
    description: "",
    price: 0,
    sku: "",
    barcode: "",
    quantity: 0,
    totalInventory: 0,
    variants: [],
    tags: [],
    category: "",
    vendorId: "",
  });
  // Update fetProductsList to set both cursors
  const fetchShopifyProductById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `channel/shopify/product?productId=${shopifyId}`
      );

      const product: any = response?.data?.data;
      const images = product?.media?.nodes?.map((ele: any) => ele?.image.url);
      // ✅ Update product state
      const updatedProduct = {
        productId: product.id,
        images: images,
        name: product.title,
        tags: product?.tags || [],
        description: product?.description || "", // Add description if available
        price: product?.price || 0,
        sku: product?.sku || "",
        barcode: product?.variants?.nodes[0]?.barcode || "",
        quantity: product?.quantity || 0,
        totalInventory: product?.totalInventory || 0,
        variants: product?.variants?.nodes || [],
      };

      setProductData(updatedProduct);
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/product/${productId}`);

      const product: any = response?.data?.data?.data;
      const images = product.media;
      // ✅ Update product state
      const updatedProduct = {
        productId: product._id,
        images: images,
        name: product.title,
        tags: product?.tags || [],
        description: product?.description || "", // Add description if available
        price: product?.price || 0,
        sku: product?.sku || "",
        barcode: product?.variants?.nodes[0]?.barcode || "",
        quantity: product?.quantity || 0,
        totalInventory: product?.totalInventory || 0,
        variants: product?.variants?.nodes || [],
        category: product?.category
          ?.filter((ele: ICategory) => ele?.parentId === null)
          ?.map((ele: ICategory) => ele?.name)
          ?.join(", "),
        vendorId: product?.vendorId,
      };

      setProductData(updatedProduct);
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductCollaborationStatus = async (creatorID: string) => {
    if (!creatorID) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `/product/collaboration/status/${productId}?creatorId=${creatorID}`
      );
      const collaboration: any = response?.data?.data?.collaboration;
      setCollaborationStatus(collaboration?.collaborationStatus ?? "");
      setCollaborationData(collaboration);
    } catch (error: any) {
      toast.error(error?.message || "Status Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    if (shopifyId) {
      fetchShopifyProductById();
    }
  }, [shopifyId]);

  useEffect(() => {
    if (productId) {
      fetchProductById();
    }
  }, [productId]);
  useEffect(() => {
    const creator_id = session?.data?.creator?._id || creatorId;
    if (creator_id) {
      fetchProductCollaborationStatus(creator_id);
    }
  }, [session?.data?.creator?._id, creatorId]);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        <p className="text-text font-medium text-sm">Product Image</p>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3 overflow-auto max-h-[210px] pr-2">
            {productData?.images?.length > 0 &&
              productData?.images.map((img, index) => (
                <div
                  key={index}
                  className="border border-border rounded-2xl p-2"
                >
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    width={200}
                    height={185}
                    className="rounded-md object-contain w-full h-full"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5">
        <p className="text-text font-medium text-sm">General Information</p>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col w-full gap-1">
            <label className="text-sm text-font-grey">
              {translate("Product_Name")}
            </label>
            <input
              name="product_name"
              className="p-2 border text-sm rounded-md w-full"
              value={productData?.name}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-sm text-font-grey">
              {translate("Product_Category")}
            </label>
            <input
              className="p-2 text-sm border rounded-md w-full"
              value={productData?.category}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-sm text-font-grey">
              {translate("Product_Tags")}
            </label>
            <input
              className="p-2 text-sm border rounded-md w-full"
              value={productData?.tags?.join(", ")}
              disabled
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-1">
          <label className="text-sm text-font-grey">
            {translate("Description")}
          </label>
          <textarea
            rows={4}
            className="p-2 text-sm border rounded-md w-full"
            value={productData?.description}
            disabled
          />
        </div>
        <div className="flex h-[45%] flex-col w-full items-start gap-3">
          <div className="flex w-full flex-1 flex-col gap-3">
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]">Base Price:</span>{" "}
              <span className="md:text-lg text-base font-normal text-text">
                ${productData?.price}
              </span>
            </p>

            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Discount Type: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">No discount</span>
            </p>
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Discount Type: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">0</span>
            </p>
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Tax Class: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">Tax Free</span>
            </p>
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> VAT Amount: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">12%</span>
            </p>
          </div>
          <div className="flex w-full flex-1 flex-col gap-3">
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Variation: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">Rose Gold</span>
            </p>
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Variation Type: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">Color</span>
            </p>
          </div>
          {isVendor && (
            <Button
              className="mt-3 w-fit bg-black text-white"
              onClick={openUtmForm}
            >
              {translate("Generate_UTM")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
