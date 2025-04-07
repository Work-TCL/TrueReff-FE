"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { translate } from "@/lib/utils/translate";
import BargainingDetailView from "./detail";
import ChatComponent from "./chatComponent";
import { ICollaboration, IProduct } from "../viewProduct/viewDetailProduct";
import UTMForm from "./utmForm";
export default function BargainingView({
  productData,
  collaborationData,
  openUtmForm,
  isOpenUtmForm,
  isVendor,
}: {
  productData: IProduct;
  collaborationData: ICollaboration;
  openUtmForm: () => void;
  isOpenUtmForm: boolean;
  isVendor: boolean;
}) {
  return (
    <div className="flex h-full gap-4">
      <Card className="bg-white rounded-lg overflow-auto w-[40%]">
        <CardContent>
          <BargainingDetailView
            productData={productData}
            openUtmForm={openUtmForm}
            isVendor={isVendor}
          />
        </CardContent>
      </Card>

      {isOpenUtmForm ? (
        <Card className="bg-white rounded-lg overflow-auto w-[60%]">
          <CardContent>
            <UTMForm collaborationId={collaborationData?._id} />
          </CardContent>
        </Card>
      ) : (
        <ChatComponent
          productData={productData}
          collaborationData={collaborationData}
        />
      )}
    </div>
  );
}
