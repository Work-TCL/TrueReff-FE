'use client';

import { translate } from '@/lib/utils/translate';
import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, TooltipProps
} from 'recharts';


const data = [
    { month: 'Jan', revenue: 120000, profit: 80000 },
    { month: 'Feb', revenue: 500000, profit: 350000 },
    { month: 'Mar', revenue: 200000, profit: 150000 },
    { month: 'Apr', revenue: 400000, profit: 300000 },
    { month: 'May', revenue: 100000, profit: 70000 },
    { month: 'Jun', revenue: 600000, profit: 400000 },
    { month: 'Jul', revenue: 450000, profit: 250000 },
    { month: 'Aug', revenue: 520000, profit: 300000 },
    { month: 'Sep', revenue: 380000, profit: 200000 },
    { month: 'Oct', revenue: 650000, profit: 450000 },
    { month: 'Nov', revenue: 500000, profit: 300000 },
    { month: 'Dec', revenue: 200000, profit: 150000 },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black text-white p-2 rounded-lg">
                <p className="text-sm m-0">${(payload[0].value! / 1000).toFixed(2)}k</p>
                <p className="text-xs m-0">{label}</p>
            </div>
        );
    }
    return null;
};

export default function SalesChart() {
    return (
        <div className="w-full md:w-2/3 h-[410px] bg-white p-5 rounded-20">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-medium text-text">{translate("Sales Performance")}</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <span className="w-3 h-3 bg-secondary rounded-full"></span>
                        <span className="text-font-grey text-sm font-medium">{translate("Revenue")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="w-3 h-3 bg-primary rounded-full"></span>
                        <span className="text-font-grey text-sm font-medium">{translate("Profit")}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <p className="text-2xl text-text ">$50.4K</p>
                <p className="text-sm text-success ">↑ 5% than last month</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 26}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F5" />
                    <XAxis dataKey="month" tick={{ fill: '#7E7E80',fontSize: 12 }} stroke="#F2F4F5"  />
                    <YAxis tick={{ fill: '#7E7E80', fontSize: 12 }} stroke="#F2F4F5" strokeWidth={0}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" stroke="#090919" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="profit" stroke="#FF4979" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}