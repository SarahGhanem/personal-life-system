"use client";

import { useOptimistic, useTransition } from "react";
import { addGoalItem, toggleGoalItem, deleteGoalItem } from "@/lib/actions/goals";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Goal = { id: string; title: string; isDone: boolean };
type GoalAction = { type: "toggle"; id: string; isDone: boolean } | { type: "remove"; id: string };

const CATEGORY_LABELS: Record<string, string> = {
  HEALTH: "Health",
  CAREER: "Career",
  PERSONAL: "Personal",
  SOCIAL: "Social",
};

export function GoalCategoryChecklist({
  weekId,
  category,
  goals,
}: {
  weekId: string;
  category: string;
  goals: Goal[];
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticGoals, applyOptimistic] = useOptimistic(goals, (state, action: GoalAction) => {
    if (action.type === "toggle") {
      return state.map((g) => (g.id === action.id ? { ...g, isDone: action.isDone } : g));
    }
    return state.filter((g) => g.id !== action.id);
  });

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{CATEGORY_LABELS[category]}</h3>
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
            <span className={`flex-1 text-sm ${goal.isDone ? "text-slate-400 line-through" : "text-slate-800"}`}>
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
              className="text-xs text-slate-400 hover:text-red-600"
            >
              Remove
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
