import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

const STATUS_COLOR_MAP: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Confirmed: "bg-green-100 text-green-800",
  Completed: "bg-green-100 text-green-800",
  Approved: "bg-green-100 text-green-800",
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Inactive: "bg-red-100 text-red-800",
  Rejected: "bg-red-100 text-red-800",
  Closed: "bg-red-100 text-red-800",
  Cancelled: "bg-red-100 text-red-800",
  Overdue: "bg-red-100 text-red-800",
};

export function getStatusColor(status: string): string {
  return STATUS_COLOR_MAP[status] || "bg-gray-100 text-gray-800";
}
