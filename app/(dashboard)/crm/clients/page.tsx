"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import AddClientModal from "@/components/modals/AddClientModal";
import { formatDate } from "@/lib/utils";

interface Client {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  isOnline: boolean;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(`/api/clients?search=${search}`);
    if (res.ok) {
      const data = await res.json();
      setClients(data);
    }
    setIsLoading(false);
  }, [search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">{clients.length} total clients</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No clients found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-indigo-600">{client.clientId}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{client.firstName} {client.lastName}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{client.email}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{client.phone || "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{[client.city, client.country].filter(Boolean).join(", ") || "—"}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={client.isOnline ? "Active" : "Inactive"} /></td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(client.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchClients} />
    </div>
  );
}
