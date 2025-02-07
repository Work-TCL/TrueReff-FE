'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Most selling products', value: 76, color: '#BEDBFC' },
  { name: 'Low-Performing products', value: 24, color: '#FED6AF' },
];

const DonutChart: React.FC = () => {
  return (
    <div className="w-full md:w-1/3 p-4 rounded-20 bg-white ">
      <h2 className=" text-text text-xl font-medium ">Product Updates</h2>
      <div className=' relative h-[240px]'>

      <ResponsiveContainer width="100%" height={'100%'}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            style={{width: '100%', height: '100%'}}
            innerRadius={75}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            paddingAngle={7}
            cornerRadius={7}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-desc">This month</p>
          <p className="text-2xl font-medium text-gray-darken">1000</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            ></div>
            <span>
              {item.name} <b className='font-medium'>{item.value}%</b>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
