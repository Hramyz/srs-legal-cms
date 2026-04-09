"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

const enquirySchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface AddEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddEnquiryModal({ isOpen, onClose, onSuccess }: AddEnquiryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/enquiries", {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Enquiry">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className={labelClass}>Client Name *</label>
          <input {...register("clientName")} className={inputClass} placeholder="Full name" />
          {errors.clientName && <p className="mt-1 text-xs text-red-600">{errors.clientName.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email *</label>
            <input {...register("email")} type="email" className={inputClass} placeholder="email@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input {...register("phone")} className={inputClass} placeholder="+971 50 000 0000" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Subject</label>
          <input {...register("subject")} className={inputClass} placeholder="Enquiry subject" />
        </div>

        <div>
          <label className={labelClass}>Message</label>
          <textarea {...register("message")} rows={4} className={inputClass} placeholder="Enquiry message" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Enquiry
          </button>
        </div>
      </form>
    </Modal>
  );
}
