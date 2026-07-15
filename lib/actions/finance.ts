"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { financeSchema } from "@/lib/validation";

export async function upsertMonthlyFinance(formData: FormData) {
  const user = await requireUser();
  const parsed = financeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid finance data.");

  const month = await prisma.month.findFirst({
    where: { id: parsed.data.monthId, userId: user.id },
  });
  if (!month) throw new Error("Month not found.");

  await prisma.monthlyFinance.upsert({
    where: { monthId: month.id },
    update: {
      totalIncome: parsed.data.totalIncome,
      totalSavings: parsed.data.totalSavings,
      totalExpenses: parsed.data.totalExpenses,
      notes: parsed.data.notes || null,
    },
    create: {
      userId: user.id,
      monthId: month.id,
      totalIncome: parsed.data.totalIncome,
      totalSavings: parsed.data.totalSavings,
      totalExpenses: parsed.data.totalExpenses,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/", "layout");
}
