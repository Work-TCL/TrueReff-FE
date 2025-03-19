'use client';

import React from 'react'
import { LineChart, Line, ResponsiveContainer } from "recharts";

const data = [
    { value: 10 },
    { value: 80 },
    { value: 30 },
    { value: 140 },
    { value: 130 },
    { value: 160 },
];

function StatesCardGraph() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <Line type="monotone" dataKey="value" stroke="green" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default StatesCardGraph
