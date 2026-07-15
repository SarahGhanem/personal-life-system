import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { id: session.user.id, username: session.user.name ?? "" };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
