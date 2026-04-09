"use client";

import { useSession } from "next-auth/react";
import { Bell, Search } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {session?.user?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {(session?.user as any)?.role || "admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
