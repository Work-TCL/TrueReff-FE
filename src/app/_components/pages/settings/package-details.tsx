"use client";
import Loading from "@/app/vendor/loading";
import { vendorPlans } from "@/lib/utils/constants";
import axios from "@/lib/web-api/axios";
import { features } from "process";
import React, { useEffect, useState } from "react";
import Button from "../../ui/button";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { useTranslations } from "next-intl";

export interface IFeatures {
    label: string;
    icon: string
}
export interface ISubscriptionPlan {
    _id: string;
    name: string;
    amount: number;
    currencyCode: string;
    isActive: boolean;
    plan_id: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly'; // You can extend this union if needed
    interval: number;
    productLimit: number;
    createdAt: string; // or Date if you parse it
    updatedAt: string; // or Date if you parse it
    allowCollaboration: boolean;
    analytics: boolean;
    commission: number;
    prioritySupport: boolean;
    storeIntegration: boolean;
    features?: IFeatures[]
}
export interface IRazorPayData {
    id: string;
    entity: string;
    plan_id: string;
    customer_id: string;
    status: string;
    current_start: number; // Unix timestamp
    current_end: number; // Unix timestamp
    ended_at: number | null; // Unix timestamp or null
    quantity: number;
    notes: {
        email: string;
    };
    charge_at: number; // Unix timestamp
    start_at: number; // Unix timestamp
    end_at: number; // Unix timestamp
    auth_attempts: number;
    total_count: number;
    paid_count: number;
    customer_notify: boolean;
    created_at: number; // Unix timestamp
    expire_by: number | null; // Unix timestamp or null
    short_url: string;
    has_scheduled_changes: boolean;
    change_scheduled_at: number | null; // Unix timestamp or null
    source: string;
    payment_method: string;
    offer_id: string | null;
    remaining_count: number;
    card_mandate_id: string;
}

export interface ISubscription {
    _id: string;
    subscription_id: string;
    planId: ISubscriptionPlan;
    vendorId: string;
    type: "recurring" | "one-time"; // Extendable union type
    status: string;
    redirectUrl: string;
    isActive: boolean;
    startedAt: string; // ISO date string
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    paymentStatus: string;
    razorPayData: IRazorPayData;
}
interface IPackageDetailsProps {
    isRegister?: boolean
}
const statusColor: any = {
    success: "text-green-600",
    failed: "text-red-600",
    pending: "text-yellow-600",
};

const planStatusColor:any = {
    active: "text-green-600",
    inactive: "text-gray-500",
    cancelled: "text-red-600",
};

export default function PackageDetails({ isRegister }: IPackageDetailsProps) {
    const translate = useTranslations();
    const activeState = {
        "_id": "",
        "name": "",
        "amount": 0,
        "currencyCode": "",
        "isActive": false,
        "plan_id": "",
        "period": "",
        "interval": 0,
        "productLimit": 0,
        "createdAt": "",
        "updatedAt": "",
        "allowCollaboration": false,
        "analytics": false,
        "commission": 0,
        "prioritySupport": false,
        "storeIntegration": false
    };
    const [activePlan, setActivePlan] = useState<any>(activeState);
    const initSubState = {
        "_id": "",
        "subscription_id": "",
        "planId": {
            "_id": "",
            "name": "",
            "amount": 0,
            "currencyCode": "",
            "isActive": false,
            "plan_id": "",
            "period": "daily",
            "interval": 0,
            "productLimit": 0,
            "createdAt": "",
            "updatedAt": "",
            "allowCollaboration": false,
            "analytics": false,
            "commission": 0,
            "prioritySupport": false,
            "storeIntegration": false
        },
        "vendorId": "",
        "type": "one-time",
        "status": "",
        "redirectUrl": "",
        "isActive": false,
        "startedAt": "",
        "createdAt": "",
        "updatedAt": "",
        "paymentStatus": "",
        "razorPayData": {
            "id": "",
            "entity": "",
            "plan_id": "",
            "customer_id": "",
            "status": "",
            "current_start": 0,
            "current_end": 0,
            "ended_at": null,
            "quantity": 0,
            "notes": {
                "email": ""
            },
            "charge_at": 0,
            "start_at": 0,
            "end_at": 0,
            "auth_attempts": 0,
            "total_count": 0,
            "paid_count": 0,
            "customer_notify": false,
            "created_at": 0,
            "expire_by": null,
            "short_url": "",
            "has_scheduled_changes": false,
            "change_scheduled_at": null,
            "source": "",
            "payment_method": "",
            "offer_id": null,
            "remaining_count": 0,
            "card_mandate_id": ""
        }
    };
    const [activeSubscription, setActiveSubscription] = useState<any>(initSubState);
    const [showPlans, setShowPlans] = useState<boolean>(false);
    const [planDetails, setPlanDetails] = useState<ISubscriptionPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitLoader, setSubmitLoader] = useState<string>("");
    const getPlanDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/payment/plan/all`);
            if (response?.status === 200) {
                const planData = response?.data?.data?.map((ele: ISubscriptionPlan) => {
                    return {
                        ...ele,
                        features: [
                            { label: "Product Listings", icon: "/assets/pricing/subscribed.svg" },
                            { label: "Creator Collaborations", icon: `/assets/pricing/${ele?.allowCollaboration ? "subscribed.svg" : "unsubscribed.svg"}` },
                            { label: "Analytics & Reports", icon: `/assets/pricing/${ele?.analytics ? "subscribed.svg" : "unsubscribed.svg"}` },
                            { label: "Store Integrations", icon: `/assets/pricing/${ele?.storeIntegration ? "subscribed.svg" : "unsubscribed.svg"}` },
                            { label: "Priority Support", icon: `/assets/pricing/${ele?.prioritySupport ? "subscribed.svg" : "unsubscribed.svg"}` }
                        ]
                    }
                })
                setPlanDetails(planData);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    const getActivePlan = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/payment/plan/subscription`);
            if (response?.status === 200) {
                const subscription = response?.data?.data?.subscription;
                setActiveSubscription(subscription);
                setActivePlan({
                    ...subscription?.planId, features: [
                        { label: "Product Listings", icon: "/assets/pricing/subscribed.svg", included: true, },
                        { label: "Creator Collaborations", icon: `/assets/pricing/${subscription?.planId?.allowCollaboration ? "subscribed.svg" : "unsubscribed.svg"}`, included: subscription?.planId?.allowCollaboration },
                        { label: "Analytics & Reports", icon: `/assets/pricing/${subscription?.planId?.analytics ? "subscribed.svg" : "unsubscribed.svg"}`, included: subscription?.planId?.analytics },
                        { label: "Store Integrations", icon: `/assets/pricing/${subscription?.planId?.storeIntegration ? "subscribed.svg" : "unsubscribed.svg"}`, included: subscription?.planId?.storeIntegration },
                        { label: "Priority Support", icon: `/assets/pricing/${subscription?.planId?.prioritySupport ? "subscribed.svg" : "unsubscribed.svg"}`, included: subscription?.planId?.prioritySupport },
                    ]
                })
                setLoading(false);
            } else {
                setActiveSubscription(initSubState);
                setActivePlan(activeState)
            }
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPlanDetails();
        getActivePlan();
    }, []);

    const handleSubscribePlan = async (planId: string) => {
        setSubmitLoader(planId);
        try {
            const response = await axios.post(`/payment/plan/subscribe`, {
                "planId": planId,
                "type": "recurring"
            });
            const { subscription_id } = response?.data?.data;

            // Step 2: Load Razorpay script
            const razorpayScript = document.createElement("script");
            razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
            razorpayScript.async = true;
            document.body.appendChild(razorpayScript);

            razorpayScript.onload = () => {
                const options = {
                    key: "rzp_test_ucj89vYunIEtNY", // Replace with your Razorpay Key ID
                    subscription_id: subscription_id, // The subscription created from backend
                    name: "TrueReff",
                    description: "Monthly Subscription",
                    handler: function (response: any) {
                        // This will not be called if callback_url is provided.
                        console.log("Payment success:", response);
                    },
                    callback_url: "http://localhost:3000/vendor/dashboard", // Auto-redirect here after success
                    theme: {
                        color: "#F37254",
                    },
                    prefill: {
                        name: "Customer Name",
                        email: "customer@example.com",
                    },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            }

        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toastMessage.error(errorMessage);
            setSubmitLoader("");
        } finally {
            setSubmitLoader("");
        }
    }
    const getPlans = (data: any[]) => {
        setActivePlan
        // if(showPlans && activePlan?.isActive){
        return data?.filter((plan: any) => showPlans && activePlan?.isActive ? ((plan?._id !== activePlan?._id) && (plan?._id !== "1")) : true)
        // } else return data;
    }
    return (
        <div className={`flex flex-col ${(activePlan?.isActive && !showPlans) ? "items-start" : "items-center"} rounded-2xl bg-white p-2 lg:p-6`}>
            {loading ? <Loading height="fit" className="h-[400px]" /> : <>
                {(activePlan?.isActive && !showPlans) ? <div className=" p-6">
                   <div className="flex justify-end space-x-2"> 
                    <Button
                        // loading={submitLoader}
                        type="button"
                        size="small"
                        className={`w-fit font-medium px-8 md:text-base text-sm bg-white border hover:shadow-sm  text-black`}
                        onClick={() => setShowPlans(false)}
                    >
                        {"Cancel"}
                    </Button>
                    <Button
                        // loading={submitLoader}
                        type="button"
                        size="small"
                        className={`w-full font-medium px-8 md:text-base text-sm bg-white border hover:bg-black hover:text-white border-black text-black`}
                        onClick={() => setShowPlans(true)}
                    >
                        {"Upgrade Plan"}
                    </Button></div>
                    
                    <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">
                        Your Current Plan
                    </h2>

                    <div className={`rounded-xl p-6 `}>
                        <h3 className="text-xl font-semibold mb-1">{activePlan.name} Plan</h3>
                        <p className="text-2xl font-bold mb-4">
                            ₹{activePlan.amount}{" "}
                            <span className="text-sm font-medium text-gray-400">
                                / user / {activePlan?.period}
                            </span>
                        </p>

                        <ul className="space-y-2 mb-4">
                            {activePlan.features.map((feature: any, idx: number) => (
                                <li key={idx} className="flex space-x-2 items-center">
                                    <img src={feature?.icon} height={20} width={20} />
                                    <span
                                        className={feature.included ? "" : "text-gray-300 line-through"}
                                    >
                                        {feature.label}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 text-sm space-y-1 ">
                            <p>
                                <strong>Due Date:</strong> {activeSubscription.paymentStatus}
                            </p>
                            <p>
                                <strong>Next Payment:</strong> {activeSubscription.paymentStatus}
                            </p>
                            <p>
                                <strong>Payment Status:</strong>{" "}
                                <span className={statusColor[activeSubscription.paymentStatus]}>
                                    {activeSubscription.paymentStatus}
                                </span>
                            </p>
                            <p>
                                <strong>Plan Status:</strong>{" "}
                                <span className={planStatusColor[activeSubscription.status]}>
                                    {activeSubscription.status}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                    : <><div className="flex justify-center gap-2 font-bold text-[20px] sm:text-[25px] md:text-[30px] lg:text-[40px]">{(activePlan?.isActive && !showPlans) ? "Your Active" : "Best"} <span className="text-primary-color">Subscription</span> Plan</div>
                        <p className="text-sm md:text-md lg:text-lg">View and upgrade your subscription to unlock premium features.</p>
                        <div><div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-8`}>
                            {getPlans([...vendorPlans, ...planDetails]).map((plan, index) => (
                                <div key={index} className={`max-w-xs w-full ${(index === 2) ? "bg-black text-white" : "text-black bg-white border"} rounded-2xl p-6 hover:shadow-lg flex flex-col justify-between relative`}>
                                    {/* Popular Badge */}
                                    {index === 2 && <div className="absolute top-0 right-0 bg-primary text-white text-sm font-semibold px-4 py-1 rounded-tr-2xl rounded-bl-2xl">
                                        Popular
                                    </div>}
                                    <div className="flex flex-col">
                                        {/* Title */}
                                        <h2 className="text-xl font-semibold mb-1">{plan?.name}</h2>

                                        {/* Price */}
                                        <div className="text-4xl font-semibold mb-1">₹{plan.amount}</div>
                                        <p className={`text-sm ${(index === 2) ? "text-white" : "text-gray-500"} mb-4`}>{`per user/${plan?.period}`}</p>
                                        <p className={`text-sm ${(index === 2) ? "text-white" : "text-gray-500"} mb-4`}>{`Commission ${plan?.commission}%/sell`}</p>

                                        {/* Feature Title */}
                                        <p className="font-semibold text-sm mb-3">Feature Benefits</p>

                                        {/* Features List */}
                                        <ul className="space-y-2 text-sm">
                                            {plan.features ? plan.features.map((feature: IFeatures) => (
                                                <li key={feature.label} className="flex items-center gap-2">
                                                    <img src={feature?.icon} height={20} width={20} />
                                                    {feature.label}
                                                </li>
                                            )) : ''}
                                        </ul>
                                    </div>

                                    {/* Get Started Button */}
                                    <div>
                                        {(plan?._id !== "1") && <Button
                                            loading={submitLoader === plan?._id}
                                            type="button"
                                            size="small"
                                            className={`w-full mt-6 font-medium px-8 md:text-base text-sm ${index === 2 ? "bg-gradient-to-r from-purple via-pink-500 to-yellow-400 text-white font-semibold rounded-lg transition hover:opacity-90" : "bg-white border hover:bg-black hover:text-white border-black text-black"}`}
                                            onClick={() => handleSubscribePlan(plan?._id)}
                                        >
                                            {"Get Started"}
                                        </Button>}

                                    </div>
                                </div>
                            ))}
                        </div>
                            {showPlans && <div className="col-span-1">
                                <Button
                                    // loading={submitLoader}
                                    type="button"
                                    size="small"
                                    className={`w-fit mt-6 font-medium px-8 md:text-base text-sm bg-white border hover:shadow-sm  text-black`}
                                    onClick={() => setShowPlans(false)}
                                >
                                    {"Cancel"}
                                </Button>
                            </div>}
                        </div></>
                }</>}
        </div>
    )
}