"use client";
import { Brand } from "../list";
import { ImageOff, Star } from "lucide-react";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/app/_components/components-common/data-table";
import { useTranslations } from "next-intl";

interface BrandListProps {
  brand: Brand[];
}
export default function BrandListView({ brand }: BrandListProps) {
  const translate = useTranslations();
  const router = useRouter();
  const brandColumns: ColumnDef<Brand>[] = [
    {
      accessorKey: "name",
      header: () => translate("Brand_Name"),
      cell: ({ row }) => {
        const creator = row.original;
        return (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push(`/creator/brandsList/${creator.id}`)}
          >
            {creator?.logo ? (
              <img
                src={creator.logo}
                alt={creator.name}
                className="w-8 h-8 object-cover object-center rounded-full overflow-hidden"
              />
            ) : (
              <ImageOff className="w-8 h-8 text-gray-400" />
            )}
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={creator.name}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => translate("Category"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.category}
        />
      ),
    },
    {
      accessorKey: "totalProducts",
      header: () => translate("Total_Product"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={`${row.original.totalProducts}`}
        />
      ),
    },
    {
      accessorKey: "totalSale",
      header: () => translate("Total_Sale"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={`${row.original.totalSale}`}
        />
      ),
    },
    {
      id: "brandRating",
      header: () => translate("Brand_Rating"),
      cell: ({ row }) => {
        const creator = row.original;
        return (
          <div className="flex items-center gap-1 text-font-grey whitespace-nowrap">
            <Star className="w-4 h-4 fill-current text-dark-orange" />
            <span>{creator.rating}</span>
            <span>
              ({creator.reviews} {translate("reviews")})
            </span>
          </div>
        );
      },
    },
  ];
  return <DataTable columns={brandColumns} data={brand} />;
}
