"use client";
import React, { useEffect, useState } from "react";
import { Package, Users } from "lucide-react";
import ProfileCompletionCard from "@/app/_components/components-common/charts/profileComplete";
import {
  BrandCreatorCard,
  CardComponent,
} from "@/app/_components/pages/userOverView/cardComponent";
import Creators from "@/app/_components/pages/userOverView/creators";
import { useAuthStore } from "@/lib/store/auth-user";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import Brands from "@/app/_components/pages/userOverView/brands";
import { toastMessage } from "@/lib/utils/toast-message";
import { getVendorCreatorCount } from "@/lib/web-api/auth";
import Loader from "@/app/_components/components-common/layout/loader";
import { useTranslations } from "next-intl";

export default function UserOverView() {
  const { account } = useAuthStore();
  const translate = useTranslations();
  // const translate = (word: string) => word;
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

  type CardOption = "Brands" | "Creators";

  const [selectedCard, setSelectedCard] = useState<CardOption>("Brands");
  const initialData = {
    creatorCount: 0,
    vendorCount: 0,
  };
  const [count, setCountData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCreatorVendorCount();
  }, []);
  const fetchCreatorVendorCount = async () => {
    setLoading(true);
    try {
      const response = await getVendorCreatorCount();
      if (response) {
        setCountData(response);
      } else {
        setCountData(initialData);
      }
    } catch (error) {
      let errorMessage = await getErrorMessage(error);
      toastMessage.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 md:p-6 p-4 w-full">
      {loading && <Loader/>}
      <div className="flex flex-col lg:flex-row w-full md:gap-6 gap-4">
        <div className="flex flex-col md:gap-6 gap-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 rounded-[20px] w-full">
            <CardComponent
              title={translate("Brands")}
              value={count?.vendorCount}
              bgColor={
                selectedCard === "Brands" ? "bg-[#FFEDF2]" : "bg-white"
              }
              titleClassName={
                selectedCard === "Brands" ? "text-secondary" : ""
              }
              borderColor={
                selectedCard === "Brands" ? "border-[#FF4979]" : ""
              }
              icon={
                <Package
                  className={cn(
                    "font-normal size-5",
                    selectedCard === "Brands"
                      ? "text-Secondary"
                      : "text-primary"
                  )}
                />
              }
              onClick={() => setSelectedCard("Brands")}
            />
            <CardComponent
              title={translate("Creators")}
              borderColor={
                selectedCard === "Creators" ? "border-[#FF4979]" : ""
              }
              titleClassName={
                selectedCard === "Creators" ? "text-secondary" : ""
              }
              value={count?.creatorCount}
              bgColor={
                selectedCard === "Creators" ? "bg-[#FFEDF2]" : "bg-white"
              }
              icon={
                <Users
                  className={cn(
                    "font-normal size-5",
                    selectedCard === "Creators"
                      ? "text-Secondary"
                      : "text-primary"
                  )}
                />
              }
              onClick={() => setSelectedCard("Creators")}
            />
            {/* <CardComponent
              title={translate("My_Purchased")}
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
            /> */}
          </div>
          {
            {
              "Creators":<Creators title={selectedCard} />,
              "Brands":<Brands title={selectedCard} />
            }[selectedCard]
          }
        </div>
      </div>
    </div>

    // <div className="flex flex-col gap-4 md:p-6 p-4 w-full flex-1 h-[calc(100vh-3rem)]">
    //   {loading && <Loader />}
    //   {/* <div className="flex flex-col lg:flex-row w-full md:gap-6 gap-4"> */}
    //     {/* <div className="flex flex-col md:gap-6 gap-4 w-full lg:max-w-[60%]">
    // <ProfileCompletionCard progress={10} className="lg:hidden flex" />
    //       <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 rounded-[20px] w-full bg-white p-4">
    //         <CardComponent
    //           title={translate("Brands")}
    //           value={count?.vendorCount}
    //           bgColor={
    //             selectedCard === "Brands" ? "bg-[#FFEDF2]" : "bg-white"
    //           }
    //           titleClassName={
    //             selectedCard === "Brands" ? "text-secondary" : ""
    //           }
    //           borderColor={
    //             selectedCard === "Brands" ? "border-[#FF4979]" : ""
    //           }
    //           icon={
    //             <Package
    //               className={cn(
    //                 "font-normal size-5",
    //                 selectedCard === "Brands"
    //                   ? "text-Secondary"
    //                   : "text-primary"
    //               )}
    //             />
    //           }
    //           onClick={() => setSelectedCard("Brands")}
    //         />
    //         <CardComponent
    //           title={translate("Creators")}
    //           borderColor={
    //             selectedCard === "Creators" ? "border-[#FF4979]" : ""
    //           }
    //           titleClassName={
    //             selectedCard === "Creators" ? "text-secondary" : ""
    //           }
    //           value={count?.creatorCount}
    //           bgColor={
    //             selectedCard === "Creators" ? "bg-[#FFEDF2]" : "bg-white"
    //           }
    //           icon={
    //             <Users
    //               className={cn(
    //                 "font-normal size-5",
    //                 selectedCard === "Creators"
    //                   ? "text-Secondary"
    //                   : "text-primary"
    //               )}
    //             />
    //           }
    //           onClick={() => setSelectedCard("Creators")}
    //         />
    //         <CardComponent
    //           title={translate("My_Purchased")}
    //           borderColor={
    //             selectedCard === "purchased" ? "border-[#FF4979]" : ""
    //           }
    //           titleClassName={
    //             selectedCard === "purchased" ? "text-secondary" : ""
    //           }
    //           value={200}
    //           bgColor={
    //             selectedCard === "purchased" ? "bg-[#FFEDF2]" : "bg-white"
    //           }
    //           icon={
    //             <ShoppingBag
    //               className={cn(
    //                 "font-normal size-5",
    //                 selectedCard === "purchased"
    //                   ? "text-Secondary"
    //                   : "text-primary"
    //               )}
    //             />
    //           }
    //           onClick={() => setSelectedCard("purchased")}
    //         />
    //       </div>
    //       {
    //         {
    //           "Creators":<Creators title={selectedCard} />,
    //           "Brands":<Brands title={selectedCard} />
    //         }[selectedCard]
    //       }
    //     </div> */}
    //     <div className="flex md:flex-row flex-col gap-4">
    //       <BrandCreatorCard
    //         question={translate("Do_you_have_an_e_commerce_site_to_sell")}
    //         btnText={translate("Become_a_Brand")}
    //         redirectUrl="/vendor-register"
    //       />
    //       <BrandCreatorCard
    //         question={translate("Do_you_have_a_2000_followers")}
    //         btnText={translate("Become_a_Creator")}
    //         isCreator={true}
    //         redirectUrl="/creator-registration"
    //       />
    //     </div>
    //     {/* <ProfileCompletionCard progress={10} gradientId={"gradient_lg"} className="lg:flex hidden" /> */}
    //     {/* {selectedCard === "products" && (
    //         <ProductDetailUser
    //           title={translate("Product_Details")}
    //           productDetail={productDetail}
    //         />
    //       )}

    //       {selectedCard === "creators" && (
    //         <>
    //           <ProileDetailUser profileDetail={profileDetail} />
    //           <VideosTable />
    //         </>
    //       )}

    //       {selectedCard === "purchased" && (
    //         <div className="bg-white rounded-xl p-4 shadow-sm">
    //           <p className="text-primary font-semibold text-lg">
    //             {translate("Purchase Details Coming Soon!")}
    //           </p>
    //         </div>
    //       )} */}
    //   {/* </div> */}
    // </div>
  );
}
