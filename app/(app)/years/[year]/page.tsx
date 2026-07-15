import Link from "next/link";
import { notFound } from "next/navigation";
import { MONTH_NAMES } from "@/lib/dates";
import { MonthTile } from "@/components/year/MonthTile";

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  if (!Number.isInteger(year) || year < 1970 || year > 9999) notFound();

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/years/${year - 1}`} className="text-sm text-ink-faint hover:text-accent-strong">
          &larr; {year - 1}
        </Link>
        <h1 className="font-display text-3xl font-semibold text-ink">{year}</h1>
        <Link href={`/years/${year + 1}`} className="text-sm text-ink-faint hover:text-accent-strong">
          {year + 1} &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {MONTH_NAMES.map((name, i) => (
          <MonthTile
            key={name}
            year={year}
            month={i + 1}
            name={name}
            isCurrent={year === currentYear && i + 1 === currentMonth}
          />
        ))}
      </div>
    </div>
  );
}
