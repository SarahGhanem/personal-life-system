import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Wallet, BookHeart } from "lucide-react";
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

  const [events, weekRecords] = await Promise.all([
    prisma.calendarEvent.findMany({
      where: { monthId: monthRecord.id, userId: user.id },
      orderBy: { date: "asc" },
    }),
    prisma.week.findMany({
      where: { monthId: monthRecord.id, userId: user.id },
      include: { goals: { select: { isDone: true } } },
    }),
  ]);

  const eventsByDate = new Map<string, typeof events>();
  for (const event of events) {
    const iso = formatISODate(event.date);
    eventsByDate.set(iso, [...(eventsByDate.get(iso) ?? []), event]);
  }

  const progressByStartISO = new Map(
    weekRecords.map((week) => [
      formatISODate(week.startDate),
      { done: week.goals.filter((g) => g.isDone).length, total: week.goals.length },
    ]),
  );

  const weeks = getWeeksForMonth(year, month);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <Link
            href={`/years/${year}`}
            className="flex items-center gap-1 text-sm text-ink-faint hover:text-accent-strong"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {year}
          </Link>
          <div className="flex gap-1">
            <Link
              href={`/years/${year}/months/${month}/finance`}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-strong"
            >
              <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
              Finance
            </Link>
            <Link
              href={`/years/${year}/months/${month}/reflection`}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-strong"
            >
              <BookHeart className="h-3.5 w-3.5" aria-hidden="true" />
              Reflection
            </Link>
          </div>
        </div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          {MONTH_NAMES[month - 1]} {year}
        </h1>
      </div>

      <section>
        <h2 className="mb-2 font-display text-lg font-medium text-ink">Calendar</h2>
        <CalendarGrid year={year} month={month} eventsByDate={eventsByDate} />
      </section>

      <section>
        <Card className="space-y-4">
          <EventForm monthId={monthRecord.id} />
          <EventList events={events} />
        </Card>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-medium text-ink">Weeks</h2>
        <WeeksList year={year} month={month} weeks={weeks} progressByStartISO={progressByStartISO} />
      </section>
    </div>
  );
}
