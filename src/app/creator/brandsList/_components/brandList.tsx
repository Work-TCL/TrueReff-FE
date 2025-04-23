"use client";

import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { Brand } from "../list";
import { ImageOff, Star } from "lucide-react";
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
                  {creator?.logo ? (
                    <img
                      src={creator?.logo}
                      alt={creator?.logo}
                      className="w-8 h-8 object-cover object-center rounded-full overflow-hidden"
                    />
                  ) : (
                    <ImageOff className="w-8 h-8 text-gray-400" />
                  )}
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
