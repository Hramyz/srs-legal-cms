"use client";

import { useState, useEffect, useCallback } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface Lawyer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string | null;
  licenseNumber: string | null;
  status: string;
  createdAt: string;
}

export default function LawyerRequestsPage() {
  const [requests, setRequests] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/lawyers?status=Pending");
    if (res.ok) {
      const data = await res.json();
      setRequests(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (id: string, status: string) => {
    await fetch(`/api/lawyers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchRequests();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lawyer Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve lawyer registration requests</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No pending requests</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Specialization</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">License</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Applied</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{req.firstName} {req.lastName}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{req.email}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{req.specialization || "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{req.licenseNumber || "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(req.createdAt)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={req.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleAction(req.id, "Approved")} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction(req.id, "Rejected")} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
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
