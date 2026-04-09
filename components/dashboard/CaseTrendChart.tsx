"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", cases: 8 },
  { month: "Feb", cases: 12 },
  { month: "Mar", cases: 10 },
  { month: "Apr", cases: 15 },
  { month: "May", cases: 18 },
  { month: "Jun", cases: 14 },
  { month: "Jul", cases: 20 },
  { month: "Aug", cases: 22 },
  { month: "Sep", cases: 19 },
  { month: "Oct", cases: 25 },
  { month: "Nov", cases: 23 },
  { month: "Dec", cases: 28 },
];

export default function CaseTrendChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Case Trend</h3>
          <p className="text-xs text-gray-400 mt-0.5">Monthly case filings over the year</p>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">2024</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="casesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
          />
          <Area
            type="monotone"
            dataKey="cases"
            stroke="#4F46E5"
            strokeWidth={2}
            fill="url(#casesGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
