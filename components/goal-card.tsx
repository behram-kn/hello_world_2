import { Trash2 } from "lucide-react";
import type { Goal } from "@/types/goal";
import { getDaysLeft, getDaysLeftLabel, isUrgent } from "@/lib/goal-utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface GoalCardProps {
  goal: Goal;
  onComplete?: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onComplete, onDelete }: GoalCardProps) {
  const daysLeft = goal.status === "active" ? getDaysLeft(goal.endDate) : null;
  const urgent = daysLeft !== null && isUrgent(daysLeft);

  const bgClass =
    goal.status === "completed"
      ? "bg-pastel-lavender"
      : urgent
        ? "bg-pastel-peach"
        : "bg-pastel-mint";

  return (
    <div
      className={`${bgClass} rounded-xl border border-card-border p-4 flex items-start gap-3 shadow-sm`}
    >
      {goal.status === "active" && onComplete && (
        <Checkbox
          className="mt-0.5 shrink-0"
          onCheckedChange={() => onComplete(goal.id)}
          aria-label={`Mark "${goal.title}" as complete`}
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 break-words">{goal.title}</p>
        {daysLeft !== null && (
          <p className="text-sm text-gray-600 mt-0.5">{getDaysLeftLabel(daysLeft)}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-gray-500 hover:bg-pastel-rose hover:text-gray-700"
        onClick={() => onDelete(goal.id)}
        aria-label={`Delete "${goal.title}"`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
