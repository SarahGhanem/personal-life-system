import { ReactNode } from "react";
import { NotebookPen } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
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
