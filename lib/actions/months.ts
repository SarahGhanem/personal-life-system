"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function getOrCreateMonth(year: number, month: number) {
  const user = await requireUser();
  return prisma.month.upsert({
    where: { userId_year_month: { userId: user.id, year, month } },
    update: {},
    create: { userId: user.id, year, month },
  });
}
