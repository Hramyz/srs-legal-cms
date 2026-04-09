"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import AddCategoryModal from "@/components/modals/AddCategoryModal";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { services: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3 p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-3 p-8 text-center text-gray-400 text-sm">No categories found</div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-xl">
                    {cat.icon || "📁"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{cat.name}</h3>
                    <p className="text-xs text-gray-400">{cat.slug}</p>
                  </div>
                </div>
                <StatusBadge status={cat.isActive ? "Active" : "Inactive"} />
              </div>
              {cat.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{cat.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                <span>Sort: {cat.sortOrder}</span>
                <span>{cat._count?.services || 0} services</span>
              </div>
            </div>
          ))
        )}
      </div>

      <AddCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchCategories} />
    </div>
  );
}
