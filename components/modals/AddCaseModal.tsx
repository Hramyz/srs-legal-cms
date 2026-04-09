"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

const caseSchema = z.object({
  caseNumber: z.string().min(1, "Case number is required"),
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  status: z.string().default("Pending"),
  filingDate: z.string().min(1, "Filing date is required"),
  estimatedValue: z.string().optional(),
  court: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type CaseFormData = z.infer<typeof caseSchema>;

interface AddCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CASE_TYPES = ["Criminal", "Civil", "Family", "Employment", "Corporate", "Real Estate", "Immigration", "Intellectual Property", "Other"];

export default function AddCaseModal({ isOpen, onClose, onSuccess }: AddCaseModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
  });

  const onSubmit = async (data: CaseFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          estimatedValue: data.estimatedValue ? parseFloat(data.estimatedValue) : undefined,
          filingDate: new Date(data.filingDate).toISOString(),
        }),
      });
      if (res.ok) {
        reset();
        onClose();
        onSuccess?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Case" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b">Case Details</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Case Number *</label>
            <input {...register("caseNumber")} className={inputClass} placeholder="CASE-2024-001" />
            {errors.caseNumber && <p className={errorClass}>{errors.caseNumber.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Case Type *</label>
            <select {...register("type")} className={inputClass}>
              <option value="">Select type</option>
              {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p className={errorClass}>{errors.type.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Title *</label>
          <input {...register("title")} className={inputClass} placeholder="Case title" />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select {...register("status")} className={inputClass}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Filing Date *</label>
            <input {...register("filingDate")} type="date" className={inputClass} />
            {errors.filingDate && <p className={errorClass}>{errors.filingDate.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Estimated Value (AED)</label>
            <input {...register("estimatedValue")} type="number" className={inputClass} placeholder="0.00" />
          </div>
          <div>
            <label className={labelClass}>Court</label>
            <input {...register("court")} className={inputClass} placeholder="Court name" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea {...register("description")} rows={3} className={inputClass} placeholder="Case description" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Case
          </button>
        </div>
      </form>
    </Modal>
  );
}
