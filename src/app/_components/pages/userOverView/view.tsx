"use client";
import React from "react";
import { translate } from "@/lib/utils/translate";
import ProfileCompletionCard from "../../components-common/charts/profileComplete";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import MyProducts from "./myPoducts";
import { BrandCreatorCard, CradComponent } from "./cardComponent";
import { Package, ShoppingBag, Users } from "lucide-react";
import { ProductDetailUser } from "./productDetail";

export default function UserOverView() {
  const lg = useMediaQuery("(min-width: 1024px)");
  const productDetail = {
    productImage: "",
    productName: "Canvas Backpack",
    brandName: "Puma",
    categories: "Fashion",
    sku: "SPR005",
  };

  return (
    <div className="flex flex-col gap-4 md:p-6 p-4 w-full">
      <div className="flex flex-col lg:flex-row w-full md:gap-6 gap-4">
        <div className="flex flex-col md:gap-6 gap-4 w-full lg:max-w-[60%]">
          {!lg && <ProfileCompletionCard progress={80} />}
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 rounded-[20px] w-full bg-white p-4">
            <CradComponent
              title={translate("My_Products")}
              value={`$${120}`}
              bgColor="bg-[#FFEDF2]"
              titleClassName="text-secondary"
              borderColor={"border-[#FF4979]"}
              icon={<Package className="text-Secondary font-normal size-5 " />}
            />
            <CradComponent
              title={translate("My Creators")}
              value={200}
              borderColor=""
              bgColor="bg-white"
              icon={<Users className="text-primary font-normal size-5" />}
            />
            <CradComponent
              title={translate("My Purchased")}
              value={200}
              borderColor=""
              bgColor="bg-white"
              icon={
                <ShoppingBag className="text-primary font-normal size-5 " />
              }
            />
          </div>
          <MyProducts />
        </div>
        <div className="flex flex-col md:gap-6 gap-4">
          <div className="flex md:flex-row flex-col gap-4">
            <BrandCreatorCard
              question={translate("Do you have an e-commerce site to sell?")}
              btnText={translate("Become a Brand")}
            />
            <BrandCreatorCard
              question={translate("Do you have a 2000+ followers?")}
              btnText={translate("Become a Creator")}
              isCreator={true}
            />
          </div>
          {lg && <ProfileCompletionCard progress={80} />}
          <ProductDetailUser
            title={translate("Product Details")}
            productDetail={productDetail}
          />
        </div>
      </div>
    </div>
  );
}
