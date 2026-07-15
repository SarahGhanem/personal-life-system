import { CalendarX2, Trash2 } from "lucide-react";
import { deleteEvent } from "@/lib/actions/events";
import { formatISODate } from "@/lib/dates";
import { Button } from "@/components/ui/Button";

type EventLite = { id: string; title: string; time: string | null; notes: string | null; date: Date };

export function EventList({ events }: { events: EventLite[] }) {
  if (events.length === 0) {
    return (
      <p className="flex items-center gap-2 py-3 text-sm text-ink-faint">
        <CalendarX2 className="h-4 w-4" aria-hidden="true" />
        No events yet this month.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {events.map((event) => (
        <li key={event.id} className="flex items-center justify-between py-2 text-sm">
          <div>
            <span className="font-medium text-ink">{formatISODate(event.date)}</span>
            {event.time && <span className="ml-2 tabular-nums text-ink-soft">{event.time}</span>}
            <span className="ml-2 text-ink">{event.title}</span>
            {event.notes && <p className="text-xs text-ink-faint">{event.notes}</p>}
          </div>
          <form action={deleteEvent.bind(null, event.id)}>
            <Button
              type="submit"
              variant="danger"
              aria-label="Delete event"
              title="Delete event"
              className="flex items-center gap-1 px-2 py-1 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </form>
        </li>
      ))}
    </ul>
  );
}
