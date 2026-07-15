"use client";

import { useState, useTransition } from "react";
import { upsertDailyNote } from "@/lib/actions/dailyNotes";
import { Textarea } from "@/components/ui/Textarea";

export function DailyNoteEditor({
  weekId,
  date,
  label,
  initialContent,
}: {
  weekId: string;
  date: string;
  label: string;
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
        <span className="text-sm font-semibold text-slate-900">{label}</span>
        {isPending ? (
          <span className="text-xs text-slate-400">Saving...</span>
        ) : !saved ? (
          <span className="text-xs text-amber-600">Unsaved</span>
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
