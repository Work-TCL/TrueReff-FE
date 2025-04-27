"use client";
import React, { ReactElement } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { translate } from "@/lib/utils/translate";
import { useRouter } from "next/navigation";
import { ImageOff } from "lucide-react";
import { IProduct } from "./list";
import Button from "../../ui/button";
import DataTable from "../../components-common/data-table";
import { ColumnDef } from "@tanstack/react-table";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
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
  type?: "table" | "card";
  CardComponent?: (item: any) => ReactElement;
}

export default function BrandProductTable({
  data,
  type = "table",
  CardComponent,
}: IProductTableProps) {
  const router = useRouter();
  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "media",
      header: () => translate("Product_Name"),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2 cursor-pointer">
            {product.media?.[0] ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={product.media[0]} alt={product.title} />
              </Avatar>
            ) : (
              <ImageOff className="w-6 h-6 text-gray-400" />
            )}
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={product?.title}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "categories",
      header: "Category",
    },
    {
      accessorKey: "tag",
      header: "Tags",
    },
    {
      id: "action", // Use `id` for non-accessor columns
      header: "Action",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Button
            className="whitespace-nowrap w-[150px] bg-red-500 text-white rounded-md transition-all hover:bg-red-200 py-3 px-[10px] text-sm"
            onClick={() => router.push(`/creator/my-store/${product._id}`)}
          >
            {translate("Collaborate_Now")}
          </Button>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={columns}
      data={data}
      type={type}
      CardComponent={(item) => (CardComponent ? CardComponent(item) : <></>)}
      gridClasses="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
    />
  );
}
