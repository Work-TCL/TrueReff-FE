"use client";

import { StatsCard } from "@/app/_components/components-common/states/StatesCard";
import { formatNumber } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { IndianRupee, MoveRight } from "lucide-react";
import axios from "@/lib/web-api/axios";
import RechargeHistory, { IRechargeHistory } from "@/app/_components/pages/account-recharge/recharge-history";
import AddBalance from "@/app/_components/components-common/dialogs/add-balance";
import Loader from "@/app/_components/components-common/layout/loader";

interface IVendorStats {
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
    const [blockedBalance,setBlockedBalance] = useState<number>(0);
    const initialState = {
        _id: null,
        totalRevenue: 0,
        totalOrders: 0,
        totalViews: 0,
        totalCollaborations: 0,
        conversionRate: 0,
    }
    const [vendorStats, setVendorStats] = useState<IVendorStats>(initialState)
    const [rechargeHistory, setRechargeHistory] = useState<IRechargeHistory[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageLimit = 20;
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
    const fetchWalletBalance = async (internalLoading:boolean = false) => {
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
    const fetchVendorStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/product/analytics/vendor/page-state`);
            if (response?.status === 200) {
                setVendorStats(response?.data?.data);
            } else {
                setVendorStats(initialState)
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchWalletBalance();
        fetchRechargeHistory(currentPage);
        fetchVendorStats();
    }, [])
    const handleAddBalance = () => {
        setOpen(prev => !prev)
    }
    const handleRefresh = () => {
        fetchWalletBalance(true);
        fetchRechargeHistory(1,true);
    }
    return <div className="w-full p-2 md:p-4 space-y-4 md:space-y-5 overflow-hidden">
        {/* Top Cards */}
        {loading ? <Loader /> : <><div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {/* Wallet Balance Card */}
            <div className="bg-custom-gradient text-white rounded-2xl p-4 overflow-hidden shadow-lg flex justify-between items-center h-full">
                {/* Wallet Text & Button */}
                <div className="w-2/4 md:w-1/3">
                    <h2 className="text-lg font-semibold mb-4 text-secondary">{translate("Wallet_Balance")}</h2>
                    <button onClick={handleAddBalance} className="flex items-center py-2 px-3 rounded-lg gap-2 text-sm md:text-md font-semibold cursor-pointer bg-white text-black hover:bg-gray-200">
                        {translate("Add_Balance")} <MoveRight />
                    </button>
                </div>

                {/* Right Side Content (Values instead of coin image) */}
                <div className=" text-right">
                    <div className="text-sm text-gray-600">{translate("Main_Balance")}</div>
                    <div className="flex items-center justify-end text-2xl font-bold text-primary"><IndianRupee />{balance}</div>
                    <div className="text-sm mt-3 text-gray-600">{translate("Blocked_Amount")}</div>
                    <div className="flex items-center justify-end text-xl text-secondary"><IndianRupee size={18}/>{blockedBalance}</div>
                </div>
            </div>
            {/* Total Items Sold */}
            <StatsCard
                title={translate("Total_Item_Sold")}
                value={formatNumber(vendorStats?.totalOrders)}
                growth={5}
                bgColor="bg-[#F9EFF5]"
                borderColor={"border-[#C861A0]"}
            />
            <StatsCard
                title={translate("Total_Revenue_Generated")}
                value={formatNumber(vendorStats?.totalRevenue)}
                growth={5}
                borderColor="border-[#9773C8]"
                bgColor="bg-[#F5F1F9]"
            />
        </div>
        {/* Recharge History */}
        <RechargeHistory loading={loading || internalLoading} rechargeHistory={rechargeHistory} fetchRechargeHistory={fetchRechargeHistory} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}/>
        </>}
        {open && <AddBalance open={open} onClose={() => setOpen(false)} handleRefresh={handleRefresh} />}
    </div>
}