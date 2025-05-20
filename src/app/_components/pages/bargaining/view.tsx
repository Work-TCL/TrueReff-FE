"use client";
import { Card, CardContent } from "@/components/ui/card";
import BargainingDetailView from "./detail";
import ChatComponent from "./chatComponent";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-user";
import Loader from "@/app/_components/components-common/layout/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslations } from "use-intl";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import axios from "@/lib/web-api/axios";
import Bid from "./bid";
import { ICategory } from "@/lib/types-api/category";
import { formatDate } from "@/lib/utils/constants";
import CollaborationConfirmed from "../../components-common/dialogs/accept-offer";
import { Copy } from "lucide-react";
import { toastMessage } from "@/lib/utils/toast-message";
import Link from "next/link";
export interface NegotiationStatus {
  agreedByVendor: boolean;
  agreedByCreator: boolean;
}

export interface Creator {
  _id: string;
  user_name: string;
  profile_image: string;
  store_name: string;
}

export interface Vendor {
  _id: string;
  business_name: string;
  profile_image: string;
}

export interface Product {
  freeProduct: boolean;
  _id: string;
  title: string;
  channelProductId: string;
  vendorId: string;
  sku: string;
  description: string;
  media: string[];
  price: number;
  channelName: string;
  category: string[];
  subCategory: string[];
  tags: string[];
  lifeTime: boolean;
  startDate: string;
  endDate: string | null;
  status: string;
  commission: number;
  commission_type: string;
  referenceLinks: string[];
  creatorMaterial: string[];
  videoType: string[];
  channels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationBid {
  _id: string;
  proposal: number;
  type: string;
  sender: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICollaboration {
  negotiation: NegotiationStatus;
  _id: string;
  creatorId: Creator;
  productId: Product;
  vendorId: Vendor;
  requestedBy: string; //"creator" | "vendor";
  collaborationStatus: string; //"PENDING" | "ACCEPTED" | "REJECTED" |
  utmLink: string | null;
  crmLink: string | null;
  commissionValue: number;
  commissionType: string; //"PERCENTAGE" | "FIXED_AMOUNT";
  startAt: string | null;
  expiresAt: string;
  bids: CollaborationBid[];
  createdAt: string;
  updatedAt: string;
}

export default function BargainingView() {
  const translate = useTranslations();
  const { account } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const collaborationId = params?.collaborationId;

  const [loading, setLoading] = useState<boolean>(true);
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [collaborationData, setCollaborationData] = useState<ICollaboration>({
    "negotiation": {
      "agreedByVendor": false,
      "agreedByCreator": false
    },
    "_id": "",
    "creatorId": {
      "_id": "",
      "user_name": "",
      "profile_image": "",
      "store_name": "",
    },
    "productId": {
      "freeProduct": false,
      "_id": "",
      "title": "",
      "channelProductId": "",
      "vendorId": "",
      "sku": "",
      "description": "",
      "media": [],
      "price": 0,
      "channelName": "shopify",
      "category": [],
      "subCategory": [],
      "tags": [],
      "lifeTime": true,
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
    },
    "vendorId": {
      "_id": "",
      "business_name": "",
      "profile_image": ""
    },
    "requestedBy": "",
    "collaborationStatus": "",
    "utmLink": null,
    "crmLink": null,
    "commissionValue": 0,
    "commissionType": "",
    "startAt": null,
    "expiresAt": "",
    "bids": [],
    "createdAt": "",
    "updatedAt": ""
  });

  const fetchProductCollaboration = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/product/collaboration/${collaborationId}`
      );
      const collaboration: any = response?.data?.data?.collaboration;
      setCollaborationData(collaboration);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetchProductCollaboration();
  }, []);
  const getCommissionType = () => {
    const bid = collaborationData?.bids[collaborationData?.bids?.length - 1];
    if (bid?.type === "PERCENTAGE") {
      return `Percentage - ${bid?.proposal} %`;
    } else if (bid?.type === "FIXED_AMOUNT") {
      return `Fixed - ₹ ${bid?.proposal}`;
    }
    return "-";
  };
  const handleCopyLink = async (textToCopy: string | null) => {
      try {
        await navigator.clipboard.writeText(textToCopy ?? "");
        toastMessage.success("Text copied to clipboard!");
      } catch (err) {
        toastMessage.error("Failed to copy!");
      }
    };
  return (
    <div className="flex flex-col w-full p-4 gap-4 md:h-full">
      {loading && <Loader />}
      {/* Breadcrumb and Button */}
      <div className="flex flex-col md:flex-row items-start justify-between md:items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList className="md:text-sm text-xs">
            <BreadcrumbItem>
              <BreadcrumbPage
                className="cursor-pointer hover:text-[grey] hover:underline"
                onClick={() =>
                  router.push(
                    account?.role === "creator"
                      ? `/${account?.role}/collaboration`
                      : `/${account?.role}/creators/collaboration`
                  )
                }
              >
                {translate("Collaboration")}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="md:size-6 size-4" />
            <BreadcrumbItem>
              <BreadcrumbPage className={`cursor-pointer`}>
                {translate("Bargaining")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 flex-col-reverse lg:grid-cols-3 pb-4 gap-4 h-full">
        {/* Left Section (Scrollable on large screens) */}
        <div className="lg:col-span-2 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col gap-3">
                <div className="font-semibold">{translate("Product_Details")}</div>
                <div className="flex gap-2 overflow-x-auto">
                  {collaborationData?.productId?.media?.length > 0 ? (
                    collaborationData?.productId?.media?.map((ele: string) => (
                      <div className="bg-gray-100 rounded-lg p-1">
                        <img
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                          src={ele}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-1">
                      <img
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                        src="/assets/product/image-square.svg"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    [translate("Product_Name"), collaborationData?.productId?.title || "-"],
                    [
                      translate("Product_Category"),
                      collaborationData?.productId?.category?.length > 0
                        ? collaborationData?.productId?.category
                          ?.map((ele: any) => ele?.name)
                          .join(", ")
                        : "-",
                    ],
                    [
                      translate("Sub_Category"),
                      collaborationData?.productId?.subCategory?.length > 0
                        ? collaborationData?.productId?.subCategory
                          ?.map((ele: any) => ele?.name)
                          .join(", ")
                        : "-",
                    ],
                    [translate("Base_Price"), `${collaborationData?.productId?.price} ₹` || "-"],
                    [
                      collaborationData?.productId?.commission_type === "PERCENTAGE"
                        ? translate("Discount")
                        : translate("Discount_Price"),
                      `${collaborationData?.productId?.commission} ${collaborationData?.productId?.commission_type === "PERCENTAGE"
                        ? "%"
                        : "₹"
                      }` || "-",
                    ],
                  ].map(([label, value], idx) => (
                    <div
                      key={label + idx}
                      className="flex flex-col md:flex-row items-start gap-2"
                    >
                      <div className="w-[120px] text-sm text-gray-500 text-nowrap">
                        {label}:
                      </div>
                      <div className="font-medium text-sm break-words">{value || "-"}</div>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-6 w-full px-4 py-2 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
                  onClick={() => {
                    if (account?.role === "creator") {
                      router.push(
                        `/creator/product-management/${collaborationData?.productId?._id}`
                      );
                    } else {
                      router.push(
                        `/${account?.role}/products/view/${collaborationData?.productId?._id}`
                      );
                    }
                  }}
                >
                  {translate("View_Product")}
                </button>
              </div>
            </div>

            {/* Bid Section */}
            <div className="bg-white shadow-md rounded-lg">
              {collaborationData?.collaborationStatus === "ACTIVE" ? <div className="flex flex-col gap-3 p-4">
                <h3 className="font-semibold mb-2">{translate("Updated_Fixed_Bid_Section")}</h3>
                <div
                  className={cn(
                    "flex flex-col items-start justify-between text-left md:text-left p-5 md:p-6 rounded-2xl w-full bg-custom-gradient gap-4"
                  )}
                >

                  {/* Text Section */}
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="font-semibold text-base md:text-lg text-gray-black">
                      {"This product has been added to your Creator Store"}
                    </span>
                  </div>
                  <button
                    className="mt-6 px-4 py-2 text-center text-sm font-medium text-black border border-black rounded-lg hover:bg-black hover:text-white transition"
                    onClick={() => {
                      router.push(
                        `/store/${collaborationData?.creatorId?.store_name}`
                      );
                    }}
                  >
                    {translate("View_in_Creator_Store")}
                  </button>
                </div>
                <div className="flex flex-col gap-3 border rounded-lg p-4">
                  {[
                    [translate("Commission_Type"), getCommissionType()],
                    [
                      translate("Affiliate_Link"),
                      collaborationData?.crmLink ?? "-",
                    ],
                  ].map(([label, value], idx) => (
                    <div
                      key={label + idx}
                      className="flex flex-col md:flex-row items-start gap-2"
                    >
                      <div className="w-[150px] text-sm text-gray-500 text-nowrap">
                        {label}:
                      </div>
                      <div className="flex gap-2 font-medium text-primary-color text-sm break-words">{label === translate("Affiliate_Link") ? <Link className="hover:underline" href={value} target="_blank">{value}</Link> : value || "-"}{label === translate("Affiliate_Link")&& <Copy size={20} onClick={()=> handleCopyLink(value)} className="cursor-pointer" />}</div>
                    </div>
                  ))}
                </div>
              </div>: <Bid
                collaborationData={collaborationData}
                setCollaborationData={setCollaborationData}
                offerAccepted={offerAccepted} setOfferAccepted={setOfferAccepted}
              />}
            </div>
          </div>

          {/* Campaign Details */}
          <div className="flex flex-col bg-white shadow-md rounded-lg gap-3 p-4 mt-4">
            <div className="font-semibold">{translate("Campaign_Details")}</div>
            <div className="flex flex-col gap-3">
              {[
                [
                  translate("Date_Range"),
                  collaborationData?.productId?.lifeTime
                    ? translate("(Lifetime)")
                    : `${formatDate(collaborationData?.productId?.startDate)} – ${formatDate(
                      collaborationData?.productId?.endDate
                    )}`,
                ],
                [
                  translate("Video_Format"),
                  collaborationData?.productId?.videoType?.length > 0
                    ? `• ${collaborationData?.productId?.videoType?.join(" • ")}`
                    : "-",
                ],
                // [
                //   translate("Key Elements to highlight"),
                //   "Show off the ring’s 3 carat clarity, emphasize the hypoallergenic metal, and highlight our 2-year warranty.",
                // ],
                // [
                //   "Creator Material",
                //   "• 3× Product Photos (JPG) • Brand Logo (PNG) • Reference Unboxing Video (YouTube URL)",
                // ],
                [
                  translate("Free_Product_for_Creator"),
                  collaborationData?.productId?.freeProduct ? "Yes" : "No",
                ],
                // [
                //   "Coupon Code",
                //   "Yes, On • Offer: “Get 15% off sitewide” • Coupon Code: SUMMER15",
                // ],
              ].map(([label, value], idx) => (
                <div
                  key={label + idx}
                  className="flex flex-col md:flex-row items-start gap-2"
                >
                  <div className="w-[220px] text-sm text-gray-500 text-nowrap">
                    {label}:
                  </div>
                  <div className="font-medium text-sm break-words">{value || "-"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Chat */}
        <div className="col-span-1">
          <ChatComponent collaborationData={collaborationData} />
        </div>
      </div>
      {offerAccepted && <CollaborationConfirmed collaborationData={collaborationData} getCommissionType={getCommissionType}/>}
    </div>
  );
}
