"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Scale,
  UserCheck,
  CreditCard,
  ShoppingCart,
  Settings,
  FolderOpen,
  Shield,
  LogOut,
  ChevronDown,
  ChevronRight,
  Folder,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "CRM",
    icon: Briefcase,
    children: [
      { label: "Cases", href: "/crm/cases", icon: Briefcase },
      { label: "Clients", href: "/crm/clients", icon: Users },
      { label: "Calendar", href: "/crm/calendar", icon: Calendar },
      { label: "Legal Quote", href: "/crm/legal-quote", icon: FileText },
      { label: "Legal Enquiries", href: "/crm/legal-enquiries", icon: MessageSquare },
    ],
  },
  {
    label: "Lawyers",
    icon: Scale,
    children: [
      { label: "All Lawyers", href: "/lawyers", icon: Scale },
      { label: "Lawyer Requests", href: "/lawyers/requests", icon: UserCheck },
    ],
  },
  {
    label: "Finance",
    icon: CreditCard,
    children: [
      { label: "Billing", href: "/finance/billing", icon: CreditCard },
      { label: "Orders", href: "/finance/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Services",
    icon: Settings,
    children: [
      { label: "All Services", href: "/services", icon: Settings },
      { label: "Categories", href: "/services/categories", icon: Folder },
    ],
  },
  {
    label: "Content",
    href: "/content",
    icon: ClipboardList,
  },
  {
    label: "Documents",
    href: "/documents",
    icon: FolderOpen,
  },
  {
    label: "Admin",
    icon: Shield,
    children: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Roles", href: "/admin/roles", icon: Shield },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(["CRM"]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((m) => m !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) =>
    item.children?.some((child) => pathname.startsWith(child.href)) || false;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SRS</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">SRS Legal</p>
            <p className="text-gray-400 text-xs">Legal Tech Platform</p>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          if (item.children) {
            const isOpen = openMenus.includes(item.label);
            const active = isGroupActive(item);

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
                {isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive(child.href)
                            ? "bg-indigo-600 text-white font-medium"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <child.icon className="w-3.5 h-3.5" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href!)
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
