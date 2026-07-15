import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getOrCreateMonth } from "@/lib/actions/months";
import { formatISODate, getWeeksForMonth, MONTH_NAMES } from "@/lib/dates";
import { CalendarGrid } from "@/components/month/CalendarGrid";
import { EventForm } from "@/components/month/EventForm";
import { EventList } from "@/components/month/EventList";
import { WeeksList } from "@/components/month/WeeksList";
import { Card } from "@/components/ui/Card";

export default async function MonthPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year: yearParam, month: monthParam } = await params;
  const year = Number(yearParam);
  const month = Number(monthParam);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) notFound();

  const user = await requireUser();
  const monthRecord = await getOrCreateMonth(year, month);

  const events = await prisma.calendarEvent.findMany({
    where: { monthId: monthRecord.id, userId: user.id },
    orderBy: { date: "asc" },
  });

  const eventsByDate = new Map<string, typeof events>();
  for (const event of events) {
    const iso = formatISODate(event.date);
    eventsByDate.set(iso, [...(eventsByDate.get(iso) ?? []), event]);
  }

  const weeks = getWeeksForMonth(year, month);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href={`/years/${year}`} className="text-sm text-slate-500 hover:text-slate-900">
          &larr; {year}
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">
          {MONTH_NAMES[month - 1]} {year}
        </h1>
        <div className="flex gap-3 text-sm">
          <Link href={`/years/${year}/months/${month}/finance`} className="text-slate-500 hover:text-slate-900">
            Finance
          </Link>
          <Link href={`/years/${year}/months/${month}/reflection`} className="text-slate-500 hover:text-slate-900">
            Reflection
          </Link>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-medium text-slate-900">Calendar</h2>
        <CalendarGrid year={year} month={month} eventsByDate={eventsByDate} />
      </section>

      <section>
        <Card className="space-y-4">
          <EventForm monthId={monthRecord.id} />
          <EventList events={events} />
        </Card>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium text-slate-900">Weeks</h2>
        <WeeksList year={year} month={month} weeks={weeks} />
      </section>
    </div>
  );
}
