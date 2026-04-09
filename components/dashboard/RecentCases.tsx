import { formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  type: string;
  status: string;
  filingDate: Date;
}

interface RecentCasesProps {
  cases: Case[];
}

export default function RecentCases({ cases }: RecentCasesProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between p-5 border-b border-gray-50">
        <h3 className="font-semibold text-gray-800">Recent Cases</h3>
        <Link href="/crm/cases" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto">
        {cases.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No cases yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Case No.</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
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
                  <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(c.filingDate)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                      {c.status}
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
