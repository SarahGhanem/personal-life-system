"use client";

import { useOptimistic, useTransition } from "react";
import type { GoalCategory } from "@prisma/client";
import { X } from "lucide-react";
import { addGoalItem, toggleGoalItem, deleteGoalItem } from "@/lib/actions/goals";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Goal = { id: string; title: string; isDone: boolean };
type GoalAction = { type: "toggle"; id: string; isDone: boolean } | { type: "remove"; id: string };

export function GoalCategoryChecklist({
  weekId,
  category,
  goals,
}: {
  weekId: string;
  category: GoalCategory;
  goals: Goal[];
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticGoals, applyOptimistic] = useOptimistic(goals, (state, action: GoalAction) => {
    if (action.type === "toggle") {
      return state.map((g) => (g.id === action.id ? { ...g, isDone: action.isDone } : g));
    }
    return state.filter((g) => g.id !== action.id);
  });

  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;
  const done = optimisticGoals.filter((g) => g.isDone).length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className={`flex items-center gap-1.5 text-sm font-semibold ${config.text}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
          {config.label}
        </h3>
        {optimisticGoals.length > 0 && (
          <span className="text-xs tabular-nums text-ink-faint">
            {done}/{optimisticGoals.length}
          </span>
        )}
      </div>
      <ul className="mb-2 space-y-1">
        {optimisticGoals.map((goal) => (
          <li key={goal.id} className="flex items-center gap-2">
            <Checkbox
              checked={goal.isDone}
              disabled={isPending}
              onChange={(e) => {
                const isDone = e.target.checked;
                startTransition(async () => {
                  applyOptimistic({ type: "toggle", id: goal.id, isDone });
                  await toggleGoalItem(goal.id, isDone);
                });
              }}
            />
            <span className={`flex-1 text-sm ${goal.isDone ? "text-ink-faint line-through" : "text-ink"}`}>
              {goal.title}
            </span>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  applyOptimistic({ type: "remove", id: goal.id });
                  await deleteGoalItem(goal.id);
                })
              }
              aria-label={`Remove ${goal.title}`}
              title="Remove"
              className="text-ink-faint transition-colors hover:text-danger"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <form
        action={addGoalItem}
        className="flex gap-2"
        onSubmit={(e) => {
          const form = e.currentTarget;
          requestAnimationFrame(() => form.reset());
        }}
      >
        <input type="hidden" name="weekId" value={weekId} />
        <input type="hidden" name="category" value={category} />
        <Input name="title" placeholder="Add a goal..." required className="flex-1" />
        <Button type="submit" variant="secondary" className="shrink-0">
          Add
        </Button>
      </form>
    </div>
  );
}
