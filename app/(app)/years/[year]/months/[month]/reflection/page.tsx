import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getOrCreateMonth } from "@/lib/actions/months";
import { MONTH_NAMES } from "@/lib/dates";
import { MonthlyReflectionForm } from "@/components/month/MonthlyReflectionForm";
import { Card } from "@/components/ui/Card";

export default async function MonthReflectionPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year: yearParam, month: monthParam } = await params;
  const year = Number(yearParam);
  const month = Number(monthParam);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) notFound();

  await requireUser();
  const monthRecord = await getOrCreateMonth(year, month);
  const reflection = await prisma.monthlyReflection.findUnique({
    where: { monthId: monthRecord.id },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/years/${year}/months/${month}`}
          className="flex items-center gap-1 text-sm text-ink-faint hover:text-accent-strong"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {MONTH_NAMES[month - 1]} {year}
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink">Monthly Reflection</h1>
        <span />
      </div>
      <Card>
        <MonthlyReflectionForm monthId={monthRecord.id} reflection={reflection} />
      </Card>
    </div>
  );
}
