"use client";
import { Card, CardContent } from "@/components/ui/card";
import BargainingDetailView from "./detail";
import ChatComponent from "./chatComponent";
import { ICollaboration, IProduct } from "../viewProduct/viewDetailProduct";
import UTMForm from "./utmForm";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

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
  const md = useMediaQuery("(min-width: 720px)");
  return (
    <div className="flex md:flex-row flex-col h-full gap-4">
      {!md && (
        <>
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
        </>
      )}
      <Card className="bg-white rounded-lg overflow-auto md:w-[40%] w-full">
        <CardContent>
          <BargainingDetailView
            productData={productData}
            openUtmForm={openUtmForm}
            isVendor={isVendor}
          />
        </CardContent>
      </Card>
      {md && (
        <>
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
        </>
      )}
    </div>
  );
}
