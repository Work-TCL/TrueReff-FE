import React, { ReactElement, ReactNode } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Navigation } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-user";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/commonUtils";

interface DataTableProps {
  gridClasses?: string;
  data: any[];
  columns: ColumnDef<any, any>[];
  type?: "table" | "card";
  CardComponent?: (item: any) => ReactElement;
  handleRowClick?: (item: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  gridClasses = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4 h-full",
  data,
  columns,
  type = "table",
  CardComponent,
  handleRowClick,
}) => {
  const t = useTranslations();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();
  const { account: user } = useAuthStore();
  const handleNavigate = () => {
    router.push("/creator/my-store/store-setup"); // adjust this to your desired route
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  const tableContent = () => (
    <table className="w-full table-auto relative">
      <thead className="[&_tr]:border-b bg-stroke">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className={"bg-gray-2 text-left dark:bg-meta-4"}
          >
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                onClick={header.column.getToggleSortingHandler()}
                className={cn(
                  "sticky top-0 bg-stroke sm:min-w-[150px] min-w-[110px] text-sm p-4 text-left z-10 font-medium cursor-pointer select-none dark:text-white xl:pl-4 text-gray-600 whitespace-nowrap",
                  header.column.columnDef.meta &&
                    header.column.columnDef.meta.isColumnSticky &&
                    header.column.columnDef.meta.stickySide === "left" &&
                    "sticky left-0 z-[11] bg-stroke",
                  header.column.columnDef.meta &&
                    header.column.columnDef.meta.isColumnSticky &&
                    header.column.columnDef.meta.stickySide === "right" &&
                    "sticky right-0 z-[11] bg-stroke"
                )}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                <span>
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody className="min-h-96">
        {table.getRowModel().rows.length > 0
          ? table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors group"
                onClick={() => handleRowClick && handleRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "border-b border-[#eee] py-3 px-2 xl:pl-4 text-sm text-gray-600 dark:border-strokedark group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors",
                      cell.column.columnDef.meta &&
                        cell.column.columnDef.meta.isColumnSticky &&
                        cell.column.columnDef.meta.stickySide === "left" &&
                        "sticky left-0 z-[1] bg-white dark:bg-boxdark transition-colors",
                      cell.column.columnDef.meta &&
                        cell.column.columnDef.meta.isColumnSticky &&
                        cell.column.columnDef.meta.stickySide === "right" &&
                        "sticky right-0 z-[1] bg-white dark:bg-boxdark transition-colors"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          : null}
      </tbody>
    </table>
  );

  return (
    <div className="flex-1 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden h-full rounded-xl">
      <div className="max-w-full h-full overflow-auto">
        {data.length > 0 && type === "table" ? (
          tableContent()
        ) : data.length > 0 && type === "card" && CardComponent ? (
          <div
            className={`grid ${gridClasses} gap-4 bg-white p-4 rounded-[20px] overflow-auto`}
          >
            {data.map((item) => CardComponent(item))}
          </div>
        ) : user?.role === "vendor" ? (
          <div className="flex flex-col items-center justify-center text-center rounded-lg w-full h-full border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col items-center">
              <div className="p-4 mx-auto text-blue-500 bg-blue-100 rounded-full dark:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
                {t("No_RECORDS")}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t("No_RECORDS_DESC")}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center rounded-lg w-full h-full border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
            <div className="flex flex-col items-center">
              <div className="p-4 mx-auto text-blue-500 bg-blue-100 rounded-full dark:bg-gray-700">
                <Navigation
                  className="w-8 h-8 cursor-pointer"
                  onClick={handleNavigate}
                />
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
                {t("Store_Not_Found")}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
                {t("Store_Not_Found_DESC")}
              </p>
              <button
                onClick={handleNavigate}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {t("Store_Not_Found_BTN")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
