import { deleteEvent } from "@/lib/actions/events";
import { formatISODate } from "@/lib/dates";
import { Button } from "@/components/ui/Button";

type EventLite = { id: string; title: string; time: string | null; notes: string | null; date: Date };

export function EventList({ events }: { events: EventLite[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-slate-500">No events yet this month.</p>;
  }

  return (
    <ul className="divide-y divide-slate-200">
      {events.map((event) => (
        <li key={event.id} className="flex items-center justify-between py-2 text-sm">
          <div>
            <span className="font-medium text-slate-900">{formatISODate(event.date)}</span>
            {event.time && <span className="ml-2 text-slate-500">{event.time}</span>}
            <span className="ml-2">{event.title}</span>
            {event.notes && <p className="text-xs text-slate-500">{event.notes}</p>}
          </div>
          <form action={deleteEvent.bind(null, event.id)}>
            <Button type="submit" variant="danger" className="px-2 py-1 text-xs">
              Delete
            </Button>
          </form>
        </li>
      ))}
    </ul>
  );
}
