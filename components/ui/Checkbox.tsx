import { InputHTMLAttributes } from "react";

export function Checkbox({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 ${className}`}
      {...props}
    />
  );
}
