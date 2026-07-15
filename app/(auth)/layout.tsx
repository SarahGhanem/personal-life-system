import { ReactNode } from "react";
import { NotebookPen } from "lucide-react";
import { PlannerIllustration } from "@/components/illustrations/PlannerIllustration";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4">
      <PlannerIllustration className="w-48 sm:w-56" />
      <div className="shadow-soft-lg w-full max-w-sm rounded-xl border border-border bg-surface p-6">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
            <NotebookPen className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="font-display text-xl font-semibold text-ink">Personal Life System</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
