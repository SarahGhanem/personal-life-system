import { Trash2 } from "lucide-react";
import { deleteEvent } from "@/lib/actions/events";
import { Button } from "@/components/ui/Button";
import { PlannerIllustration } from "@/components/illustrations/PlannerIllustration";

type EventLite = { id: string; title: string; time: string | null; notes: string | null; date: Date };

export function EventList({
  events,
  emptyMessage = "No events yet.",
}: {
  events: EventLite[];
  emptyMessage?: string;
}) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-3 text-center">
        <PlannerIllustration className="w-24 opacity-90" />
        <p className="text-sm text-ink-faint">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {events.map((event) => (
        <li key={event.id} className="flex items-center justify-between py-2 text-sm">
          <div>
            {event.time && <span className="tabular-nums text-ink-soft">{event.time}</span>}
            <span className={`text-ink ${event.time ? "ml-2" : ""}`}>{event.title}</span>
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
