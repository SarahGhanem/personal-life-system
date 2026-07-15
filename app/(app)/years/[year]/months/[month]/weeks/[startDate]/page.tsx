import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getOrCreateWeek } from "@/lib/actions/weeks";
import { getOrCreateWeeklyReflection } from "@/lib/actions/reflections";
import { formatISODate, getTodayISO, getWeekDates, getWeeksForMonth, MONTH_NAMES, WEEKDAY_LABELS } from "@/lib/dates";
import { CATEGORY_ORDER } from "@/lib/categories";
import { GoalCategoryChecklist } from "@/components/week/GoalCategoryChecklist";
import { DailyNoteEditor } from "@/components/week/DailyNoteEditor";
import { EndOfWeekQuestion } from "@/components/week/EndOfWeekQuestion";
import { Card } from "@/components/ui/Card";

export default async function WeekPage({
  params,
}: {
  params: Promise<{ year: string; month: string; startDate: string }>;
}) {
  const { year: yearParam, month: monthParam, startDate: startDateParam } = await params;
  const year = Number(yearParam);
  const month = Number(monthParam);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) notFound();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDateParam)) notFound();

  const user = await requireUser();
  const week = await getOrCreateWeek(startDateParam);

  const [goals, notes, reflection] = await Promise.all([
    prisma.weeklyGoal.findMany({
      where: { weekId: week.id, userId: user.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.dailyNote.findMany({
      where: { weekId: week.id, userId: user.id },
    }),
    getOrCreateWeeklyReflection(week.id),
  ]);

  const notesByDate = new Map(notes.map((note) => [formatISODate(note.date), note.content]));
  const weekDates = getWeekDates(week.startDate);
  const todayISO = getTodayISO();
  const weekStartISO = formatISODate(week.startDate);
  const weekNumber = getWeeksForMonth(year, month).findIndex(
    (w) => formatISODate(w.startDate) === weekStartISO,
  ) + 1;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href={`/years/${year}/months/${month}`}
          className="flex items-center gap-1 text-sm text-ink-faint hover:text-accent-strong"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {MONTH_NAMES[month - 1]} {year}
        </Link>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            {weekNumber > 0 ? `Week ${weekNumber}` : "Week"}
          </h1>
          <p className="text-xs text-ink-faint">
            {formatISODate(week.startDate)} &ndash; {formatISODate(week.endDate)}
          </p>
        </div>
        <span />
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-medium text-ink">Goals for the week</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORY_ORDER.map((category) => (
            <Card key={category}>
              <GoalCategoryChecklist
                weekId={week.id}
                category={category}
                goals={goals.filter((goal) => goal.category === category)}
              />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-medium text-ink">Daily notes</h2>
        <div className="space-y-3">
          {weekDates.map((date, i) => {
            const iso = formatISODate(date);
            const isToday = iso === todayISO;
            return (
              <Card key={iso} className={isToday ? "border-accent" : ""}>
                <DailyNoteEditor
                  weekId={week.id}
                  date={iso}
                  label={`${WEEKDAY_LABELS[i]} ${iso}`}
                  isToday={isToday}
                  initialContent={notesByDate.get(iso) ?? ""}
                />
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-medium text-ink">End of week reflection</h2>
        <Card className="p-6">
          <EndOfWeekQuestion
            weekId={week.id}
            question={reflection.question.text}
            initialAnswer={reflection.answer ?? ""}
          />
        </Card>
      </section>
    </div>
  );
}
