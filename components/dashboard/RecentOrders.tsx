import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between p-5 border-b border-gray-50">
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        <Link href="/finance/orders" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No orders yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order No.</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-indigo-600">{order.orderNumber}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{order.customerName}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{formatCurrency(order.amount)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
