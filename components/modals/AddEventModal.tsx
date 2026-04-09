"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  eventType: z.string().default("Meeting"),
  startDateTime: z.string().min(1, "Start date/time is required"),
  duration: z.string().default("1 hour"),
  location: z.string().optional(),
  description: z.string().optional(),
  attendees: z.string().optional(),
  reminder: z.string().default("30 minutes before"),
});

type EventFormData = z.infer<typeof eventSchema>;

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddEventModal({ isOpen, onClose, onSuccess }: AddEventModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startDateTime: new Date(data.startDateTime).toISOString(),
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Calendar Event">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className={labelClass}>Event Title *</label>
          <input {...register("title")} className={inputClass} placeholder="Event title" />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Event Type</label>
            <select {...register("eventType")} className={inputClass}>
              <option value="Meeting">Meeting</option>
              <option value="Court Hearing">Court Hearing</option>
              <option value="Consultation">Consultation</option>
              <option value="Deadline">Deadline</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Duration</label>
            <select {...register("duration")} className={inputClass}>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="All day">All day</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Start Date & Time *</label>
          <input {...register("startDateTime")} type="datetime-local" className={inputClass} />
          {errors.startDateTime && <p className="mt-1 text-xs text-red-600">{errors.startDateTime.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <input {...register("location")} className={inputClass} placeholder="Meeting location" />
        </div>

        <div>
          <label className={labelClass}>Attendees</label>
          <input {...register("attendees")} className={inputClass} placeholder="Comma-separated emails" />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea {...register("description")} rows={3} className={inputClass} placeholder="Event description" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Event
          </button>
        </div>
      </form>
    </Modal>
  );
}
