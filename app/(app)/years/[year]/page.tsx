import Link from "next/link";
import { notFound } from "next/navigation";
import { MONTH_NAMES } from "@/lib/dates";
import { MonthTile } from "@/components/year/MonthTile";

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  if (!Number.isInteger(year) || year < 1970 || year > 9999) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/years/${year - 1}`} className="text-sm text-slate-500 hover:text-slate-900">
          &larr; {year - 1}
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">{year}</h1>
        <Link href={`/years/${year + 1}`} className="text-sm text-slate-500 hover:text-slate-900">
          {year + 1} &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {MONTH_NAMES.map((name, i) => (
          <MonthTile key={name} year={year} month={i + 1} name={name} />
        ))}
      </div>
    </div>
  );
}
