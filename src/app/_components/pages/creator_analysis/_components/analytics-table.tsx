import React, { useState } from "react";
import DataTable from "@/app/_components/components-common/data-table";
import { IAnalyticsData, IFilterAnalytics } from "./types";
import { getAnalyticsColumns } from "./getAnalyticsColumns";

interface AnalyticsTableProps {
  mode: "vendor" | "creator";
  data: IAnalyticsData[];
  filter: IFilterAnalytics | null;
  onRowClick: (value: IFilterAnalytics) => void;
}

const AnalyticsTable: React.FC<AnalyticsTableProps> = ({
  mode,
  data,
  onRowClick,
  filter,
}) => {
  const [columns, setColumns] = useState(() =>
    getAnalyticsColumns(mode, handleRowClick, filter?.key)
  );

  function handleRowClick(value: IFilterAnalytics) {
    // Remove product column and call API
    console.log("Fetch data for productId", value);
    setColumns(getAnalyticsColumns(mode, handleRowClick, value.key)); // Without `onProductClick`, product column gets hidden
    onRowClick(value);
  }

  return (
    <div className="p-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AnalyticsTable;
