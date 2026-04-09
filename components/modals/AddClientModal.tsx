"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

const clientSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b">Client Information</p>
        
        <div>
          <label className={labelClass}>Client ID *</label>
          <input {...register("clientId")} className={inputClass} placeholder="SRS-1005" />
          {errors.clientId && <p className={errorClass}>{errors.clientId.message}</p>}
        </div>

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
            <input {...register("email")} type="email" className={inputClass} placeholder="john@example.com" />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input {...register("phone")} className={inputClass} placeholder="+971 50 000 0000" />
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b pt-2">Address</p>
        
        <div>
          <label className={labelClass}>Address</label>
          <input {...register("address")} className={inputClass} placeholder="Street address" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>City</label>
            <input {...register("city")} className={inputClass} placeholder="Dubai" />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input {...register("country")} className={inputClass} placeholder="UAE" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea {...register("notes")} rows={2} className={inputClass} placeholder="Additional notes" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Client
          </button>
        </div>
      </form>
    </Modal>
  );
}
