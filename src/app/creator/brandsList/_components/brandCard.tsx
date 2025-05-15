"use client";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import { Card, CardContent } from "@/components/ui/card";
import { ImageOff, Star, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const translate = useTranslations();
  const router = useRouter();
  const handleBrand = (brandId: string) => {
    router.push(`/creator/brandsList/${brandId}`);
  };

  return (
    <Card
      className="cursor-pointer w-full h-full  border border-stroke rounded-xl shadow-md p-2 flex flex-col items-center text-center gap-3 hover:shadow-lg"
      onClick={() => handleBrand(id)}
    >
      <CardContent className="w-full p-0 flex flex-col items-center gap-3">
        <div className="bg-background rounded-lg max-w-full aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
          {logo ? (
            <img src={logo} alt={name} className="object-cover object-center" />
          ) : (
            <ImageOff className="w-8 h-8 text-gray-400" />
          )}
        </div>

        <div className="flex flex-col w-full gap-1">
          <div className="flex flex-1 item-center w-full text-start gap-[4px]">
            <TruncateWithToolTip
              checkHorizontalOverflow={true}
              className="line-clamp-none truncate text-xs sm:text-sm font-medium text-gray-black"
              text={name}
            />
            <p className="text-font-grey text-xs sm:text-sm">
              {`(${translate("Fashion")})`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-1 item-center justify-between w-full text-start gap-[4px]">
            <p className="text-primary-color text-xs font-normal">
              {translate("Total_Sale")}
            </p>
            <div className="flex gap-1 items-center">
              <span className="text-primary-color text-xs font-normal">
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

        <div className="md:flex justify-between w-full text-xs sm:text-sm hidden">
          <div className="flex flex-1 flex-col items-center w-full">
            <p className="text-xs font-normal text-gray-black">
              {totalProducts}
            </p>
            <p className="text-gray-color text-xs font-normal whitespace-nowrap">
              {translate("Total_Products")}
            </p>
          </div>
          <div className="h-full w-px bg-stroke mx-2"></div>
          <div className="flex flex-1 flex-col items-center w-full">
            <div className="flex items-center w-full gap-1 justify-center">
              <Star className="w-4 h-4 fill-current text-dark-orange" />
              <p className="text-xs font-normal">{rating}</p>
              <p className="text-xs">({reviews})</p>
            </div>
            <p className="text-gray-color font-normal text-xs">
              {translate("Rating")}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between items-start gap-2 w-full text-[10px] sm:text-sm md:hidden">
          <p className="text-gray-color text-[10px] font-normal whitespace-nowrap">
            {`${translate("Total_Products")} : ${totalProducts}`}
          </p>
          <div className="flex items-start w-full gap-1 text-[10px]">
            {`${translate("Rating")} : ${totalProducts}`}
            <Star className="w-3 h-3 fill-current text-dark-orange" />
            <p className="text-[10px] font-normal">{rating}</p>
            <p className="text-[10px]">({reviews})</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
