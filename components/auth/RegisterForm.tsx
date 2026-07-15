"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function RegisterForm() {
  const [message, formAction, isPending] = useActionState(registerUser, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium text-ink-soft">
          Username
        </label>
        <Input id="username" name="username" autoComplete="username" required minLength={3} maxLength={32} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-soft">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      {message && <p className="animate-fade-in text-sm text-ink-soft">{message}</p>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-ink-faint">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-strong underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
