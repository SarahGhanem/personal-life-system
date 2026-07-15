import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getOrCreateWeek } from "@/lib/actions/weeks";
import { getOrCreateWeeklyReflection } from "@/lib/actions/reflections";
import { formatISODate, getWeekDates, MONTH_NAMES, WEEKDAY_LABELS } from "@/lib/dates";
import { GoalCategoryChecklist } from "@/components/week/GoalCategoryChecklist";
import { DailyNoteEditor } from "@/components/week/DailyNoteEditor";
import { EndOfWeekQuestion } from "@/components/week/EndOfWeekQuestion";
import { Card } from "@/components/ui/Card";

const CATEGORIES = ["HEALTH", "CAREER", "PERSONAL", "SOCIAL"] as const;

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href={`/years/${year}/months/${month}`} className="text-sm text-slate-500 hover:text-slate-900">
          &larr; {MONTH_NAMES[month - 1]} {year}
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">
          {formatISODate(week.startDate)} &ndash; {formatISODate(week.endDate)}
        </h1>
        <span />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium text-slate-900">Goals for the week</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
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
        <h2 className="mb-3 text-lg font-medium text-slate-900">Daily notes</h2>
        <div className="space-y-3">
          {weekDates.map((date, i) => {
            const iso = formatISODate(date);
            return (
              <Card key={iso}>
                <DailyNoteEditor
                  weekId={week.id}
                  date={iso}
                  label={`${WEEKDAY_LABELS[i]} ${iso}`}
                  initialContent={notesByDate.get(iso) ?? ""}
                />
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium text-slate-900">End of week reflection</h2>
        <Card>
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
