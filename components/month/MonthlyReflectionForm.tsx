"use client";

import { useActionState } from "react";
import { Smile, ThumbsUp, CloudRain, StickyNote } from "lucide-react";
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

function FieldLabel({ icon: Icon, children }: { icon: typeof Smile; children: string }) {
  return (
    <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-ink-soft">
      <Icon className="h-4 w-4 text-ink-faint" aria-hidden="true" />
      {children}
    </label>
  );
}

export function MonthlyReflectionForm({ monthId, reflection }: { monthId: string; reflection: Reflection }) {
  const [message, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="monthId" value={monthId} />
      <div>
        <FieldLabel icon={Smile}>Emotions</FieldLabel>
        <Textarea name="emotions" rows={3} defaultValue={reflection?.emotions ?? ""} />
      </div>
      <div>
        <FieldLabel icon={ThumbsUp}>What went well</FieldLabel>
        <Textarea name="whatWentWell" rows={3} defaultValue={reflection?.whatWentWell ?? ""} />
      </div>
      <div>
        <FieldLabel icon={CloudRain}>What went wrong</FieldLabel>
        <Textarea name="whatWentWrong" rows={3} defaultValue={reflection?.whatWentWrong ?? ""} />
      </div>
      <div>
        <FieldLabel icon={StickyNote}>Notes</FieldLabel>
        <Textarea name="notes" rows={3} defaultValue={reflection?.notes ?? ""} />
      </div>
      {message && <p className="text-sm text-ink-soft">{message}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
