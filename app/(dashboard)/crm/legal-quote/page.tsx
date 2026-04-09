"use client";

export default function LegalQuotePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Legal Quote</h1>
        <p className="text-sm text-gray-500 mt-1">Manage legal quotations</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Legal Quote Module</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Generate and manage legal quotes for clients. Coming soon with full quotation builder.
        </p>
      </div>
    </div>
  );
}
