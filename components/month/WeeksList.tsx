import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatISODate, getMonday, getTodayISO } from "@/lib/dates";
import { Card } from "@/components/ui/Card";

type Progress = { done: number; total: number };

export function WeeksList({
  year,
  month,
  weeks,
  progressByStartISO,
}: {
  year: number;
  month: number;
  weeks: { startDate: Date; endDate: Date }[];
  progressByStartISO: Map<string, Progress>;
}) {
  const currentWeekStartISO = formatISODate(getMonday(new Date(`${getTodayISO()}T00:00:00.000Z`)));

  return (
    <div className="space-y-2">
      {weeks.map((week) => {
        const startISO = formatISODate(week.startDate);
        const isCurrent = startISO === currentWeekStartISO;
        const progress = progressByStartISO.get(startISO);

        return (
          <Link key={startISO} href={`/years/${year}/months/${month}/weeks/${startISO}`}>
            <Card
              className={`flex items-center justify-between gap-3 transition-colors hover:border-accent ${
                isCurrent ? "border-accent bg-accent-soft" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-medium text-ink">
                  {startISO} &ndash; {formatISODate(week.endDate)}
                </span>
                {isCurrent && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white">
                    This week
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {progress && progress.total > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-ink-faint">
                      {progress.done}/{progress.total}
                    </span>
                  </div>
                )}
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
