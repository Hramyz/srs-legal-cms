"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 62000 },
  { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 78000 },
  { month: "May", revenue: 89000 },
  { month: "Jun", revenue: 72000 },
  { month: "Jul", revenue: 95000 },
  { month: "Aug", revenue: 105000 },
  { month: "Sep", revenue: 91000 },
  { month: "Oct", revenue: 118000 },
  { month: "Nov", revenue: 109000 },
  { month: "Dec", revenue: 134000 },
];

export default function RevenueTrendChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Revenue Trend</h3>
          <p className="text-xs text-gray-400 mt-0.5">Monthly revenue (AED)</p>
        </div>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">2024</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
            formatter={(value: number) => [`AED ${value.toLocaleString()}`, "Revenue"]}
          />
          <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
