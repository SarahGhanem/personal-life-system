"use client";

import { useActionState } from "react";
import { MessageCircleQuestion } from "lucide-react";
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
      <div className="mb-3 flex items-start gap-3 rounded-lg bg-accent-soft p-3">
        <MessageCircleQuestion className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <p className="font-display text-base font-medium leading-snug text-ink">{question}</p>
      </div>
      <form action={formAction} className="space-y-2">
        <input type="hidden" name="weekId" value={weekId} />
        <Textarea name="answer" rows={3} defaultValue={initialAnswer} placeholder="Your answer..." />
        {message && <p className="text-sm text-ink-soft">{message}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save answer"}
        </Button>
      </form>
    </div>
  );
}
