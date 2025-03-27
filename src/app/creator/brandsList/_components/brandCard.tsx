"use client";
import { Card, CardContent } from "@/components/ui/card";
import { translate } from "@/lib/utils/translate";
import { Star, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface BrandCardProps {
  id: string;
  name: string;
  category: string;
  totalSale: string;
  totalProducts: number;
  rating: number;
  reviews: string;
  logo: string;
}

export default function BrandCard({
  id,
  name,
  category,
  totalSale,
  totalProducts,
  rating,
  reviews,
  logo,
}: BrandCardProps) {
  const router = useRouter();
  const handleBrand = (brandId: string,brandName: string) => {
    router.push(`/creator/brandsList/${brandId}?brandName=${brandName}`)
  }
  return (
    <Card className="xl:w-[300px] w-full h-auto xl:max-h-[304px] border border-stroke rounded-xl shadow-md p-4 flex flex-col items-center text-center" onClick={()=>handleBrand(id,name)}>
      <CardContent className="w-full p-0 flex flex-col items-center gap-4">
        <div className="bg-background rounded-lg xl:max-w-[258px] max-w-full min-h-[96px] w-full h-full flex items-center justify-center">
          {/* <img src={logo} alt={name} className="max-h-12" /> */}
          <h2 className="text-gray-black">{name}</h2>
        </div>
        <div className="flex flex-col w-full gap-1">
          <div className="flex flex-1 item-center w-full text-start gap-[6px]">
            <p className="text-lg font-medium text-gray-black">{name}</p>
            <p className="text-font-grey">{`(${translate("Fashion")})`}</p>
          </div>
          <p className="text-secondary text-base font-normal text-start">
            {category}
          </p>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-1 item-center justify-between w-full text-start gap-[6px]">
            <p className="text-primary-color text-xs font-normal">
              {translate("Total_Sale")}
            </p>
            <div className=" flex gap-1 item-center">
              <span className="text-primary-color text-xs font-normal">
                {" "}
                {totalSale}
              </span>
              <div className="flex items-center justify-center size-4">
                <TrendingUp className="shrink-0 text-success size-[10px]" />
              </div>
            </div>
          </div>
          <div className="w-full h-1 bg-gray-300 rounded-full mt-1">
            <div
              className="h-1 bg-black rounded-full"
              style={{ width: "80%" }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between w-full text-sm">
          <div className="flex flex-1 flex-col item-center w-full">
            <p className="text-sm font-normal text-gray-black">
              {totalProducts}
            </p>
            <p className="text-gray-color font-normal">
              {translate("Total_Products")}
            </p>
          </div>
          <div className="h-full w-px bg-stroke mx-2"></div>{" "}
          <div className="flex flex-1 flex-col item-center w-full">
            <div className="flex item-center w-full gap-1 justify-center">
              <Star className="w-4 h-4 fill-current text-dark-orange" />
              <p className="text-sm font-normal"> {rating} </p>
              <p>({reviews})</p>
            </div>
            <p className="text-gray-color font-normal">{translate("Rating")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
