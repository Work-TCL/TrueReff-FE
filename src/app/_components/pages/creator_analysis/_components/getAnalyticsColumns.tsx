import { ColumnDef } from "@tanstack/react-table";
import {
  FILTER_KEYS,
  IAnalyticsData,
  IAnalyticsProduct,
  IFilterAnalytics,
  IFilterKey,
} from "./types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import { formatNumber } from "@/lib/utils/constants";

export function getAnalyticsColumns(
  t: any,
  mode: "vendor" | "creator",
  onRowClick?: (value?: IFilterAnalytics, product?: IAnalyticsProduct) => void,
  hideColumn?: IFilterKey,
  hideProduct?: boolean
): ColumnDef<IAnalyticsData>[] {
  const columns: ColumnDef<IAnalyticsData>[] = [];
  console.log("onRowClick", onRowClick);

  if (mode === "vendor" && hideColumn !== FILTER_KEYS.CREATOR) {
    columns.push({
      id: "creator",
      header: "Creator",
      cell: ({ row }) => {
        const creator = row.original;
        return (
          creator && (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                onRowClick &&
                  creator &&
                  onRowClick({
                    key: FILTER_KEYS.CREATOR,
                    value: creator,
                  });
              }}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={
                    creator?.creatorImage || "/assets/profile/profile-image.png"
                  }
                  className="object-cover"
                />
              </Avatar>
              <TruncateWithToolTip text={creator.creatorName} />
            </div>
          )
        );
      },
    });
  }

  if (mode === "creator" && hideColumn !== FILTER_KEYS.VENDOR) {
    columns.push({
      id: "brand",
      header: "Brand",
      cell: ({ row }) => {
        const brand = row.original;
        return (
          brand && (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                onRowClick &&
                  brand &&
                  onRowClick({
                    key: FILTER_KEYS.VENDOR,
                    value: brand,
                  });
              }}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={
                    brand?.vendorImage || "/assets/profile/profile-image.png"
                  }
                  className="object-cover"
                />
              </Avatar>
              <TruncateWithToolTip text={brand.vendorName} />
            </div>
          )
        );
      },
    });
  }
  if (!hideProduct) {
    // Only show product column if vendor hasn't clicked a product row
    columns.push({
      id: "product",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div
            className={`flex items-center gap-2 cursor-pointer`}
            onClick={() => {
              onRowClick &&
                onRowClick(undefined, {
                  productId: product.productId,
                  productImage: product.productImage,
                  productName: product.productName,
                });
            }}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={product.productImage || "/assets/product/image-square.svg"}
                className="object-cover"
              />
            </Avatar>
            <TruncateWithToolTip text={product.productName} />
          </div>
        );
      },
    });
  }

  // Shared Columns
  columns.push(
    {
      id: "orders",
      header: () => <div className="text-center">{t("Orders")}</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {formatNumber(row.original.totalOrders)}
        </div>
      ),
    },
    {
      id: "revenue",
      header: () => <div className="text-center">{t("Revenue")}</div>,
      cell: ({ row }) => (
        <div className="text-center">
          ₹{formatNumber(row.original.totalRevenue)}
        </div>
      ),
    },
    {
      id: "visitors",
      header: () => <div className="text-center">{t("Visitors")}</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {formatNumber(row.original.totalViews)}
        </div>
      ),
    },
    {
      id: "commission",
      header: () => <div className="text-center">{t("Commission")}</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {formatNumber(row.original.totalCommissionPaid)}
        </div>
      ),
    }
    // {
    //   id: "sales_graph",
    //   header: "Sales Graph",
    //   cell: ({ row }) => (
    //     <ResponsiveContainer width={100} height={40}>
    //       <LineChart data={[].map((y, x) => ({ x, y }))}>
    //         <Line type="monotone" dataKey="y" stroke="#4F46E5" dot={false} />
    //       </LineChart>
    //     </ResponsiveContainer>
    //   ),
    // }
  );

  return columns;
}
