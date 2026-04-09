"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  permissions: Record<string, boolean | string[]>;
  createdAt: string;
}

const DEFAULT_PERMISSIONS = [
  "view_dashboard",
  "manage_cases",
  "manage_clients",
  "manage_lawyers",
  "manage_finance",
  "manage_services",
  "manage_documents",
  "manage_admin",
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/roles");
    if (res.ok) {
      const data = await res.json();
      setRoles(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user roles and access control</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {roles.map((role) => {
            const perms = role.permissions as Record<string, boolean>;
            return (
              <div key={role.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{role.displayName}</h3>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{role.name}</span>
                    </div>
                    {role.description && (
                      <p className="text-sm text-gray-400 mt-1">{role.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(role.createdAt)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_PERMISSIONS.map((perm) => (
                    <span
                      key={perm}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        perms[perm]
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {perms[perm] ? "✓" : "✗"} {perm.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
