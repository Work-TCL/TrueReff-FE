"use client";

import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { translate } from "@/lib/utils/translate";
import { CustomTableHead } from "../../components-common/tables/CustomTableHead";
import { CustomTableCell } from "../../components-common/tables/CustomTableCell";

// Sample Data
const products = [
  {
    brand: "Jane Doe",
    product: "Luxury Watch X",
    status: "Active",
    bid: "$500",
  },
  { brand: "Rolex", product: "Submariner", status: "Pending", bid: "$1500" },
  { brand: "Apple", product: "Apple Watch", status: "Active", bid: "$700" },
  { brand: "Omega", product: "Seamaster", status: "Completed", bid: "$1200" },
];
export default function CollaborationAchievements() {
  return (
    <div className="p-4 bg-white shadow-sm rounded-[20px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-text font-semibold">
          {translate("Collaborations_Achievements")}
        </h2>
        <Button variant="link" className="text-primary">
          {translate("View_all")}
        </Button>
      </div>
      <div className="overflow-auto">
        <Table className="min-w-full border border-gray-200 rounded-2xl">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Product_Name")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Brand")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Proposed_Bid")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-text text-left text-sm">
                {translate("Status")}
              </CustomTableHead>
              <CustomTableHead className="p-3 text-center font-medium">
                {translate("Action")}
              </CustomTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((activity, index) => (
              <TableRow key={index} className="even:bg-gray-50">
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  {activity.product}
                </CustomTableCell>
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  {activity.brand}
                </CustomTableCell>
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  {activity.bid}
                </CustomTableCell>
                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">
                  {activity.status}
                </CustomTableCell>
                <td className="p-3 flex justify-center gap-3">
                  <CheckCircle
                    className="text-green-500 cursor-pointer"
                    size={20}
                  />
                  <XCircle className="text-red-500 cursor-pointer" size={20} />
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
