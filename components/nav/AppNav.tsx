import Link from "next/link";
import { NotebookPen, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";

export function AppNav({ username, year }: { username: string; year: number }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href={`/years/${year}`}
          className="flex items-center gap-2 font-display text-lg font-semibold text-ink"
        >
          <NotebookPen className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <span className="hidden sm:inline">Personal Life System</span>
          <span className="sm:hidden">PLS</span>
        </Link>
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <span className="hidden max-w-[10rem] truncate sm:inline">{username}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-strong"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
