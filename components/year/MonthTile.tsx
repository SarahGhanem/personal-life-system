import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function MonthTile({
  year,
  month,
  name,
  isCurrent,
}: {
  year: number;
  month: number;
  name: string;
  isCurrent: boolean;
}) {
  return (
    <Link href={`/years/${year}/months/${month}`}>
      <Card
        className={`flex items-center justify-center gap-2 text-center transition-colors hover:border-accent ${
          isCurrent ? "border-accent bg-accent-soft" : ""
        }`}
      >
        <span className={`font-medium ${isCurrent ? "text-accent-strong" : "text-ink"}`}>{name}</span>
        {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
      </Card>
    </Link>
  );
}
