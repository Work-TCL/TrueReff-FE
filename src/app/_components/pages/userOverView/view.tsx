"use client";
import React, { useState } from "react";
import ProfileCompletionCard from "../../components-common/charts/profileComplete";
import MyProducts from "./creators";
import { CardComponent } from "./cardComponent";
import { Package, ShoppingBag, Users } from "lucide-react";
import { ProductDetailUser } from "./productDetail";
import { ProileDetailUser } from "./userProfile";
import { useTranslations } from "use-intl";
import VideosTable from "./videoTable";
import { cn } from "@sohanemon/utils";

export default function UserOverView() {
  const translate = useTranslations();
  const productDetail = {
    productImage: "",
    productName: "Canvas Backpack",
    brandName: "Puma",
    categories: "Fashion",
    sku: "SPR005",
  };
  const profileDetail = {
    productImage: "/path-to-image.jpg",
    name: "Jhon Deo",
    handle: "john_doe_90",
  };

  type CardOption = "products" | "creators" | "purchased";

  const [selectedCard, setSelectedCard] = useState<CardOption>("products");

  return (
    <div className="flex flex-col gap-4 md:p-6 p-4 w-full">
      <div className="flex flex-col lg:flex-row w-full md:gap-6 gap-4">
        <div className="flex flex-col md:gap-6 gap-4 w-full lg:max-w-[60%]">
          <ProfileCompletionCard progress={80} className="lg:hidden flex" />
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 rounded-[20px] w-full bg-white p-4">
            <CardComponent
              title={translate("My_Products")}
              value={`$${120}`}
              bgColor={
                selectedCard === "products" ? "bg-[#FFEDF2]" : "bg-white"
              }
              titleClassName={
                selectedCard === "products" ? "text-secondary" : ""
              }
              borderColor={
                selectedCard === "products" ? "border-[#FF4979]" : ""
              }
              icon={
                <Package
                  className={cn(
                    "font-normal size-5",
                    selectedCard === "products"
                      ? "text-Secondary"
                      : "text-primary"
                  )}
                />
              }
              onClick={() => setSelectedCard("products")}
            />
            <CardComponent
              title={translate("My Creators")}
              borderColor={
                selectedCard === "creators" ? "border-[#FF4979]" : ""
              }
              titleClassName={
                selectedCard === "creators" ? "text-secondary" : ""
              }
              value={200}
              bgColor={
                selectedCard === "creators" ? "bg-[#FFEDF2]" : "bg-white"
              }
              icon={
                <Users
                  className={cn(
                    "font-normal size-5",
                    selectedCard === "creators"
                      ? "text-Secondary"
                      : "text-primary"
                  )}
                />
              }
              onClick={() => setSelectedCard("creators")}
            />
            <CardComponent
              title={translate("My Purchased")}
              borderColor={
                selectedCard === "purchased" ? "border-[#FF4979]" : ""
              }
              titleClassName={
                selectedCard === "purchased" ? "text-secondary" : ""
              }
              value={200}
              bgColor={
                selectedCard === "purchased" ? "bg-[#FFEDF2]" : "bg-white"
              }
              icon={
                <ShoppingBag
                  className={cn(
                    "font-normal size-5",
                    selectedCard === "purchased"
                      ? "text-Secondary"
                      : "text-primary"
                  )}
                />
              }
              onClick={() => setSelectedCard("purchased")}
            />
          </div>
          <MyProducts title="products" />
        </div>
        <div className="flex flex-col md:gap-6 gap-4">
          {/* <div className="flex md:flex-row flex-col gap-4">
            <BrandCreatorCard
              question={translate("Do you have an e-commerce site to sell?")}
              btnText={translate("Become a Brand")}
            />
            <BrandCreatorCard
              question={translate("Do you have a 2000+ followers?")}
              btnText={translate("Become a Creator")}
              isCreator={true}
            />
          </div> */}
          <ProfileCompletionCard progress={80} className="lg:flex hidden" />
          {selectedCard === "products" && (
            <ProductDetailUser
              title={translate("Product Details")}
              productDetail={productDetail}
            />
          )}

          {selectedCard === "creators" && (
            <>
              <ProileDetailUser profileDetail={profileDetail} />
              <VideosTable />
            </>
          )}

          {selectedCard === "purchased" && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-primary font-semibold text-lg">
                {translate("Purchase Details Coming Soon!")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
