'use client';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { translate } from '@/lib/utils/translate';

// Data Type
interface ChartData {
    date: string;
    value: number;
    active?: boolean;
}

const data: ChartData[] = [
    { date: '10 Sep', value: 2000 },
    { date: '11 Sep', value: 7000 },
    { date: '12 Sep', value: 4000 },
    { date: '13 Sep', value: 9000 },
    { date: '14 Sep', value: 6000 },
    { date: '15 Sep', value: 15750, active: true },
    { date: '16 Sep', value: 5000 }
];

// Tooltip Props Interface
interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
}

interface CustomizedLabelProps {
    x?: number;
    y?: number;
    stroke?: string;
    value?: number | string;
}

const CustomizedLabel: React.FC<CustomizedLabelProps> = ({ x = 0, y = 0, stroke = '#000', value }) => {
    return (
        <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="center">
            {value}
        </text>
    );
};

interface CustomizedAxisTickProps {
    x?: number;
    y?: number;
    stroke?: string;
    payload?: { value: string };
}

const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = ({ x = 100, y = 40, payload }) => {
    console.log(payload,x,y)
    return (
        <g transform={`translate(${x},${y})`}>
            <text className={`text-[10px] text-font-grey p-2 px-3 bg-primary`}>
                {payload?.value}
            </text>
        </g>
    );
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-lg text-black px-3 py-1 rounded-lg text-sm font-medium">
                ${payload[0].value.toLocaleString()}
            </div>
        );
    }
    return null;
};

const VendorActivity: React.FC = () => {
    return (
        <Card className="p-5 w-full bg-white rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-20 text-text  font-semibold">{translate("Vendor Activity")}</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                            {translate("This week")} ▼
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>{translate("This week")}</DropdownMenuItem>
                        <DropdownMenuItem>{translate("Last week")}</DropdownMenuItem>
                        <DropdownMenuItem>{translate("This month")}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <XAxis
                        dataKey="date"
                        // tick={({ value }) => (
                        //     <text className={`text-xs ${value === '15 Sep' ? 'fill-red-500 font-bold' : 'fill-gray-500'}`}>
                        //         {"value"}
                        //     </text>
                        // )}
                        // rennder  
                        tick={<CustomizedAxisTick />}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Bar
                        dataKey="value"
                        radius={[5, 5, 0, 0]}
                    // fill={({ payload }) => (payload.active ? '#F43F5E' : '#E5E7EB')}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default VendorActivity;
