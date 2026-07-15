"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { goalItemSchema } from "@/lib/validation";

export async function addGoalItem(formData: FormData) {
  const user = await requireUser();
  const parsed = goalItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid goal.");

  const week = await prisma.week.findFirst({
    where: { id: parsed.data.weekId, userId: user.id },
  });
  if (!week) throw new Error("Week not found.");

  const last = await prisma.weeklyGoal.findFirst({
    where: { weekId: week.id, category: parsed.data.category },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.weeklyGoal.create({
    data: {
      weekId: week.id,
      userId: user.id,
      category: parsed.data.category,
      title: parsed.data.title,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath("/", "layout");
}

export async function toggleGoalItem(goalId: string, isDone: boolean) {
  const user = await requireUser();
  const result = await prisma.weeklyGoal.updateMany({
    where: { id: goalId, userId: user.id },
    data: { isDone },
  });
  if (result.count === 0) throw new Error("Goal not found.");

  revalidatePath("/", "layout");
}

export async function deleteGoalItem(goalId: string) {
  const user = await requireUser();
  const result = await prisma.weeklyGoal.deleteMany({
    where: { id: goalId, userId: user.id },
  });
  if (result.count === 0) throw new Error("Goal not found.");

  revalidatePath("/", "layout");
}
