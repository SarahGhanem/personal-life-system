"use client";

import { useActionState } from "react";
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

export function FinanceForm({ monthId, finance }: { monthId: string; finance: Finance }) {
  const [message, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="monthId" value={monthId} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Total income</label>
          <Input
            name="totalIncome"
            type="number"
            step="0.01"
            min="0"
            defaultValue={finance ? String(finance.totalIncome) : ""}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Total savings</label>
          <Input
            name="totalSavings"
            type="number"
            step="0.01"
            min="0"
            defaultValue={finance ? String(finance.totalSavings) : ""}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Total expenses</label>
          <Input
            name="totalExpenses"
            type="number"
            step="0.01"
            min="0"
            defaultValue={finance ? String(finance.totalExpenses) : ""}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
        <Textarea name="notes" rows={4} defaultValue={finance?.notes ?? ""} />
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
