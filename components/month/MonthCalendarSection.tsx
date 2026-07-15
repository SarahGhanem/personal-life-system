"use client";

import { useMemo, useState } from "react";
import { formatDisplayDate, formatISODate, getTodayISO } from "@/lib/dates";
import { CalendarGrid } from "@/components/month/CalendarGrid";
import { EventForm } from "@/components/month/EventForm";
import { EventList } from "@/components/month/EventList";
import { Card } from "@/components/ui/Card";

type EventLite = { id: string; title: string; time: string | null; notes: string | null; date: Date };

function defaultSelectedDate(year: number, month: number): string {
  const todayISO = getTodayISO();
  const today = new Date(`${todayISO}T00:00:00.000Z`);
  if (today.getUTCFullYear() === year && today.getUTCMonth() + 1 === month) {
    return todayISO;
  }
  return formatISODate(new Date(Date.UTC(year, month - 1, 1)));
}

export function MonthCalendarSection({
  year,
  month,
  monthId,
  events,
}: {
  year: number;
  month: number;
  monthId: string;
  events: EventLite[];
}) {
  const [selectedDate, setSelectedDate] = useState(() => defaultSelectedDate(year, month));

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventLite[]>();
    for (const event of events) {
      const iso = formatISODate(event.date);
      map.set(iso, [...(map.get(iso) ?? []), event]);
    }
    return map;
  }, [events]);

  const selectedEvents = eventsByDate.get(selectedDate) ?? [];

  return (
    <div className="space-y-4">
      <CalendarGrid
        year={year}
        month={month}
        eventsByDate={eventsByDate}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <Card className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink">{formatDisplayDate(selectedDate)}</h3>
          <EventForm key={selectedDate} monthId={monthId} date={selectedDate} />
        </div>
        <EventList events={selectedEvents} emptyMessage="No events on this day." />
      </Card>
    </div>
  );
}
