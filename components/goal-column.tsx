import type { Goal } from "@/types/goal";
import { GoalCard } from "@/components/goal-card";

interface GoalColumnProps {
  title: string;
  goals: Goal[];
  emptyMessage: string;
  onComplete?: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalColumn({ title, goals, emptyMessage, onComplete, onDelete }: GoalColumnProps) {
  return (
    <div className="flex flex-col gap-4 min-h-0">
      <h2 className="text-lg font-semibold text-gray-700 bg-pastel-sky rounded-lg px-4 py-2">
        {title}
      </h2>
      <div className="flex flex-col gap-3 overflow-y-auto pr-1">
        {goals.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{emptyMessage}</p>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
