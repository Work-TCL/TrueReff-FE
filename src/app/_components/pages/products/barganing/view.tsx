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
import {ICollaboration, IProduct} from "../viewProduct/viewDetailProduct";
export default function BargainingView({productData,collaborationData}:{productData: IProduct,collaborationData:ICollaboration}) {
  return (
      <div className="flex h-full gap-[40px]">
        <Card className="bg-white rounded-lg overflow-auto w-[60%]">
          <CardContent>
            <BargainingDetailView productData={productData}/>
          </CardContent>
        </Card>
        <ChatComponent productData={productData} collaborationData={collaborationData}/>
      </div>
  );
}
