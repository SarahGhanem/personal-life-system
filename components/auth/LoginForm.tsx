"use client";

import { useActionState } from "react";
import Link from "next/link";
import { authenticate } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium text-ink-soft">
          Username
        </label>
        <Input id="username" name="username" autoComplete="username" required />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-soft">
          Password
        </label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {errorMessage && <p className="animate-fade-in text-sm text-danger">{errorMessage}</p>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-center text-sm text-ink-faint">
        No account?{" "}
        <Link href="/register" className="font-medium text-accent-strong underline">
          Register
        </Link>
      </p>
    </form>
  );
}
