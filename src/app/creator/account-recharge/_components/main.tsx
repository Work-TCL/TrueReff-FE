"use client";

import { StatsCard } from "@/app/_components/components-common/states/StatesCard";
import { formatNumber } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { IndianRupee, Info } from "lucide-react";
import axios from "@/lib/web-api/axios";
import RechargeHistory, { IRechargeHistory } from "@/app/_components/pages/account-recharge/recharge-history";
import Loader from "@/app/_components/components-common/layout/loader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

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
    // const [open, setOpen] = useState<boolean>(false);
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
            if (response?.status === 200 && response?.data?.data?.balance) {
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
    return <div className="w-full p-2 md:p-4 space-y-4 md:space-y-5 overflow-hidden">
        {internalLoading && <Loader />}
        {/* Top Cards */}
        {loading ? <Loader /> : <><div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {/* Wallet Balance Card */}
            <div className="bg-custom-gradient text-white rounded-2xl p-6 overflow-hidden shadow-lg flex justify-between items-center h-full">
                {/* Wallet Text & Button */}
                <div className="w-full space-y-1">
                    {/* <button className="flex items-center p-2 rounded-lg gap-2 text-md font-semibold cursor-pointer bg-white text-black hover:bg-gray-200">
                        Add Balance <MoveRight />
                    </button> */}
                    <div className="flex  justify-between items-center gap-2">
                        <div className="flex flex-col">
                            <div className="flex items-center text-secondary gap-1">{translate("Main_Balance")} <TooltipProvider key={`main_balance`}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-4 h-4 text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden"
                                        side="top"
                                    >
                                        {""}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider></div>
                            <div className="text-font-grey flex items-center space-x-2">
                                <span className="flex items-center text-primary md:text-xl text-sm">
                                    <IndianRupee size={15} /> {formatNumber(balance)}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center text-secondary gap-1">{translate("Blocked_Amount")}</div>
                            <div className="text-font-grey flex justify-end items-center space-x-2">
                                <span className="flex items-center text-gray-600 md:text-xl text-sm">
                                    <IndianRupee size={15} /> {formatNumber(blockedBalance)}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="relative flex-grow h-[6px] bg-stroke rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary rounded-full"
                            style={{ width: `${getPercentage()}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center text-secondary">
                        <span className="flex items-center">{translate("Payout_Minimum")}: <span className="flex items-center"><IndianRupee size={15} /> {minPayOut}</span></span>
                    </div>
                </div>
            </div>


            {/* Total Items Sold */}
            <StatsCard
                title={translate("Total_Item_Sold")}
                value={formatNumber(creatorStats?.totalOrders)}
                growth={5}
                bgColor="bg-[#F9EFF5]"
                borderColor={"border-[#C861A0]"}
            />
            <StatsCard
                title={translate("Total_Revenue_Generated")}
                value={formatNumber(creatorStats?.totalRevenue)}
                growth={5}
                borderColor="border-[#9773C8]"
                bgColor="bg-[#F5F1F9]"
            />
        </div>
            {/* Recharge History */}
            <RechargeHistory loading={loading} rechargeHistory={rechargeHistory} fetchRechargeHistory={fetchRechargeHistory} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} /></>}
    </div>
}