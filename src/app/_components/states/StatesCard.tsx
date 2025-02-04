"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const data = [
  { value: 10 },
  { value: 80 },
  { value: 30 },
  { value: 140 },
  { value: 130 },
  { value: 160 },
];

const StatsCard = ({ title, value, growth, borderColor, bgColor }:{ title:string; value:number; growth:number; borderColor: string; bgColor: string }) => {
  return (
    <Card className={`w-[300px] h-[120px] border border-${borderColor} ${bgColor} rounded-2xl`}>
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <h3 className=" text-secondary">{title}</h3>
          <div className="text-success bg-success-light text-sm px-2 py-1 rounded-sm">
            +{growth}%
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-medium text-text">{value}</span>
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="value" stroke="green"  dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StatesCards() {
  return (
    <div className="flex gap-4">
      <StatsCard title="Active Collaborations" value={120} growth={5} bgColor="bg-white bg-[linear-gradient(0deg,#FFFFFF,#FFFFFF),linear-gradient(0deg,rgba(120,119,238,0.1),rgba(120,119,238,0.1))]" borderColor="#7877EE" />
      <StatsCard title="Total Products" value={200} growth={5} borderColor="border-orange-400" bgColor="bg-orange-50" />
    </div>
  );
}
