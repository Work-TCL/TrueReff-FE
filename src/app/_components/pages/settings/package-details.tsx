"use client";
import { vendorPlans } from "@/lib/utils/constants";
import React from "react";

export default function PackageDetails() {
    return (
        <div className="flex flex-col items-center rounded-2xl bg-white p-2 lg:p-6">
            <div className="flex justify-center gap-2 font-bold text-[20px] sm:text-[25px] md:text-[30px] lg:text-[40px]">Best <span className="text-primary-color">Subscription</span> Plan</div>
            <p className="text-sm md:text-md lg:text-lg">View and upgrade your subscription to unlock premium features.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 md:grid-cols-3 lg:grid-cols-4 mt-8">
                {vendorPlans.map((plan, index) => (
                    <div key={index} className={`max-w-xs w-full ${plan?.popular ? "bg-black text-white":"text-black bg-white border"} rounded-2xl p-6 hover:shadow-lg relative`}>
                    {/* Popular Badge */}
                    {plan?.popular && <div className="absolute top-0 right-0 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-tr-2xl rounded-bl-2xl">
                        Popular
                    </div>}

                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-2">{plan?.name}</h2>

                    {/* Price */}
                    <div className="text-4xl font-semibold mb-1">${plan.price}</div>
                    <p className={`text-sm ${plan.popular ? "text-white" :"text-gray-500"} mb-4`}>{plan?.description}</p>

                    {/* Feature Title */}
                    <p className="font-semibold text-sm mb-3">Feature Benefits</p>

                    {/* Features List */}
                    <ul className="space-y-2 text-sm">
                        {plan.features.map((feature) => (
                            <li key={feature.label} className="flex items-center gap-2">
                                <img src={feature?.icon} height={20} width={20} />
                                {feature.label}
                            </li>
                        ))}
                    </ul>

                    {/* Get Started Button */}
                    {plan.popular ? <button className="mt-6 w-full bg-gradient-to-r from-purple via-pink-500 to-yellow-400 text-white font-semibold py-2 rounded-lg transition hover:opacity-90">
                        Get Started
                    </button>: <button className="mt-6 w-full bg-white border border-black text-black font-semibold py-2 rounded-lg transition hover:bg-black hover:text-white">
                        Get Started
                    </button>}
                </div>
                ))}
            </div>
        </div>
    )
}