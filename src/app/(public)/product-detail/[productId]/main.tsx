"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { ProductImageGallery } from "./imagePreview";
// import { ProductInfo } from "./productDetail";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { useCreatorStore } from "@/lib/store/creator";
import { useAuthStore } from "@/lib/store/auth-user";
import axios from "@/lib/web-api/axios";
import Loading from "@/app/vendor/loading";
import CommonBreadcrumb from "@/app/_components/components-common/breadcrumb-links";
import NotFound from "@/app/_components/components-common/404";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Label } from "recharts";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";

export interface ICategory {
    _id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IProduct {
    _id: string;
    title: string;
    channelProductId: string;
    sku: string;
    description: string;
    media: string[];
    price: number;
    channelName: string;
    category: ICategory[];
    subCategory: string[];
    tags: string[];
    lifeTime: boolean;
    startDate: string; // ISO date string
    endDate: string | null;
    status: 'ACTIVE' | 'INACTIVE' | string;
    commission: number;
    commission_type: 'PERCENTAGE' | 'FLAT' | string;
    referenceLinks: string[];
    creatorMaterial: string[]; // can contain both images and videos
    videoType: string[];
    channels: string[];
    createdAt: string;
    updatedAt: string;
    channelProductVendor?: string;
    variants: any[];
    vendorId: string;
    freeProduct: boolean;
    notes: string;
    productType?: string;
}

export interface IRequest {
    _id: string;
    creatorId: string;
    productId: string;
    vendorId: string;
    collaborationStatus: string;
    requestFrom: string;
    createdAt: string;
    updatedAt: string;
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
    requestId: IRequest;
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
type ViewProductDetailProps = {
    isFromPublic?: boolean;
};
export default function ViewProductDetail({
    isFromPublic,
}: ViewProductDetailProps) {
    const translate = useTranslations();
    const pathName = usePathname();
    const { account } = useAuthStore();
    const { creator } = useCreatorStore();
    const params = useParams();
    const router = useRouter();
    const productId = params?.productId;
    const searchParams = useSearchParams();
    const channelType = searchParams.get("channelName");
    const shopifyId = searchParams.get("id");
    const creatorId = searchParams.get("creatorId");
    const [notFounded, setNotFounded] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [productData, setProductData] = useState<IProduct>({
        "variants": [],
        "_id": "",
        "title": "",
        "channelProductId": "",
        "vendorId": "",
        "sku": "",
        "description": "",
        "media": [],
        "price": 0,
        "channelName": "",
        "category": [],
        "subCategory": [],
        "tags": [],
        "lifeTime": false,
        "startDate": "",
        "endDate": null,
        "freeProduct": false,
        "status": "",
        "commission": 0,
        "commission_type": "",
        "referenceLinks": [],
        "creatorMaterial": [],
        "videoType": [],
        "channels": [],
        "notes": "",
        "createdAt": "",
        "updatedAt": ""
    }
    );
    const [selectedVariant, setSelectedVariant] = useState({
        title: "",
        price: ""
    });
    const [selectedImage, setSelectedImage] = useState(0);

    const fetchProductById = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/auth/creator-store/product/${productId}`
            );
            const product: any = response?.data?.data;
            if (product) {
                setProductData(product);
                setSelectedVariant(product?.variants?.length > 0 ? product?.variants[0] : { title: '', price: '' })
            }
        } catch (error: any) {
            // toast.error(error?.message || "Product Fetch Failed.");
            setNotFounded(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductById();
        }
    }, [productId]);
    // Product id required condition removed as it is not required.
    if (notFounded) {
        return <div className="grid grid-cols-1 h-screen p-4"><EmptyPlaceHolder title={translate("Collaboration_Not_Found")}  /></div>;
    }

    return (
        <>
            {loading ? (
                <Loading className="h-screen" />
            ) : (
                <div className="flex flex-col  w-full p-3 md:p-6 gap-4 h-[100vh]">
                    {/* Card Section */}
                    <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-6 gap-4 md:mx-auto">
                        <div className="col-span-2">
                            <div className="flex bg-white p-2 rounded-xl shadow-md">
                                {/* Left Thumbnails */}
                                <div className={`flex flex-col gap-2 overflow-y-auto max-h-[400px] ${productData?.media?.length > 1 && "pr-2"}`}>
                                    {productData?.media?.length > 1 && [...productData?.media].map((img, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`cursor-pointer border hover:border-gray-400 rounded-md p-1 ${selectedImage === index ? 'border-black' : 'border-transparent'
                                                }`}
                                        >
                                            <Image
                                                loader={({ src }) => src}
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                width={60}
                                                height={60}
                                                className="rounded"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div className="flex-1 flex items-center justify-center">
                                    <Image
                                        loader={({ src }) => src}
                                        src={productData?.media?.length > 0 ? productData?.media[selectedImage] : "/assets/product/image-square.svg"}
                                        alt="Main Preview"
                                        width={400}
                                        height={400}
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="w-full p-4 bg-white rounded-xl shadow border space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">{productData?.channelProductVendor}</p>
                                    <h2 className="text-lg font-semibold">
                                        {productData?.title}
                                    </h2>
                                    <p className="text-gray-500 text-xs" dangerouslySetInnerHTML={{
                                        __html: productData?.description,
                                    }} />
                                </div>
                                <div className="">
                                    <div className="flex items-center gap-2 ">
                                        <span className="text-xl font-bold">₹{selectedVariant?.price ? selectedVariant?.price : productData?.price}</span>
                                        <span className="text-green-600 text-sm font-semibold">{`${productData?.commission}${productData?.commission_type === "PERCENTAGE" ? "%" : "₹"} off`}</span>
                                    </div>
                                </div>
                                {productData.category?.length > 0 && (
                                    <div className="border-t border-gray-200 pt-6">
                                        <p className="text-sm text-gray-500 mb-2">{translate("Category")}</p>
                                        <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-2">
                                            {productData.category.map((category, idx) => (
                                                <span key={idx} className="sm:text-base text-sm  font-medium text-gray-700 flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground border border-muted-foreground">
                                                    {category?.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {productData.tags?.length > 0 && (
                                    <div className="border-t border-gray-200 pt-6">
                                        <p className="text-sm text-gray-500 mb-2">{translate("Tags")}</p>
                                        <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-2">
                                            {productData.tags.map((tag, idx) => (
                                                <span key={idx} className="bg-background py-1 px-2 rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {productData?.variants?.length > 0 && <div className="border-t border-gray-200 pt-6">
                                    <h3 className="sm:text-lg text-base  font-semibold text-gray-800 mb-3">
                                        {translate("Variants")}
                                    </h3>
                                    <div className="flex gap-3 sm:text-sm text-xs text-gray-700">
                                        {productData?.variants?.length > 0 && productData?.variants?.map((variant: any, index) => (
                                            <span
                                                key={index}
                                                className={`${selectedVariant?.title === variant?.title ? "bg-gray-darken text-white" : "border bg-white text-black"} py-1 px-3 rounded-full flex items-center gap-2 cursor-pointer hover:bg-gray-darken/80 transition-colors`}
                                                onClick={() => setSelectedVariant({ title: variant?.title, price: variant?.price })}
                                            >
                                                {variant?.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>}

                                <div className="flex gap-4 mt-2">
                                    <button
                                                  className="flex items-center w-full justify-center gap-1 mt-2 px-4 py-3 text-center text-sm font-medium text-black border border-black rounded-lg hover:bg-black hover:text-white transition"
                                                  onClick={() => {
                                                    
                                                  }}
                                                >
                                                  <Heart size={15} />  Add to Wishlist </button>
                                                  <button
                                                  className="flex items-center w-full justify-center gap-1 mt-2 px-4 py-3 text-center text-sm font-medium text-black border border-black rounded-lg hover:bg-black hover:text-white transition"
                                                  onClick={() => {
                                                    
                                                  }}
                                                >
                                                  <ShoppingCart size={15} />  Shop Now </button>
                                </div>
                                <div className=" border-t text-sm pt-4 text-gray-800">
                                    <h3 className="sm:text-lg text-base  font-semibold text-gray-800 mb-3">
                                        {translate("Product_Details")}
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            ["Brand", productData?.channelProductVendor ?? "-"],
                                            ["Product Type", productData?.productType ?? "-"],
                                            ["Model Name", selectedVariant?.title ?? "-"],
                                            ["Category", <div className="flex space-x-2">{productData.category?.length > 0 ? productData.category.map((category, idx) => (
                                                <span key={idx} className="text-sm  font-medium text-gray-700 flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground border border-muted-foreground">
                                                    {category?.name}
                                                </span>
                                            )) : "-"}</div>],
                                            ["Tags", <div className="flex space-x-2">{productData.tags?.length > 0 ? productData.tags.map((tag, idx) => (
                                                <span key={idx} className="bg-background py-1 px-2 rounded">
                                                    #{tag}
                                                </span>
                                            )) : "-"}</div>],

                                        ].map(([label, value], index) => (
                                            <div key={index} className="flex items-center">
                                                <span className="w-48 text-gray-500 capitalize">{label}:</span>
                                                <span className="text-black">{value}</span>
                                            </div>
                                        ))
                                        }

                                    </div>
                                </div>
                                <div className=" border-t text-sm pt-4 text-gray-800">
                                    <h3 className="sm:text-lg text-base  font-semibold text-gray-800 mb-3">
                                        {translate("Information")}
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            ["Description", <p dangerouslySetInnerHTML={{
                                                __html: productData?.description ? productData?.description : "<p>-</p>",
                                            }} />]
                                        ].map(([label, value], index) => (
                                            <div key={index} className="flex items-center">
                                                <span className="w-48 text-gray-500 capitalize">{label}:</span>
                                                <span className="text-black">{value}</span>
                                            </div>
                                        ))
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
