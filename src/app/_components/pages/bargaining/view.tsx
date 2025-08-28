"use client";
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
import { formatDate, formatFloatValue } from "@/lib/utils/constants";
import CollaborationConfirmed from "../../components-common/dialogs/accept-offer";
import {
  Copy,
  ExternalLinkIcon,
  IndianRupee,
  MessageSquareText,
  MessagesSquare,
} from "lucide-react";
import { toastMessage } from "@/lib/utils/toast-message";
import Link from "next/link";
import Rating from "../../components-common/dialogs/rating";
import Confirmation from "../../components-common/dialogs/confirmation-dialog";
import { set } from "lodash";
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
  discountType?: string; //"PERCENTAGE" | "FIXED_AMOUNT";
  discountValue?: number | null;
  deactivatedBy?: string | null;
}

export interface IRating {
  _id: string;
  vendorId: string;
  creatorId: string;
  from: string;
  rating: number;
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
  const [showChant, setShowChat] = useState<boolean>(false);
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [deactivate, setDeactivate] = useState<boolean>(false);
  const [collaborationData, setCollaborationData] = useState<ICollaboration>({
    negotiation: {
      agreedByVendor: false,
      agreedByCreator: false,
    },
    _id: "",
    creatorId: {
      _id: "",
      user_name: "",
      profile_image: "",
      store_name: "",
    },
    productId: {
      freeProduct: false,
      _id: "",
      title: "",
      channelProductId: "",
      vendorId: "",
      sku: "",
      description: "",
      media: [],
      price: 0,
      channelName: "shopify",
      category: [],
      subCategory: [],
      tags: [],
      lifeTime: true,
      startDate: "",
      endDate: null,
      status: "",
      commission: 0,
      commission_type: "",
      referenceLinks: [],
      creatorMaterial: [],
      videoType: [],
      channels: [],
      createdAt: "",
      updatedAt: "",
    },
    vendorId: {
      _id: "",
      business_name: "",
      profile_image: "",
    },
    requestedBy: "",
    collaborationStatus: "",
    utmLink: null,
    crmLink: null,
    commissionValue: 0,
    commissionType: "",
    startAt: null,
    expiresAt: "",
    bids: [],
    createdAt: "",
    updatedAt: "",
  });
  const initialRating = {
    _id: "",
    vendorId: "",
    creatorId: "",
    from: "",
    rating: 0,
    createdAt: "",
    updatedAt: "",
  };
  const [rating, setRating] = useState<IRating>(initialRating);

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
  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/auth/rating/${account?.role === "vendor" ? "creator" : "vendor"}/${
          account?.role === "vendor"
            ? collaborationData?.creatorId?._id
            : collaborationData?.vendorId?._id
        }`
      );
      if (response?.data?.data?.length > 0) {
        setRating(response?.data?.data[0]);
      } else {
        setTimeout(() => {
          setShowRatingPopup(true); // Show popup after a delay
        }, 5000); // 5 seconds delay
        setRating(initialRating);
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setRating(initialRating);
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetchProductCollaboration();
  }, []);
  useEffect(() => {
    if (collaborationData?.collaborationStatus === "ACTIVE") {
      fetchRatings();
    }
  }, [collaborationData?._id]);
  const getCommissionType = () => {
    const bid = collaborationData?.bids[collaborationData?.bids?.length - 1];
    if (bid?.type === "PERCENTAGE") {
      return `Percentage - ${bid?.proposal} %`;
    } else if (bid?.type === "FIXED_AMOUNT") {
      return (
        <span className="flex items-center">
          Fixed - <IndianRupee size={14} /> {bid?.proposal}
        </span>
      );
    }
    return "-";
  };
  const handleCopyLink = async (textToCopy: string | null) => {
    try {
      await navigator.clipboard.writeText(textToCopy ?? "");
      toastMessage.success("Link copied to clipboard!");
    } catch (err) {
      toastMessage.error("Failed to copy!");
    }
  };
  const handleSubmitRatings = async (rating: number) => {
    try {
      const payload =
        account?.role === "vendor"
          ? {
              creatorId: collaborationData?.creatorId?._id,
            }
          : {
              vendorId: collaborationData?.vendorId?._id,
            };
      const response = await axios.post(`/auth/rating`, {
        ...payload,
        rating,
      });

      if (response?.status === 200) {
        fetchRatings();
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleDeactivateCollaboration = async () => {
    try {
      const response = await axios.put(`/product/collaboration/deactivate/${collaborationData?._id}`);
      if (response?.status === 200) {
        fetchProductCollaboration();
        setDeactivate(false);
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
      setLoading(false);
      setDeactivate(false);
    } finally {
      setLoading(false);
      setDeactivate(false);
    }
  };
  return (
    <div className="flex flex-col w-full p-2 md:p-4 gap-2 md:gap-4 md:h-full">
      {loading && <Loader />}
      {/* Breadcrumb and Button */}
      <div className="flex items-center justify-between md:items-center gap-2">
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
            <BreadcrumbSeparator arrowClassName="size-4 md:size-full" />
            <BreadcrumbItem>
              <BreadcrumbPage className={`cursor-pointer`}>
                {translate("Bargaining")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2 p-2 md:hidden lg:hidden">
          {showChant ? (
            <button
              type="button"
              className="text-xs border rounded-lg p-2 text-nowrap bg-white border-primary-color text-primary-color hover:bg-primary hover:text-white"
              onClick={() => setShowChat(!showChant)}
            >
              {translate("Go_Back")}
            </button>
          ) : (
            <button
              type="button"
              className="text-xs border rounded-lg p-2 text-nowrap bg-white border-primary-color text-primary-color hover:bg-primary hover:text-white"
              onClick={() => setShowChat(!showChant)}
            >
              {account?.role === "creator"
                ? translate("Chat_with_Vendor")
                : translate("Chat_with_Creator")}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-4 gap-2 md:gap-4 h-full">
        {/* Left Section (Scrollable on large screens) */}
        <div
          className={cn(
            "col-span-1 md:col-span-1 lg:col-span-2 lg:h-[calc(100vh-140px)] lg:overflow-y-auto flex flex-col gap-2 md:gap-4",
            showChant ? "order-1" : ""
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-2 md:gap-4">
            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="font-semibold">
                  {translate("Product_Details")}
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {collaborationData?.productId?.media?.length > 0 ? (
                    collaborationData?.productId?.media?.map((ele: string) => (
                      <div className="bg-gray-100 rounded-lg p-1" key={ele}>
                        <img
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md product-img"
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
                    [
                      translate("Product_Name"),
                      collaborationData?.productId?.title || "-",
                    ],
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
                    [
                      translate("Base_Price"),
                      <span className="flex items-center">
                        <IndianRupee size={14} />
                        {collaborationData?.productId?.price}
                      </span>,
                    ],
                    [
                      collaborationData?.productId?.commission_type ===
                      "PERCENTAGE"
                        ? translate("Discount")
                        : translate("Discount_Price"),
                      <span className="flex items-center">
                        {collaborationData?.productId?.commission}{" "}
                        {collaborationData?.productId?.commission_type ===
                        "PERCENTAGE" ? (
                          "%"
                        ) : (
                          <IndianRupee size={14} />
                        )}
                      </span>,
                    ],
                  ].map(([label, value], idx) => (
                    <div key={idx} className="flex flex-row items-start gap-3">
                      <div className="w-1/2 md:w-1/3 text-sm text-gray-500 text-nowrap">
                        {label}:
                      </div>
                      <div className="w-1/2 md:w-2/3 font-medium text-sm break-words">
                        {value || "-"}
                      </div>
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
              {(collaborationData?.collaborationStatus === "ACTIVE" || collaborationData?.collaborationStatus === "DEACTIVATED") ? (
                <div className="flex flex-col gap-2 md:gap-3 p-2 md:p-4">
                  <h3 className="font-semibold ">
                    {translate("Updated_Fixed_Bid_Section")}
                  </h3>
                  {collaborationData?.collaborationStatus === "DEACTIVATED" ? <><div
                    className={cn(
                      "flex flex-col items-start justify-between text-left md:text-left p-3 md:p-6 rounded-2xl w-full bg-custom-gradient gap-4"
                    )}
                  >
                    {/* Text Section */}
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="font-semibold text-base md:text-lg text-gray-black">
                        {`This collaboration has been deactivated by ${collaborationData?.deactivatedBy === account?.role ? "You" : collaborationData?.deactivatedBy}.`}
                      </span>
                    </div>
                    {/* <div className="flex flex-column md:flex-row gap-2">
                    <button
                      className="mt-6 px-2 md:px-4 py-2 text-center text-xs md:text-xs xl:text-sm font-medium text-black border border-black rounded-lg hover:bg-black hover:text-white transition"
                      onClick={() => {
                        router.push(
                          `/store/${collaborationData?.creatorId?.store_name}`
                        );
                      }}
                    >
                      {translate("View_in_Creator_Store")}
                    </button>
                    <button
                      className="mt-6 px-2 md:px-4 py-2 text-center text-xs md:text-xs xl:text-sm font-medium text-black border border-black rounded-lg hover:bg-black hover:text-white transition"
                      onClick={() => setDeactivate(true)}
                    >
                      {translate("Deactivate_Collaboration")} 
                    </button>
                    </div> */}
                  </div></> : <><div
                    className={cn(
                      "flex flex-col items-start justify-between text-left md:text-left p-3 md:p-6 rounded-2xl w-full bg-custom-gradient gap-4"
                    )}
                  >
                    {/* Text Section */}
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="font-semibold text-base md:text-lg text-gray-black">
                        {"This product has been added to your Creator Store"}
                      </span>
                    </div>
                    <div className="flex flex-column md:flex-row gap-2">
                    <button
                      className="mt-6 px-2 md:px-4 py-2 text-center text-xs md:text-xs xl:text-sm font-medium text-black border border-black rounded-lg hover:bg-black hover:text-white transition"
                      onClick={() => {
                        router.push(
                          `/store/${collaborationData?.creatorId?.store_name}`
                        );
                      }}
                    >
                      {translate("View_in_Creator_Store")}
                    </button>
                    <button
                      className="mt-6 px-2 md:px-4 py-2 text-center text-xs md:text-xs xl:text-sm font-medium text-black border border-black rounded-lg hover:bg-black hover:text-white transition"
                      onClick={() => setDeactivate(true)}
                    >
                      {translate("Deactivate_Collaboration")} 
                    </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:gap-3 border rounded-lg p-2 md:p-4">
                    {[
                      [translate("Commission_Type"), getCommissionType()],
                      [
                        translate("Affiliate_Link"),
                        collaborationData?.crmLink ?? "-",
                      ],
                    ].map(([label, value]: any[], idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row items-start gap-0 md:gap-2"
                      >
                        <div className="w-[150px] text-sm text-gray-500 text-nowrap">
                          {label}:
                        </div>
                        <div className="flex gap-2 font-medium text-primary-color text-sm break-words">
                          {label === translate("Affiliate_Link") ? (
                            <Link
                              className="hover:underline"
                              href={value}
                              target="_blank"
                            >
                              {value.length > 20
                                ? `${value.substring(0, 30)}...` // Truncate the URL if it's too long
                                : value}
                            </Link>
                          ) : (
                            value || "-"
                          )}
                          {label === translate("Affiliate_Link") && (
                            <Copy
                              size={20}
                              onClick={() => handleCopyLink(value)}
                              className="cursor-pointer"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {rating?.rating !== 0 && (
                      <div
                        key={rating?.from}
                        className="flex flex-col md:flex-row items-start gap-1 md:gap-2"
                      >
                        <div className="w-[150px] text-sm text-gray-500 text-nowrap">
                          {translate("Ratings")}:
                        </div>
                        <div className="flex gap-2 font-medium text-primary-color text-sm break-words">
                          <div className="flex items-center gap-1">
                            <div className="flex justify-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`cursor-pointer text-xl ${
                                    star <= rating?.rating
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span>{`${formatFloatValue(
                              rating?.rating
                            )}/${5}`}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div></>}
                </div>
              ) : (
                <Bid
                  collaborationData={collaborationData}
                  setCollaborationData={setCollaborationData}
                  offerAccepted={offerAccepted}
                  setOfferAccepted={setOfferAccepted}
                />
              )}
            </div>
          </div>

          {/* Campaign Details */}
          <div className="flex flex-col bg-white shadow-md rounded-lg gap-2 md:gap-3 p-2 md:p-4">
            <div className="font-semibold">{translate("Campaign_Details")}</div>
            <div className="flex flex-col gap-2 md:gap-3">
              {[
                [
                  translate("Date_Range"),
                  collaborationData?.productId?.lifeTime
                    ? translate("(Lifetime)")
                    : `${formatDate(
                        collaborationData?.productId?.startDate
                      )} – ${formatDate(
                        collaborationData?.productId?.endDate
                      )}`,
                ],
                [
                  translate("Video_Format"),
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {collaborationData?.productId?.videoType?.length > 0
                      ? collaborationData?.productId?.videoType.map(
                          (option) => (
                            <span
                              key={option}
                              className={cn(
                                "text-sm px-3 py-1 rounded-full border transition",
                                "bg-blue-600 text-primary border-primary"
                                // : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                // disabled && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {option}
                            </span>
                          )
                        )
                      : "-"}
                  </div>,
                ],
                // [
                //   translate("Key Elements to highlight"),
                //   "Show off the ring’s 3 carat clarity, emphasize the hypoallergenic metal, and highlight our 2-year warranty.",
                // ],
                [
                  translate("Free_Product_for_Creator"),
                  collaborationData?.productId?.freeProduct ? "Yes" : "No",
                ],
              ].map(([label, value], idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:items-center md:gap-2"
                >
                  <div className="w-[220px] text-sm text-gray-500 text-nowrap">
                    {label}:
                  </div>
                  <div className="font-medium text-sm break-words">
                    {value || "-"}
                  </div>
                </div>
              ))}
              {collaborationData?.collaborationStatus === "ACTIVE" && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <div className="w-[220px] text-sm text-gray-500 text-nowrap">
                      {"Creator material"}:
                    </div>
                    <div className="font-medium text-sm break-words">
                      <div className="flex flex-wrap gap-2">
                        {collaborationData?.productId?.creatorMaterial?.length >
                        0
                          ? collaborationData?.productId?.creatorMaterial.map(
                              (option) => (
                                <Link
                                  href={option}
                                  target="_blank"
                                  key={option}
                                  className={cn(
                                    "flex items-center cursor-pointer gap-2 hover:underline text-sm transition break-words max-w-[250px] text-primary"
                                  )}
                                >
                                  {option.length > 20
                                    ? `${option.substring(0, 20)}...` // Truncate the URL if it's too long
                                    : option}
                                  <ExternalLinkIcon
                                    size={15}
                                    className="cursor-pointer"
                                  />
                                </Link>
                              )
                            )
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <div className="w-[220px] text-sm text-gray-500 text-nowrap">
                      {"Reference Links"}:
                    </div>
                    <div className="font-medium text-sm break-words">
                      <div className="flex flex-wrap gap-3">
                        {collaborationData?.productId?.referenceLinks?.length >
                        0
                          ? collaborationData?.productId?.referenceLinks.map(
                              (option) => (
                                <Link
                                  href={option}
                                  target="_blank"
                                  key={option}
                                  className={cn(
                                    "flex items-center cursor-pointer gap-1 hover:underline text-sm transition break-words max-w-[250px] text-primary"
                                  )}
                                >
                                  {option.length > 30
                                    ? `${option.substring(0, 30)}...` // Truncate the URL if it's too long
                                    : option}
                                  <ExternalLinkIcon
                                    size={15}
                                    className="cursor-pointer"
                                  />
                                </Link>
                              )
                            )
                          : "-"}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Chat */}
        <div className="col-span-1">
          <ChatComponent collaborationData={collaborationData} />
        </div>
      </div>
      {offerAccepted && (
        <CollaborationConfirmed
          collaborationData={collaborationData}
          getCommissionType={getCommissionType}
        />
      )}
      {showRatingPopup && (
        <Rating
          onClose={() => setShowRatingPopup(false)}
          collaborationData={collaborationData}
          handleSubmitRatings={handleSubmitRatings}
        />
      )}
      {deactivate && <Confirmation title={translate("Are_you_sure_you_want_to_deactivate_collaboration")} onClose={() => setDeactivate(false)} handleConfirm={handleDeactivateCollaboration} />}
    </div>
  );
}
