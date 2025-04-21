"use client";
import React from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { EmptyPlaceholder } from "./empty-place-holder";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DynamicTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyText?: {
    title?: string;
    description?: string;
  };
}

export function DynamicTable<T>({
  columns,
  data,
  emptyText,
}: DynamicTableProps<T>) {
  return (
    <div className="overflow-hidden relative flex flex-col flex-1">
      {data.length > 0 && (
        <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl relative">
          <TableHeader className="bg-stroke sticky top-0 z-10">
            <TableRow>
              {columns.map((col, idx) => (
                <CustomTableHead
                  key={idx}
                  className={`sticky top-0 z-10 ${col.className}`}
                >
                  {translate(col.label)}
                </CustomTableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-hidden">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="bg-white">
                  {columns.map((col, colIndex) => (
                    <CustomTableCell key={colIndex}>
                      <TruncateWithToolTip
                        checkHorizontalOverflow={false}
                        linesToClamp={2}
                        text={
                          col.render ? col.render(row) : (row as any)[col.key]
                        }
                      />
                    </CustomTableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyPlaceholder
                    title={
                      emptyText?.title ??
                      translate("No_Products_Available_Title")
                    }
                    description={
                      emptyText?.description ??
                      translate("No_Products_Available_Description")
                    }
                  />
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      )}
      {data.length === 0 || !data ? (
        <EmptyPlaceholder
          title={emptyText?.title ?? translate("No_Products_Available_Title")}
          description={
            emptyText?.description ??
            translate("No_Products_Available_Description")
          }
        />
      ) : null}
    </div>
  );
}
