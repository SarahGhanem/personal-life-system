import { formatISODate, getCalendarGridDates, WEEKDAY_LABELS } from "@/lib/dates";

type EventLite = { id: string; title: string; time: string | null; date: Date };

export function CalendarGrid({
  year,
  month,
  eventsByDate,
}: {
  year: number;
  month: number;
  eventsByDate: Map<string, EventLite[]>;
}) {
  const dates = getCalendarGridDates(year, month);

  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 text-xs">
      {WEEKDAY_LABELS.map((label) => (
        <div key={label} className="bg-slate-50 px-2 py-1 text-center font-medium text-slate-500">
          {label}
        </div>
      ))}
      {dates.map((date) => {
        const iso = formatISODate(date);
        const inMonth = date.getUTCMonth() === month - 1;
        const events = eventsByDate.get(iso) ?? [];
        return (
          <div
            key={iso}
            className={`min-h-20 bg-white p-1 ${inMonth ? "" : "bg-slate-50 text-slate-300"}`}
          >
            <div className="mb-1 text-right font-medium">{date.getUTCDate()}</div>
            <div className="space-y-0.5">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="truncate rounded bg-slate-900 px-1 py-0.5 text-white"
                  title={event.title}
                >
                  {event.time ? `${event.time} ` : ""}
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
