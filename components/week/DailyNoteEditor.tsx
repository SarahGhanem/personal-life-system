"use client";

import { useState, useTransition } from "react";
import { upsertDailyNote } from "@/lib/actions/dailyNotes";
import { Textarea } from "@/components/ui/Textarea";

export function DailyNoteEditor({
  weekId,
  date,
  label,
  isToday,
  initialContent,
}: {
  weekId: string;
  date: string;
  label: string;
  isToday: boolean;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(true);

  function save() {
    if (saved) return;
    const formData = new FormData();
    formData.set("weekId", weekId);
    formData.set("date", date);
    formData.set("content", content);
    startTransition(() => {
      upsertDailyNote(formData).then(() => setSaved(true));
    });
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          {label}
          {isToday && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white">
              Today
            </span>
          )}
        </span>
        {isPending ? (
          <span className="text-xs text-ink-faint">Saving...</span>
        ) : !saved ? (
          <span className="text-xs text-career">Unsaved</span>
        ) : null}
      </div>
      <Textarea
        rows={2}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        onBlur={save}
        placeholder="Add a note..."
      />
    </div>
  );
}
