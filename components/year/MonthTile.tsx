import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function MonthTile({ year, month, name }: { year: number; month: number; name: string }) {
  return (
    <Link href={`/years/${year}/months/${month}`}>
      <Card className="text-center transition-colors hover:border-slate-400">
        <span className="font-medium text-slate-900">{name}</span>
      </Card>
    </Link>
  );
}
