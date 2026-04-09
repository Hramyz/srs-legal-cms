"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import AddLawyerModal from "@/components/modals/AddLawyerModal";
import { formatCurrency } from "@/lib/utils";

interface Lawyer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  specialization: string | null;
  yearsOfExperience: number | null;
  hourlyRate: number | null;
  status: string;
  isActive: boolean;
}

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLawyers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/lawyers?search=${search}`);
      if (res.ok) {
        const data = await res.json();
        setLawyers(data);
      } else {
        setFetchError("Failed to load lawyers.");
      }
    } catch {
      setFetchError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lawyers</h1>
          <p className="text-sm text-gray-500 mt-1">{lawyers.length} total lawyers</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Lawyer
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lawyers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : fetchError ? (
            <div className="p-8 text-center text-red-400 text-sm">{fetchError}</div>
          ) : lawyers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No lawyers found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Specialization</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Experience</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rate/hr</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lawyers.map((lawyer) => (
                  <tr key={lawyer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{lawyer.firstName} {lawyer.lastName}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{lawyer.email}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{lawyer.specialization || "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{lawyer.yearsOfExperience ? `${lawyer.yearsOfExperience} yrs` : "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{lawyer.hourlyRate ? formatCurrency(lawyer.hourlyRate) : "—"}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={lawyer.isActive ? "Active" : "Inactive"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddLawyerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchLawyers} />
    </div>
  );
}
