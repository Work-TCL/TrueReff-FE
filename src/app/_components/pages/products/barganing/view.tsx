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
export default function BarganingView() {
  return (
    <div className="flex flex-col w-full p-6 gap-6">
      {/* {loading && <Loader />} */}
      {/* Breadcrumb and Button */}
      <div className="flex md:flex-row flex-col items-start justify-between md:items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="cursor-pointer hover:text-[grey]">
                {translate("Product_List")}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="cursor-pointer hover:text-[grey]">
                {translate("View_Product")}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{translate("Bargaining")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Card Section */}
      <div className="flex h-full gap-[40px]">
        <Card className="bg-white rounded-lg overflow-auto w-[60%]">
          <CardContent>
            <BargainingDetailView />
          </CardContent>
        </Card>
        <ChatComponent />
      </div>
    </div>
  );
}
