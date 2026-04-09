"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Calendar } from "lucide-react";
import AddEventModal from "@/components/modals/AddEventModal";
import { formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";

interface CalendarEvent {
  id: string;
  title: string;
  eventType: string;
  startDateTime: string;
  duration: string;
  location: string | null;
  isAllDay: boolean;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/events");
    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">{events.length} scheduled events</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No events scheduled</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{event.title}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={event.eventType} /></td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(event.startDateTime)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{event.duration}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{event.location || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchEvents} />
    </div>
  );
}
