"use client";

import { StatsCard } from "@/app/_components/components-common/states/StatesCard";
import { formatNumber } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { IndianRupee, Info, Landmark } from "lucide-react";
import axios from "@/lib/web-api/axios";
import RechargeHistory, { IRechargeHistory } from "@/app/_components/pages/account-recharge/recharge-history";
import Loader from "@/app/_components/components-common/layout/loader";
import AddBankDetails from "@/app/_components/components-common/dialogs/add-bank-details";
import ToolTip from "@/app/_components/components-common/tool-tip";

interface ICreatorStats {
    _id: string | null;
    totalRevenue: number;
    totalOrders: number;
    totalViews: number;
    totalCollaborations: number;
    conversionRate: number;
}

export default function AccountRecharge() {
    const translate = useTranslations();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [internalLoading, setInternalLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0);
    const [blockedBalance, setBlockedBalance] = useState<number>(0);
    const [rechargeHistory, setRechargeHistory] = useState<IRechargeHistory[]>([]);
    const initialState = {
        _id: null,
        totalRevenue: 0,
        totalOrders: 0,
        totalViews: 0,
        totalCollaborations: 0,
        conversionRate: 0
    };
    const [creatorStats, setCreatorStats] = useState<ICreatorStats>(initialState);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageLimit = 20;
    const minPayOut = 100;
    const fetchRechargeHistory = async (
        page: number,
        internalLoader: boolean = false,
    ) => {
        internalLoader ? setInternalLoading(true) : setLoading(true);
        try {
            const response = await axios.get(`/payment/wallet/transactions?limit=${pageLimit}&page=${page}`);
            if (response?.status === 200 && response?.data?.data?.data?.length > 0) {
                setRechargeHistory(response?.data?.data?.data);
                setTotalPages(Math.ceil(response.data.data?.count / pageLimit))
            } else {
                setTotalPages(0);
                setRechargeHistory([]);
            }
        } catch (error) {

        } finally {
            setLoading(false);
            setInternalLoading(false);
        }
    }
    const fetchWalletBalance = async (internalLoading: boolean = false) => {
        internalLoading ? setInternalLoading(true) : setLoading(true);
        try {
            const response = await axios.get(`/payment/wallet`)
            if (response?.status === 200) {
                setBalance(response?.data?.data?.balance);
                setBlockedBalance(response?.data?.data?.blockedBalance);
            } else {
                setBalance(0);
                setBlockedBalance(0);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }
    const fetchCreatorStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/product/analytics/creator/page-state`);
            if (response?.status === 200) {
                setCreatorStats(response?.data?.data);
            } else {
                setCreatorStats(initialState)
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchWalletBalance();
        fetchRechargeHistory(currentPage);
        fetchCreatorStats()
    }, []);
    const getPercentage = () => {
        if (balance >= minPayOut) {
            return 100; // Full bar if balance is greater than or equal to minPayOut
        }
        return Math.min((balance / minPayOut) * 100, 100); // Calculate percentage, ensure it doesn't exceed 100
    };
    return <div className="w-full p-2 md:p-4 space-y-3 md:space-y-5 overflow-hidden">
        {internalLoading && <Loader />}
        {/* Top Cards */}
        {loading ? <Loader /> : <><div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4 items-stretch">
            {/* Wallet Balance Card */}
            <div className="bg-gradient-to-r from-[#A48DFF] to-[#F9A8D4] text-white rounded-2xl p-2 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-3 h-[144px]">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-base font-semibold text-white">
                            {translate("Main_Balance")}
                            <ToolTip position="bottom" content={<div className=" max-w-[250px] font-normal text-wrap p-2 rounded-lg">{translate("Main_Balance_Tooltip")}</div>}>
                                <Info className="w-4 h-4 text-white/70 hover:text-white transition" />
                            </ToolTip>
                        </div>
                        <div className="text-2xl font-bold text-white flex items-center gap-1">
                            <IndianRupee size={18} /> {formatNumber(balance)}
                        </div>
                    </div>

                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-full bg-white text-primary hover:bg-primary hover:text-white transition"
                    >
                        <Landmark size={18} />
                    </button>
                </div>

                <div className="relative w-full h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-white rounded-lg"
                        style={{ width: `${getPercentage()}%` }}
                    ></div>
                </div>

                <div className="text-xs md:text-sm text-white/90 flex justify-between items-center">
                    <span className="flex items-center">{translate("Payout_Minimum")}: <IndianRupee size={12} /> {minPayOut}</span>
                    <span className="flex items-center gap-1">
                        {translate("Blocked_Amount")}: <IndianRupee size={14} /> {formatNumber(blockedBalance)}
                    </span>
                </div>
            </div>


            {/* Total Items Sold */}
            <StatsCard
                title={translate("Total_Item_Sold")}
                value={formatNumber(creatorStats?.totalOrders)}
                growth={5}
                bgColor="bg-[#F9EFF5] h-[80px] md:h-[144px] max-h-[144px]"
                borderColor={"border-[#C861A0]"}
            />
            <StatsCard
                title={translate("Total_Revenue_Generated")}
                value={formatNumber(creatorStats?.totalRevenue)}
                growth={5}
                borderColor="border-[#9773C8] h-[80px] md:h-[144px] max-h-[144px]"
                bgColor="bg-[#F5F1F9]"
            />
        </div>
            {/* Recharge History */}
            <RechargeHistory loading={loading} rechargeHistory={rechargeHistory} fetchRechargeHistory={fetchRechargeHistory} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} /></>}
        {open && <AddBankDetails handleRefresh={() => { }} open={open} onClose={() => setOpen(false)} />}
    </div>
}