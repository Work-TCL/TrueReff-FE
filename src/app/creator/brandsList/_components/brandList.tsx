"use client";

import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { Brand } from "../list";
import { Star } from "lucide-react";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";

interface BrandListProps {
  brand: Brand[];
}
export default function BrandListView({ brand }: BrandListProps) {
  return (
    <div className="overflow-auto">
      <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
        <TableHeader className="bg-stroke">
          <TableRow>
            <CustomTableHead className="w-[10%]">
              {translate("Product_Image")}
            </CustomTableHead>
            <CustomTableHead className="w-[20%]">
              {translate("Products_Name")}
            </CustomTableHead>
            <CustomTableHead className="w-[15%]">
              {translate("Brand_Name")}
            </CustomTableHead>
            <CustomTableHead className="w-[15%]">
              {translate("Category")}
            </CustomTableHead>
            <CustomTableHead className="w-[15%]">
              {translate("SubCategory")}
            </CustomTableHead>
            <CustomTableHead className="w-[15%]">
              {translate("Total_Sale")}
            </CustomTableHead>
            <CustomTableHead className="w-[10%] text-center">
              {translate("Brand_Rating")}
            </CustomTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brand.map((creator, index) => (
            <TableRow key={index} className="even:bg-gray-100 odd:bg-white">
              <CustomTableCell>
                <div className="flex items-center justify-center ">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="32"
                      height="32"
                      rx="4"
                      fill={index % 2 === 0 ? "#F2F4F5" : "#FFFFFF"}
                    />
                    <defs>
                      <pattern
                        id="pattern0_1206_3031"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use transform="scale(0.000520833)" />
                      </pattern>
                      <image
                        id="image0_1206_3031"
                        width="1920"
                        height="1920"
                        preserveAspectRatio="none"
                      />
                    </defs>
                  </svg>
                </div>
              </CustomTableCell>
              <CustomTableCell className="font-normal text-gray-black whitespace-nowrap">
                <TruncateWithToolTip
                  checkHorizontalOverflow={false}
                  linesToClamp={2}
                  text={creator.name}
                />
              </CustomTableCell>
              <CustomTableCell className="text-font-grey whitespace-nowrap">
                <TruncateWithToolTip
                  checkHorizontalOverflow={false}
                  linesToClamp={2}
                  text={creator.name}
                />
              </CustomTableCell>
              <CustomTableCell className="text-font-grey whitespace-nowrap">
                <TruncateWithToolTip
                  checkHorizontalOverflow={false}
                  linesToClamp={2}
                  text={creator.category}
                />
              </CustomTableCell>
              <CustomTableCell className="text-font-grey whitespace-nowrap">
                <TruncateWithToolTip
                  checkHorizontalOverflow={false}
                  linesToClamp={2}
                  text={creator.category}
                />
              </CustomTableCell>
              <CustomTableCell className="text-font-grey whitespace-nowrap">
                <TruncateWithToolTip
                  checkHorizontalOverflow={false}
                  linesToClamp={2}
                  text={"15,000 items available"}
                />
              </CustomTableCell>
              <CustomTableCell className="flex items-center text-font-grey whitespace-nowrap gap-1 text-center">
                <Star className="w-4 h-4 fill-current text-dark-orange" />
                <span>{creator.rating}</span>
                <span>
                  ({creator.reviews} {translate("reviews")})
                </span>
              </CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
