"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { eventSchema } from "@/lib/validation";
import { parseISODate } from "@/lib/dates";

export async function createEvent(formData: FormData) {
  const user = await requireUser();
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid event.");

  const month = await prisma.month.findFirst({
    where: { id: parsed.data.monthId, userId: user.id },
  });
  if (!month) throw new Error("Month not found.");

  await prisma.calendarEvent.create({
    data: {
      userId: user.id,
      monthId: month.id,
      title: parsed.data.title,
      date: parseISODate(parsed.data.date),
      time: parsed.data.time || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/", "layout");
}

export async function deleteEvent(eventId: string) {
  const user = await requireUser();
  const result = await prisma.calendarEvent.deleteMany({
    where: { id: eventId, userId: user.id },
  });
  if (result.count === 0) throw new Error("Event not found.");

  revalidatePath("/", "layout");
}
