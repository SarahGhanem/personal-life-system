import Link from "next/link";
import { signOut } from "@/lib/auth";

export function AppNav({ username, year }: { username: string; year: number }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href={`/years/${year}`} className="font-semibold text-slate-900">
          Personal Life System
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span>{username}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="underline hover:text-slate-900">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
