"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { dailyNoteSchema } from "@/lib/validation";
import { parseISODate } from "@/lib/dates";

export async function upsertDailyNote(formData: FormData) {
  const user = await requireUser();
  const parsed = dailyNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid note.");

  const week = await prisma.week.findFirst({
    where: { id: parsed.data.weekId, userId: user.id },
  });
  if (!week) throw new Error("Week not found.");

  const date = parseISODate(parsed.data.date);

  await prisma.dailyNote.upsert({
    where: { userId_date: { userId: user.id, date } },
    update: { content: parsed.data.content },
    create: {
      userId: user.id,
      weekId: week.id,
      date,
      content: parsed.data.content,
    },
  });

  revalidatePath("/", "layout");
}
