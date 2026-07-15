"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getOrCreateMonth } from "@/lib/actions/months";
import { parseISODate, getWeekRange } from "@/lib/dates";

export async function getOrCreateWeek(startDateISO: string) {
  const user = await requireUser();
  const { startDate, endDate } = getWeekRange(parseISODate(startDateISO));
  const month = await getOrCreateMonth(startDate.getUTCFullYear(), startDate.getUTCMonth() + 1);

  return prisma.week.upsert({
    where: { userId_startDate: { userId: user.id, startDate } },
    update: {},
    create: { userId: user.id, monthId: month.id, startDate, endDate },
  });
}
