"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { useParams, useRouter } from "next/navigation";
import { Eye, Info } from "lucide-react";
import { IProduct } from "./list";
import Button from "../../ui/button";
import { Column, DynamicTable } from "../../components-common/dynamic-table";
function formatNumber(num: number = 0) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num === 0 ? "" : num.toString();
}

interface IProductTableProps {
  data: IProduct[];
}

export default function BrandProductTable({ data }: IProductTableProps) {
  const router = useRouter();
  const columns: Column<IProduct>[] = [
    {
      key: "image",
      label: "Product_Image",
      render: (product) => (
        <Avatar className="w-8 h-8">
          <AvatarImage src={product.media[0]} />
        </Avatar>
      ),
      className: "w-1/6",
    },
    { key: "title", label: "Product_Name", className: "w-1/4" },
    { key: "categories", label: "Category", className: "w-1/4" },
    { key: "tag", label: "Tags", className: "w-1/8" },
    {
      key: "action",
      label: "Action",
      className: "w-1/6",
      render: (product) => (
        <Button
          className="whitespace-nowrap w-[150px] bg-red-500 text-white rounded-md transition-all hover:bg-red-200 py-3 px-[10px] text-sm"
          onClick={() => router.push(`/creator/my-store/${product._id}`)}
        >
          {translate("Collaborate_Now")}
        </Button>
      ),
    },
  ];
  return (
    <DynamicTable
      columns={columns}
      data={[...data, ...data]}
      emptyText={{
        title: translate("No_Products_Available_Title"),
        description: translate("No_Products_Available_Description"),
      }}
    />
  );
}
