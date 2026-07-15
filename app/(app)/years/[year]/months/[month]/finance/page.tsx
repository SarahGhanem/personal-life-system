import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getOrCreateMonth } from "@/lib/actions/months";
import { MONTH_NAMES } from "@/lib/dates";
import { FinanceForm } from "@/components/month/FinanceForm";
import { Card } from "@/components/ui/Card";

export default async function MonthFinancePage({
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
  const finance = await prisma.monthlyFinance.findUnique({
    where: { monthId: monthRecord.id },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href={`/years/${year}/months/${month}`} className="text-sm text-slate-500 hover:text-slate-900">
          &larr; {MONTH_NAMES[month - 1]} {year}
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">Finance</h1>
        <span />
      </div>
      <Card>
        <FinanceForm
          monthId={monthRecord.id}
          finance={
            finance && {
              totalIncome: finance.totalIncome.toString(),
              totalSavings: finance.totalSavings.toString(),
              totalExpenses: finance.totalExpenses.toString(),
              notes: finance.notes,
            }
          }
        />
      </Card>
    </div>
  );
}
