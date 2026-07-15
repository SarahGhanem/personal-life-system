// All date handling here is pure calendar-date (UTC midnight), no timezone
// semantics — this is a personal day-planner, not a scheduler across zones.

export function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** Returns the Monday (UTC midnight) of the week containing `date`. */
export function getMonday(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

export function getWeekRange(date: Date): { startDate: Date; endDate: Date } {
  const startDate = getMonday(date);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 6);
  return { startDate, endDate };
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

/** The 7 dates (Mon-Sun) for the week starting at `startDate`. */
export function getWeekDates(startDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
}

/**
 * Weeks "belonging" to a given year/month: every Monday that falls within
 * that calendar month, in order.
 */
export function getWeeksForMonth(year: number, month: number): { startDate: Date; endDate: Date }[] {
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const lastOfMonth = new Date(Date.UTC(year, month, 0));

  const weeks: { startDate: Date; endDate: Date }[] = [];
  let cursor = getMonday(firstOfMonth);
  if (cursor.getUTCMonth() !== month - 1) {
    cursor = addDays(cursor, 7);
  }

  while (cursor <= lastOfMonth) {
    weeks.push(getWeekRange(cursor));
    cursor = addDays(cursor, 7);
  }

  return weeks;
}

/** Calendar grid cells (Mon-Sun rows) for a month, including leading/trailing days from adjacent months. */
export function getCalendarGridDates(year: number, month: number): Date[] {
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const lastOfMonth = new Date(Date.UTC(year, month, 0));
  const gridStart = getMonday(firstOfMonth);
  const gridEnd = getMonday(lastOfMonth);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + 6);

  const dates: Date[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
