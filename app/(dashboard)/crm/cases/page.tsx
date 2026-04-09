"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import AddCaseModal from "@/components/modals/AddCaseModal";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  type: string;
  status: string;
  estimatedValue: number | null;
  filingDate: string;
  court: string | null;
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(`/api/cases?search=${search}`);
    if (res.ok) {
      const data = await res.json();
      setCases(data);
    }
    setIsLoading(false);
  }, [search]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
          <p className="text-sm text-gray-500 mt-1">{cases.length} total cases</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Case
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No cases found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Case No.</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Court</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value (AED)</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Filed</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-indigo-600">{c.caseNumber}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 max-w-[200px] truncate">{c.title}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{c.type}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{c.court || "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{c.estimatedValue ? formatCurrency(c.estimatedValue) : "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(c.filingDate)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddCaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchCases} />
    </div>
  );
}
