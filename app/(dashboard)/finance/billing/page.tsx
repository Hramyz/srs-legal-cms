"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Invoice {
  id: string;
  clientId: string | null;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string | null;
  description: string | null;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/invoices");
    if (res.ok) {
      const data = await res.json();
      setInvoices(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paid = invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.amount, 0);
  const pending = invoices.filter(i => i.status === "Pending").reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage invoices and payments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Total Billed</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Paid</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(paid)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Pending</p>
          <p className="text-xl font-bold text-yellow-600">{formatCurrency(pending)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No invoices found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Issue Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-indigo-600">INV-{invoice.id.slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{invoice.clientId || "—"}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{formatCurrency(invoice.amount)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(invoice.issueDate)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{invoice.dueDate ? formatDate(invoice.dueDate) : "—"}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={invoice.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
