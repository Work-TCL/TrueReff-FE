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
import { Star } from "lucide-react";

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
        requestId: {
            _id: "",
            creatorId: "",
            productId: "",
            vendorId: "",
            collaborationStatus: "",
            requestFrom: "",
            createdAt: "",
            updatedAt: "",
        },
    });
    const [productData, setProductData] = useState<IProduct>({
        "_id": "",
        "title": "",
        "channelProductId": "",
        "sku": "",
        "description": "",
        "media": [],
        "price": 0,
        "channelName": "shopify",
        "category": [],
        "subCategory": [],
        "tags": [],
        "lifeTime": false,
        "startDate": "",
        "endDate": null,
        "status": "",
        "commission": 0,
        "commission_type": "",
        "referenceLinks": [],
        "creatorMaterial": [],
        "videoType": [],
        "channels": [],
        "createdAt": "",
        "updatedAt": ""
    }
    );
    const [selectedImage, setSelectedImage] = useState(0);

    const fetchProductById = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                pathName.includes("/creators/")
                    ? `/auth/creator-store/product/${productId}`
                    : `/product/${productId}`
            );

            const product: any = pathName.includes("/creators/")
                ? response?.data?.data
                : response?.data?.data?.data;
                console.log("product", product);
            if (product) {
                setProductData(product);
            } else {
                throw "Data not found";
            }
        } catch (error: any) {
            toast.error(error?.message || "Product Fetch Failed.");
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
        return <NotFound />;
    }

    return (
        <>
            {loading ? (
                <Loading className="h-screen" />
            ) : (
                <div className="flex flex-col  w-full p-3 md:p-6 gap-4 h-[100vh]">
                    {/* Breadcrumb and Button */}
                    <div className="flex md:flex-row items-center justify-between md:items-center gap-2">
                        <CommonBreadcrumb
                            items={[
                                {
                                    label: translate("Product_List"),
                                    href: "go_back"
                                },
                                {
                                    label: translate("View_Product"), // No href => current page
                                },
                            ]}
                        />
                    </div>

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
                                    {/* <p className="text-gray-500 text-xs">Puma</p> */}
                                    <h2 className="text-lg font-semibold">
                                        {productData?.title}
                                    </h2>
                                    <p className="text-gray-500 text-xs">
                                        {productData?.description}
                                    </p>
                                </div>

                                {/* <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                                        <Star size={14} fill="currentColor" />
                                        <span>4.5</span>
                                    </div>
                                    <span className="text-gray-500 text-xs">(2.1k ratings)</span>
                                </div> */}

                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold">₹{productData?.price}</span>
                                        <span className="text-green-600 text-sm font-semibold">{`${productData?.commission}${productData?.commission_type === "PERCENTAGE" ? "%" : "₹"} off`}</span>
                                    </div>
                                    {/* <div className="text-xs text-gray-400 line-through">MRP $599 Inclusive of all taxes</div> */}
                                </div>

                                {/* <div>
                                    <p className="font-medium mb-1">Color: <span className="capitalize">{"red"}</span></p>
                                    <div className="flex items-center gap-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color.value}
                                                className={`w-6 h-6 rounded-full border-2 ${color.bg} ${selectedColor === color.value ? 'ring-2 ring-black' : ''
                                                    }`}
                                                onClick={() => setSelectedColor(color.value)}
                                            />
                                        ))}
                                    </div>
                                </div> */}

                                {/* <div className="flex items-center justify-between">
                                    <p className="font-medium">Size: <span>{"50"}</span></p>
                                    <button className="text-xs text-pink-500 font-semibold underline">
                                        Size Guide
                                    </button>
                                </div> */}

                                <div className="flex gap-2">
                                    {/* {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-9 h-9 flex items-center justify-center rounded border text-sm font-medium ${selectedSize === size ? 'bg-black text-white' : 'bg-white border-gray-300'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))} */}
                                </div>

                                <div className="flex gap-4 mt-2">
                                    <button className="w-1/2 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-black hover:text-white">
                                        Add to Wishlist
                                    </button>
                                    <button className="w-1/2 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-black hover:text-white">
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
