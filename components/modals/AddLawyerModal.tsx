"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

const lawyerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  hourlyRate: z.string().optional(),
  barAssociation: z.string().optional(),
  bio: z.string().optional(),
});

type LawyerFormData = z.infer<typeof lawyerSchema>;

interface AddLawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SPECIALIZATIONS = ["Criminal Law", "Civil Law", "Family Law", "Corporate Law", "Employment Law", "Real Estate", "Immigration", "Intellectual Property", "Banking & Finance", "Other"];

export default function AddLawyerModal({ isOpen, onClose, onSuccess }: AddLawyerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LawyerFormData>({
    resolver: zodResolver(lawyerSchema),
  });

  const onSubmit = async (data: LawyerFormData) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/lawyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : undefined,
          hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
        }),
      });
      if (res.ok) {
        reset();
        onClose();
        onSuccess?.();
      } else {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body?.error ?? "Failed to add lawyer. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Lawyer" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b">Personal Information</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <input {...register("firstName")} className={inputClass} placeholder="John" />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Last Name *</label>
            <input {...register("lastName")} className={inputClass} placeholder="Doe" />
            {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email *</label>
            <input {...register("email")} type="email" className={inputClass} />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input {...register("phone")} className={inputClass} placeholder="+971 50 000 0000" />
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b pt-2">Professional Details</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>License Number</label>
            <input {...register("licenseNumber")} className={inputClass} placeholder="LIC-001" />
          </div>
          <div>
            <label className={labelClass}>Specialization</label>
            <select {...register("specialization")} className={inputClass}>
              <option value="">Select specialization</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Years of Experience</label>
            <input {...register("yearsOfExperience")} type="number" className={inputClass} placeholder="5" />
          </div>
          <div>
            <label className={labelClass}>Hourly Rate (AED)</label>
            <input {...register("hourlyRate")} type="number" className={inputClass} placeholder="500" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Bar Association</label>
          <input {...register("barAssociation")} className={inputClass} placeholder="Dubai Bar Association" />
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea {...register("bio")} rows={3} className={inputClass} placeholder="Professional biography" />
        </div>

        {submitError && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{submitError}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Lawyer
          </button>
        </div>
      </form>
    </Modal>
  );
}
