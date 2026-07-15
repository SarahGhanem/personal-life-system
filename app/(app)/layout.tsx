import { ReactNode } from "react";
import { requireUser } from "@/lib/session";
import { AppNav } from "@/components/nav/AppNav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const year = new Date().getUTCFullYear();

  return (
    <div className="min-h-screen">
      <AppNav username={user.username} year={year} />
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
