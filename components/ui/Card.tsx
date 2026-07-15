import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shadow-soft rounded-lg border border-border bg-surface p-4", className)}
      {...props}
    />
  );
}
