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
import { getErrorMessage } from "@/lib/utils/commonUtils";
import axios from "@/lib/web-api/axios";
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

interface ICreator {
  _id: string;
  user_name: string;
  profile_image: string;
}

interface IVendor {
  _id: string;
  business_name: string;
}

export interface ICollaboration {
  _id: string;
  creatorId: ICreator;
  productId: string;
  vendorId: IVendor;
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
export default function BargainingView() {
  const translate = useTranslations();
  const { account } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const collaborationId = params?.collaborationId;

  const [loading, setLoading] = useState<boolean>(false);
  const [collaborationData, setCollaborationData] = useState<ICollaboration>({
    _id: "",
    creatorId: {
      _id: "",
      user_name: "",
      profile_image: "",
    },
    productId: "",
    vendorId: {
      _id: "",
      business_name: "",
    },
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
  return (
    <div className="flex flex-col w-full p-6 gap-6 md:h-full">
      {loading && <Loader />}
      {/* Breadcrumb and Button */}
      <div className="flex md:flex-row flex-col items-start justify-between md:items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList className="md:text-sm text-xs">
            <BreadcrumbItem>
              <BreadcrumbPage
                className="cursor-pointer hover:text-[grey]"
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
      <div className="flex md:flex-row flex-col-reverse h-full gap-4 overflow-hidden">
        <Card className="bg-white rounded-lg md:w-[40%] w-full overflow-hidden">
          <CardContent className="overflow-hidden h-full">
            <BargainingDetailView collaborationData={collaborationData} />
          </CardContent>
        </Card>
        <ChatComponent collaborationData={collaborationData} />
      </div>
    </div>
  );
}
