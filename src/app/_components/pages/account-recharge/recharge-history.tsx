"use client";

import React from "react";
import RechargeHistoryTable from "./recharge-history-table";
import Loading from "@/app/vendor/loading";
import { TablePagination } from "../../components-common/tables/Pagination";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useTranslations } from "next-intl";

export interface IRechargeHistory {
  _id: string;
  accountId: string;
  walletId: string;
  amount: number;
  type: string;
  status: string;
  orderId: string;
  paymentSessionId: string;
  error: string;
  fees: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  paymentId: string;
}
interface IRechargeHistoryProps {
    currentPage: number;
    rechargeHistory: IRechargeHistory[];
    loading: boolean;
    totalPages: number;
    setCurrentPage: (page:number) => void;
    fetchRechargeHistory: (page:number,internalLoader?:boolean) => void;
}
export default function RechargeHistory({loading,rechargeHistory,fetchRechargeHistory,currentPage,setCurrentPage,totalPages}:IRechargeHistoryProps){
    const translate = useTranslations();
    const handlePageChange = (page:number) => {
        page !== currentPage && fetchRechargeHistory(page,true);
        setCurrentPage(page);
    }
    return (
        <div className="bg-white rounded-xl shadow p-2 md:p-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
                <h3 className="text-lg font-semibold">{translate("Recharge_History")}</h3>
                {/* <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Search Campaign..."
                        className="px-3 py-2 text-sm border rounded-md w-full md:w-64"
                    />
                    <Button className="text-sm">Filters</Button>
                </div> */}
            </div>

            {/* ⚠️ Replace this with your table */}
            <div className="flex flex-col space-y-2 overflow-y-auto min-h-[200px] h-[calc(100vh-160px)] md:h-[calc(100vh-320px)]">
                {loading ? <Loading /> : rechargeHistory?.length > 0 ? <>
                    <RechargeHistoryTable data={rechargeHistory} />
                    <TablePagination activePage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
                </> : <EmptyPlaceHolder title={translate("No_Recharge_History_Available")} description={translate("No_Recharge_History_Available_Description")} />}
            </div>
        </div>
    )
}