import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@sohanemon/utils";

export const ProductDetailUser = ({
  title,
  productDetail,
}: {
  title: string;
  productDetail: any;
}) => {
  return (
    <Card className={`w-full box-border border bg-white rounded-2xl`}>
      <CardContent className="p-6 flex flex-col justify -between h-full">
        <div className="flex flex-col justify-between h-full md:gap-6 gap-4">
          <div className="flex justify-start items-center">
            <p className={cn("text-secondary text-lg font-medium")}>{title}</p>
          </div>
          <div className="w-full flex justify-between items-end">
            <div className="flex gap-2 items-center">
              <Avatar className="md:w-[80px] w-[40] md:h-[80px] h-[40px]">
                <AvatarImage src={""} />
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="text-secondary font-medium md:text-lg text-base">
                  {productDetail.productName}
                </p>
                <p className="md:text-base text-sm">{`${productDetail.brandName}(${productDetail.categories})`}</p>
                <p className="md:text-sm text-xs text-font-grey">{`SKUS:${productDetail.sku}`}</p>
              </div>
            </div>
            <div className="flex justify-center items-center rounded-2xl py-[10px] px-6 bg-[#5856D61A]">
              <span className="text-[#5856D6]">Running</span>
            </div>
          </div>
          <div className="flex gap-4 items-center md:flex-row flex-col">
            <div className="flex gap-2 items-center box-border border p-3 rounded-[12px] w-full ">
              <img
                src="/assets/creator/Instagram-icon.svg"
                width={40}
                height={40}
              />
              <div className="flex flex-col gap-1">
                <span className="text-font-grey">Instagram</span>
                <span className="text-secondary">120K Views</span>
              </div>
            </div>

            <div className="flex gap-4 items-center box-border border p-3 rounded-[12px] w-full">
              <img
                src="/assets/creator/Youtube-icon.svg"
                width={40}
                height={40}
              />
              <div className="flex flex-col gap-1">
                <span className="text-font-grey">Youtube</span>
                <span className="text-secondary">120K Views</span>
              </div>
            </div>
            <div className="flex gap-4 items-center box-border border p-3 rounded-[12px] w-full">
              <img
                src="/assets/creator/profile/fbIcon.svg"
                width={40}
                height={40}
              />
              <div className="flex flex-col gap-1">
                <span className="text-font-grey">FaceBook</span>
                <span className="text-secondary">120K Views</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
