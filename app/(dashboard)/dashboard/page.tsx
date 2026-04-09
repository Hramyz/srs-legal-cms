import { prisma } from "@/lib/prisma";
import {
  Briefcase,
  Users,
  ShoppingCart,
  DollarSign,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import CaseTrendChart from "@/components/dashboard/CaseTrendChart";
import RevenueTrendChart from "@/components/dashboard/RevenueTrendChart";
import RecentCases from "@/components/dashboard/RecentCases";
import RecentOrders from "@/components/dashboard/RecentOrders";
import { formatCurrency } from "@/lib/utils";

async function getDashboardData() {
  try {
    const [
      totalCases,
      totalClients,
      totalOrders,
      totalDocuments,
      totalEvents,
      revenueData,
      caseValueData,
      completedCases,
      recentCases,
      recentOrders,
    ] = await Promise.all([
      prisma.case.count(),
      prisma.client.count(),
      prisma.order.count(),
      prisma.document.count(),
      prisma.calendarEvent.count(),
      prisma.invoice.aggregate({ _sum: { amount: true } }),
      prisma.case.aggregate({ _sum: { estimatedValue: true } }),
      prisma.case.count({ where: { status: "Completed" } }),
      prisma.case.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const completionRate =
      totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;

    return {
      totalCases,
      totalClients,
      totalOrders,
      totalDocuments,
      totalEvents,
      totalRevenue: revenueData._sum.amount || 0,
      totalCaseValue: caseValueData._sum.estimatedValue || 0,
      completionRate,
      recentCases,
      recentOrders,
    };
  } catch {
    return {
      totalCases: 0,
      totalClients: 0,
      totalOrders: 0,
      totalDocuments: 0,
      totalEvents: 0,
      totalRevenue: 0,
      totalCaseValue: 0,
      completionRate: 0,
      recentCases: [],
      recentOrders: [],
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const statsRow1 = [
    {
      title: "Total Cases",
      value: data.totalCases,
      subLabel: "All time",
      icon: Briefcase,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
      trend: 12,
    },
    {
      title: "Total Clients",
      value: data.totalClients,
      subLabel: "Registered",
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      trend: 8,
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      subLabel: "All orders",
      icon: ShoppingCart,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      trend: 5,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      subLabel: "From invoices",
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      trend: 15,
    },
  ];

  const statsRow2 = [
    {
      title: "Documents",
      value: data.totalDocuments,
      subLabel: "Uploaded",
      icon: FileText,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
    {
      title: "Case Value",
      value: formatCurrency(data.totalCaseValue),
      subLabel: "Estimated",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      title: "Calendar Events",
      value: data.totalEvents,
      subLabel: "Scheduled",
      icon: Calendar,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-50",
    },
    {
      title: "Completion Rate",
      value: `${data.completionRate}%`,
      subLabel: "Closed cases",
      icon: BarChart3,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to SRS Legal Solutions CMS
        </p>
      </div>

      {/* Stats Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsRow1.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsRow2.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CaseTrendChart />
        <RevenueTrendChart />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentCases cases={data.recentCases} />
        <RecentOrders orders={data.recentOrders} />
      </div>
    </div>
  );
}
