import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@sohanemon/utils";
import { Package } from "lucide-react";

export const CradComponent = ({
  title,
  value,
  borderColor,
  bgColor,
  icon,
  titleClassName,
  onClick,
}: {
  title: string;
  value: number | string;
  borderColor: string;
  bgColor: string;
  icon?: React.ReactNode;
  titleClassName?: string;
  onClick?: () => void;
}) => {
  return (
    <Card
      onClick={onClick}
      className={`w-full h-[100px] box-border border ${borderColor} ${bgColor} rounded-2xl`}
    >
      <CardContent className="p-3 flex flex-col justify -between h-full">
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <p
              className={cn(
                "text-font-grey md:text-[14px] lg:text-lg",
                titleClassName
              )}
            >
              {title}
            </p>
            {icon ? icon : <Package className="text-Secondary font-normal " />}
          </div>
          <p className="font-bold text-secondary">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const BrandCreatorCard = ({
  question,
  btnText,
  isCreator,
}: {
  question: string;
  btnText: string;
  isCreator?: boolean;
}) => {
  return (
    <Card
      className={`w-full md:h-[145px] box-border border bg-white rounded-2xl`}
    >
      <CardContent className="p-3 flex flex-col justify -between h-full">
        <div className="flex flex-col justify-between h-full gap-4">
          <div className="flex justify-center items-center">
            <p
              className={cn(
                "text-secondary md:text-[14px] lg:text-base  box-border border border-secondary rounded-[12px] py-[11px] px-[40px]",
                isCreator && "bg-secondary text-white"
              )}
            >
              {btnText}
            </p>
          </div>
          <div className="w-full flex justify-center items-center">
            <p className="text-font-grey text-sm w-[73%] text-center">
              {question}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
