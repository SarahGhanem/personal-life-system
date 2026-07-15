"use client";

import { useActionState } from "react";
import { upsertMonthlyReflection } from "@/lib/actions/reflections";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

type Reflection = {
  emotions: string | null;
  whatWentWell: string | null;
  whatWentWrong: string | null;
  notes: string | null;
} | null;

async function action(_prevState: string | undefined, formData: FormData) {
  try {
    await upsertMonthlyReflection(formData);
    return "Saved.";
  } catch (err) {
    return err instanceof Error ? err.message : "Failed to save.";
  }
}

export function MonthlyReflectionForm({ monthId, reflection }: { monthId: string; reflection: Reflection }) {
  const [message, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="monthId" value={monthId} />
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Emotions</label>
        <Textarea name="emotions" rows={3} defaultValue={reflection?.emotions ?? ""} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">What went well</label>
        <Textarea name="whatWentWell" rows={3} defaultValue={reflection?.whatWentWell ?? ""} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">What went wrong</label>
        <Textarea name="whatWentWrong" rows={3} defaultValue={reflection?.whatWentWrong ?? ""} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
        <Textarea name="notes" rows={3} defaultValue={reflection?.notes ?? ""} />
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
