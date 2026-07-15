"use client";

import { useActionState } from "react";
import { submitWeeklyReflectionAnswer } from "@/lib/actions/reflections";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

async function action(_prevState: string | undefined, formData: FormData) {
  try {
    await submitWeeklyReflectionAnswer(formData);
    return "Saved.";
  } catch (err) {
    return err instanceof Error ? err.message : "Failed to save.";
  }
}

export function EndOfWeekQuestion({
  weekId,
  question,
  initialAnswer,
}: {
  weekId: string;
  question: string;
  initialAnswer: string;
}) {
  const [message, formAction, isPending] = useActionState(action, undefined);

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-900">{question}</p>
      <form action={formAction} className="space-y-2">
        <input type="hidden" name="weekId" value={weekId} />
        <Textarea name="answer" rows={3} defaultValue={initialAnswer} placeholder="Your answer..." />
        {message && <p className="text-sm text-slate-600">{message}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save answer"}
        </Button>
      </form>
    </div>
  );
}
