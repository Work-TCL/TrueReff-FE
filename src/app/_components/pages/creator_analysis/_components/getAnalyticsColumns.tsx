import { ColumnDef } from "@tanstack/react-table";
import {
  FILTER_KEYS,
  IAnalyticsData,
  IFilterAnalytics,
  IFilterKey,
} from "./types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";

export function getAnalyticsColumns(
  mode: "vendor" | "creator",
  onRowClick?: (value: IFilterAnalytics) => void,
  hideColumn?: IFilterKey
): ColumnDef<IAnalyticsData>[] {
  const columns: ColumnDef<IAnalyticsData>[] = [];
  console.log("onRowClick", onRowClick);

  if (mode === "vendor" && hideColumn !== FILTER_KEYS.CREATOR) {
    columns.push({
      id: "creator",
      header: "Creator",
      cell: ({ row }) => {
        const creator = row.original.creator;
        return (
          creator && (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                onRowClick &&
                  creator &&
                  onRowClick({
                    key: FILTER_KEYS.VENDOR,
                    value: creator._id,
                  });
              }}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={creator?.image || ""} />
              </Avatar>
              <TruncateWithToolTip text={creator.name} />
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
        const brand = row.original.brand;
        return (
          brand && (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                onRowClick &&
                  brand &&
                  onRowClick({
                    key: FILTER_KEYS.VENDOR,
                    value: brand._id,
                  });
              }}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={brand?.logo || ""} />
              </Avatar>
              <TruncateWithToolTip text={brand.name} />
            </div>
          )
        );
      },
    });
  }
  if (hideColumn !== FILTER_KEYS.PRODUCT) {
    // Only show product column if vendor hasn't clicked a product row
    columns.push({
      id: "product",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original.product;
        return (
          <div
            className={`flex items-center gap-2 cursor-pointer`}
            onClick={() => {
              onRowClick &&
                onRowClick({
                  key: FILTER_KEYS.PRODUCT,
                  value: product._id,
                });
            }}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={product.image || ""} />
            </Avatar>
            <TruncateWithToolTip text={product.title} />
          </div>
        );
      },
    });
  }

  // Shared Columns
  columns.push(
    {
      id: "orders",
      header: "Orders",
      cell: ({ row }) => <div>{row.original.orders}</div>,
    },
    {
      id: "revenue",
      header: "Revenue",
      cell: ({ row }) => <div>₹{row.original.revenue.toLocaleString()}</div>,
    },
    {
      id: "visitors",
      header: "Visitors",
      cell: ({ row }) => <div>{row.original.visitors}</div>,
    },
    {
      id: "sales_graph",
      header: "Sales Graph",
      cell: ({ row }) => (
        <ResponsiveContainer width={100} height={40}>
          <LineChart
            data={row.original.salesGraphData.map((y, x) => ({ x, y }))}
          >
            <Line type="monotone" dataKey="y" stroke="#4F46E5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ),
    }
  );

  return columns;
}
