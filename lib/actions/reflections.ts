"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { monthlyReflectionSchema, weeklyReflectionAnswerSchema } from "@/lib/validation";
import { pickDeterministicIndex } from "@/lib/questionBank";

export async function getOrCreateWeeklyReflection(weekId: string) {
  const user = await requireUser();
  const week = await prisma.week.findFirst({ where: { id: weekId, userId: user.id } });
  if (!week) throw new Error("Week not found.");

  const existing = await prisma.weeklyReflection.findUnique({
    where: { weekId: week.id },
    include: { question: true },
  });
  if (existing) return existing;

  const questions = await prisma.questionBank.findMany({ where: { isActive: true } });
  if (questions.length === 0) throw new Error("No reflection questions available.");

  const idx = pickDeterministicIndex(week.id, questions.length);

  return prisma.weeklyReflection.create({
    data: { weekId: week.id, userId: user.id, questionId: questions[idx].id },
    include: { question: true },
  });
}

export async function submitWeeklyReflectionAnswer(formData: FormData) {
  const user = await requireUser();
  const parsed = weeklyReflectionAnswerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid answer.");

  const result = await prisma.weeklyReflection.updateMany({
    where: { weekId: parsed.data.weekId, userId: user.id },
    data: { answer: parsed.data.answer },
  });
  if (result.count === 0) throw new Error("Reflection not found.");

  revalidatePath("/", "layout");
}

export async function upsertMonthlyReflection(formData: FormData) {
  const user = await requireUser();
  const parsed = monthlyReflectionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid reflection.");

  const month = await prisma.month.findFirst({
    where: { id: parsed.data.monthId, userId: user.id },
  });
  if (!month) throw new Error("Month not found.");

  await prisma.monthlyReflection.upsert({
    where: { monthId: month.id },
    update: {
      emotions: parsed.data.emotions || null,
      whatWentWell: parsed.data.whatWentWell || null,
      whatWentWrong: parsed.data.whatWentWrong || null,
      notes: parsed.data.notes || null,
    },
    create: {
      userId: user.id,
      monthId: month.id,
      emotions: parsed.data.emotions || null,
      whatWentWell: parsed.data.whatWentWell || null,
      whatWentWrong: parsed.data.whatWentWrong || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/", "layout");
}
