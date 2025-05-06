import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PriceHistoryChartProps {
  data: any[];
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
  const chartConfig = {
    price: {
      label: "Market Price",
      theme: {
        light: "#33C3F0",
        dark: "#33C3F0",
      },
    },
    basePrice: {
      label: "Base Price",
      theme: {
        light: "#4ade80",
        dark: "#4ade80",
      },
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black bg-opacity-80 border border-game-secondary p-2 rounded-md text-xs">
          <p className="font-bold">Day {label}</p>
          <p className="text-green-500">Base: {payload[0].value} gold</p>
          <p className="text-blue-500">Market: {payload[1].value} gold</p>
          <p className="text-gray-400">Volume: {payload[1].payload.volume} trades</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorBasePrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#33C3F0" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#33C3F0" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
          <XAxis dataKey="day" tick={{ fill: '#999' }} tickLine={{ stroke: '#555' }} axisLine={{ stroke: '#555' }} />
          <YAxis tick={{ fill: '#999' }} tickLine={{ stroke: '#555' }} axisLine={{ stroke: '#555' }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="basePrice" stroke="#4ade80" strokeWidth={2} fillOpacity={1} fill="url(#colorBasePrice)" />
          <Area type="monotone" dataKey="price" stroke="#33C3F0" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PriceHistoryChart;