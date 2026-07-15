"use client";

import { useActionState, useMemo, useState } from "react";
import { upsertMonthlyFinance } from "@/lib/actions/finance";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

type Finance = {
  totalIncome: string;
  totalSavings: string;
  totalExpenses: string;
  notes: string | null;
} | null;

async function action(_prevState: string | undefined, formData: FormData) {
  try {
    await upsertMonthlyFinance(formData);
    return "Saved.";
  } catch (err) {
    return err instanceof Error ? err.message : "Failed to save.";
  }
}

function formatNumber(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function FinanceForm({ monthId, finance }: { monthId: string; finance: Finance }) {
  const [message, formAction, isPending] = useActionState(action, undefined);
  const [income, setIncome] = useState(finance?.totalIncome ?? "");
  const [savings, setSavings] = useState(finance?.totalSavings ?? "");
  const [expenses, setExpenses] = useState(finance?.totalExpenses ?? "");

  const { incomeNum, savingsNum, expensesNum, net, savingsPct, expensesPct, remainingPct } = useMemo(() => {
    const incomeNum = Number(income) || 0;
    const savingsNum = Number(savings) || 0;
    const expensesNum = Number(expenses) || 0;
    const net = incomeNum - expensesNum;
    const denom = Math.max(incomeNum, savingsNum + expensesNum, 1);
    return {
      incomeNum,
      savingsNum,
      expensesNum,
      net,
      savingsPct: (savingsNum / denom) * 100,
      expensesPct: (expensesNum / denom) * 100,
      remainingPct: Math.max(0, ((incomeNum - savingsNum - expensesNum) / denom) * 100),
    };
  }, [income, savings, expenses]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="monthId" value={monthId} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-soft">Total income</label>
          <Input
            name="totalIncome"
            type="number"
            step="0.01"
            min="0"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-soft">Total savings</label>
          <Input
            name="totalSavings"
            type="number"
            step="0.01"
            min="0"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-soft">Total expenses</label>
          <Input
            name="totalExpenses"
            type="number"
            step="0.01"
            min="0"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
          />
        </div>
      </div>

      {(incomeNum > 0 || savingsNum > 0 || expensesNum > 0) && (
        <div className="rounded-lg border border-border bg-bg p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm font-medium text-ink-soft">Net (income &minus; expenses)</span>
            <span className={`font-display text-2xl font-semibold tabular-nums ${net >= 0 ? "text-health" : "text-danger"}`}>
              {net >= 0 ? "+" : ""}
              {formatNumber(net)}
            </span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full bg-accent" style={{ width: `${savingsPct}%` }} title="Savings" />
            <div className="h-full bg-career" style={{ width: `${expensesPct}%` }} title="Expenses" />
            <div className="h-full bg-transparent" style={{ width: `${remainingPct}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-faint">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" /> Savings {formatNumber(savingsNum)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-career" /> Expenses {formatNumber(expensesNum)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-border" /> Income {formatNumber(incomeNum)}
            </span>
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-ink-soft">Notes</label>
        <Textarea name="notes" rows={4} defaultValue={finance?.notes ?? ""} />
      </div>
      {message && <p className="text-sm text-ink-soft">{message}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
