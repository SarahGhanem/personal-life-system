import { formatISODate, getCalendarGridDates, getTodayISO, WEEKDAY_LABELS } from "@/lib/dates";

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
  const todayISO = getTodayISO();

  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border text-xs">
      {WEEKDAY_LABELS.map((label, i) => (
        <div
          key={label}
          className={`px-2 py-1 text-center font-medium ${
            i >= 5 ? "bg-bg text-ink-faint" : "bg-bg text-ink-soft"
          }`}
        >
          {label}
        </div>
      ))}
      {dates.map((date) => {
        const iso = formatISODate(date);
        const inMonth = date.getUTCMonth() === month - 1;
        const isToday = iso === todayISO;
        const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
        const events = eventsByDate.get(iso) ?? [];
        return (
          <div
            key={iso}
            className={`min-h-20 p-1 ${
              !inMonth
                ? "bg-bg/60 text-ink-faint"
                : isWeekend
                  ? "bg-bg/40"
                  : "bg-surface"
            } ${isToday ? "ring-2 ring-inset ring-accent" : ""}`}
          >
            <div className="mb-1 flex justify-end">
              <span
                className={`font-medium ${
                  isToday
                    ? "flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white"
                    : ""
                }`}
              >
                {date.getUTCDate()}
              </span>
            </div>
            <div className="space-y-0.5">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="truncate rounded bg-accent-strong px-1 py-0.5 text-white"
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
