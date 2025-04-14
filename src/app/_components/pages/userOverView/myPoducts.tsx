"use client";

import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Heart } from "lucide-react";
import { translate } from "@/lib/utils/translate";
import { CustomTableHead } from "../../components-common/tables/CustomTableHead";
import { CustomTableCell } from "../../components-common/tables/CustomTableCell";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// Sample Data
const activities = [
  {
    productImage: "",
    productName: "Canvas Backpack",
    brandName: "Puma",
    categories: "Fashion",
    price: "$500",
  },
  {
    productImage: "",
    productName: "Canvas Backpack",
    brandName: "Puma",
    categories: "Fashion",
    price: "$500",
  },
];

export default function MyProducts() {
  return (
    <div className="p-4 bg-white rounded-[20px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl text-base text-text font-semibold">
          {" "}
          {translate("My_Products")}
        </h2>
        <Button variant="link" className="text-primary md:h-10 h-7">
          {" "}
          {translate("View_all")}
        </Button>
      </div>
      <div className="overflow-auto">
        <Table className="min-w-full border border-gray-200 rounded-2xl">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Product_Image")}
              </CustomTableHead>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Product_Name")}
              </CustomTableHead>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Brand_Name")}
              </CustomTableHead>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Category")}
              </CustomTableHead>
              <CustomTableHead className="p-2 text-text text-left text-sm">
                {translate("Price")}
              </CustomTableHead>
              <CustomTableHead className="p-2 text-center font-medium">
                {translate("Action")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity, index) => (
              <TableRow key={index} className="even:bg-gray-50">
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={""} />
                    </Avatar>
                  </div>
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <span className="text-text "> {activity.productName}</span>
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  {activity.brandName}
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  {activity.categories}
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  {activity.price}
                </CustomTableCell>
                <CustomTableCell parentClassName="p-2 text-font-grey text-sm">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="flex justify-center items-center box-border border size-9 rounded-[6px] ">
                      <Heart className="size-4 shrink-0 fill-primary text-primary" />
                    </div>
                    <div className="flex justify-center items-center box-border border size-9 rounded-[6px] ">
                      <Eye className="size-4 shrink-0 text-secondary" />
                    </div>{" "}
                  </div>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
