"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, FileText, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Document {
  id: string;
  filename: string;
  fileSize: string | null;
  documentType: string;
  description: string | null;
  tags: string | null;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(`/api/documents?search=${search}`);
    if (res.ok) {
      const data = await res.json();
      setDocuments(data);
    }
    setIsLoading(false);
  }, [search]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      PDF: "📄",
      Word: "📝",
      Excel: "📊",
      Image: "🖼️",
      Other: "📎",
    };
    return icons[type] || "📎";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">{documents.length} documents uploaded</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">File</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tags</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Uploaded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFileIcon(doc.documentType)}</span>
                        <span className="text-sm font-medium text-gray-800">{doc.filename}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{doc.documentType}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{doc.fileSize || "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[200px] truncate">{doc.description || "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{doc.tags || "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(doc.uploadedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
