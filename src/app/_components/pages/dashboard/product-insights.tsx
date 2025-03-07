'use client';

import { translate } from '@/lib/utils/translate';
import React from 'react';

const data = [
    { name: 'Zara', percentage: 70, price: "$12000" },
    { name: 'H & M', percentage: 35, price: "$1200" },
    { name: 'Puma', percentage: 60, price: "$850" },
    { name: 'Nike', percentage: 80, price: "$500" },
    { name: 'Adidas', percentage: 50, price: "$6000" },
    { name: 'Campus', percentage: 45, price: "$780" },
    { name: 'Michel Kaur', percentage: 90, price: "$120" },
];

const ProductInsights = () => {
    return (
        <div className="w-full  p-4 bg-white rounded-2xl">
            <div className='flex justify-between items-center mb-3'>
                <div><h3 className="text-xl text-text font-medium">{translate("Product_Insights")}</h3></div>
                <div className="flex gap-3"><div className="flex items-center space-x-1">
                                        <span className="w-3 h-3 bg-primary rounded-full"></span>
                                        <span className="text-font-grey text-sm font-medium">{translate("Sales")}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="w-3 h-3 bg-secondary rounded-full"></span>
                                        <span className="text-font-grey text-sm font-medium">{translate("Revenue_($)")}</span>
                                    </div></div>
            </div>
            <ul className="space-y-4">
                {data.map((item, index) => (
                    <li key={index} className="flex flex-col">
                        <div className='flex justify-between items-center gap-2'>

                            <span className="text-font-grey">{item.name}</span>
                            <div className="flex gap-3"><span className="text-primary">{item.percentage}%</span>
                                <span className="text-secondary">{item.price}</span></div>
                        </div>
                        {/* Progress Bar */}
                        <div className="relative flex-grow h-[6px] bg-stroke rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-secondary rounded-full"
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductInsights;
