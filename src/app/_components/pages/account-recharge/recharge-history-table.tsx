"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/app/_components/components-common/status-badge";
import DataTable from "@/app/_components/components-common/data-table";
import { IRechargeHistory } from "./recharge-history";
import { formatDateWithTime } from "@/lib/utils/constants";

interface ICreatorTableProps {
    data: IRechargeHistory[];
}

const statusBadgeColor:{[key:string]: string} = {
  pending: "bg-pending text-pending", 
  success: "bg-active text-active", 
  failed: "bg-failed text-failed"
}
const RechargeHistoryTable = ({
    data,
}: ICreatorTableProps) => {
    const translate = useTranslations();
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "createdAt",
            header: () => translate("Date_Time"),
            cell: ({ row }) => formatDateWithTime(
                row?.original?.createdAt
              )
        },
        {
            accessorKey: "amount",
            header: () => <div className="flex justify-center">{translate("Amount")}</div>,
            cell: ({ row }) => (
              <div className="flex justify-center">{row?.original?.amount}</div>
            )
        },
        {
            accessorKey: "fees",
            header: () => <div className="flex justify-center">{translate("Fees")}</div>,
            cell: ({ row }) => (
              <div className="flex justify-center">{row?.original?.fees}</div>
            )
        },
        {
            accessorKey: "tax",
            header: () => <div className="flex justify-center">{translate("Tax")}</div>,
            cell: ({ row }) => (
              <div className="flex justify-center">{row?.original?.tax}</div>
            )
        },
        {
            accessorKey: "paymentMethod",
            header: () => <div className="flex justify-center">{translate("Payment_Method")}</div>,
            cell: ({ row }) => (
              <div className="flex justify-center">{row?.original?.paymentMethod}</div>
            )
        },
        {
            accessorKey: "paymentId",
            header: () => <div className="flex justify-center">{translate("Transaction_Id")}</div>,
            cell: ({ row }) => (
              <div className="flex justify-center">{row?.original?.paymentId}</div>
            )
        },
        {
            id: "status",
            header: () => <div className="text-center">{translate("Status")}</div>,
            cell: ({ row }) => {
                const status = row?.original?.status;
                return status ? (
                    <div className="flex justify-center">
                        <StatusBadge status={status} messageStatus={status} className={statusBadgeColor[status]} />
                    </div>
                ) : null;
            },
        }
    ];
    return (
        <DataTable columns={columns} data={[...data]} type={"table"} />
    );
};

export default RechargeHistoryTable;
