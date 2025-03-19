"use client";

import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { CustomTableHead } from "./CustomTableHead";
import { CustomTableCell } from "./CustomTableCell";
import { translate } from "@/lib/utils/translate";

// Sample Data
const activities = [
    {
        name: "Jane Doe",
        product: "Luxury Watch X",
        categories: "Accessories, Watches",
        bid: "$500",
        timeline: "30 Days",
    },
    {
        name: "John Smith",
        product: "Designer Sunglasses Y",
        categories: "Accessories, Sunglasses",
        bid: "$300",
        timeline: "45 Days",
    },
    {
        name: "Alice Johnson",
        product: "Leather Wallet Z",
        categories: "Accessories, Wallet",
        bid: "$100",
        timeline: "60 Days",
    }
];

export default function RecentActivities() {
    return (
        <div className="p-4 bg-white shadow-sm rounded-[20px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-text font-semibold">{translate("Recent_Activities")}</h2>
                <Button variant="link" className="text-primary">{translate("View_all")}</Button>
            </div>
            <div className="overflow-auto">
                <Table className="min-w-full border border-gray-200 rounded-2xl">
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <CustomTableHead className="p-3 text-text text-left text-sm">{translate("Creator_Name")}</CustomTableHead>
                            <CustomTableHead className="p-3 text-text text-left text-sm">{translate("Product_Name")}</CustomTableHead>
                            <CustomTableHead className="p-3 text-text text-left text-sm">{translate("Categories")}</CustomTableHead>
                            <CustomTableHead className="p-3 text-text text-left text-sm">{translate("Proposed_Bid")}</CustomTableHead>
                            <CustomTableHead className="p-3 text-text text-left text-sm">{translate("Timeline")}</CustomTableHead>
                            <CustomTableHead className="p-3 text-center font-medium">{translate("Action")}</CustomTableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities.map((activity, index) => (
                            <TableRow key={index} className="even:bg-gray-50">
                                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">{activity.name}</CustomTableCell>
                                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">{activity.product}</CustomTableCell>
                                <CustomTableCell parentClassName="p-13 text-font-grey text-sm">{activity.categories}</CustomTableCell>
                                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">{activity.bid}</CustomTableCell>
                                <CustomTableCell parentClassName="p-3 text-font-grey text-sm">{activity.timeline}</CustomTableCell>
                                <td className="p-3 flex justify-center gap-3">
                                    <CheckCircle className="text-green-500 cursor-pointer" size={20} />
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
