import Link from "next/link";
import { formatISODate } from "@/lib/dates";
import { Card } from "@/components/ui/Card";

export function WeeksList({
  year,
  month,
  weeks,
}: {
  year: number;
  month: number;
  weeks: { startDate: Date; endDate: Date }[];
}) {
  return (
    <div className="space-y-2">
      {weeks.map((week) => {
        const startISO = formatISODate(week.startDate);
        return (
          <Link key={startISO} href={`/years/${year}/months/${month}/weeks/${startISO}`}>
            <Card className="flex items-center justify-between hover:border-slate-400">
              <span className="text-sm font-medium text-slate-900">
                {startISO} &ndash; {formatISODate(week.endDate)}
              </span>
              <span className="text-xs text-slate-500">Goals, notes &amp; reflection &rarr;</span>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
