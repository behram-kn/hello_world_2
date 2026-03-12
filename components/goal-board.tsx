"use client";

import { useState } from "react";
import { useGoals } from "@/hooks/use-goals";
import { GoalColumn } from "@/components/goal-column";
import { AddGoalModal } from "@/components/add-goal-modal";
import { Button } from "@/components/ui/button";

export function GoalBoard() {
  const { activeGoals, completedGoals, addGoal, completeGoal, deleteGoal } = useGoals();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface px-4 py-8 sm:px-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">diot</h1>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-pastel-lemon text-gray-800 hover:bg-yellow-200 font-semibold"
        >
          + Add Goal
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <GoalColumn
          title="Active Goals"
          goals={activeGoals}
          emptyMessage="No active goals yet."
          onComplete={completeGoal}
          onDelete={deleteGoal}
        />
        <GoalColumn
          title="Completed Goals"
          goals={completedGoals}
          emptyMessage="No completed goals yet."
          onDelete={deleteGoal}
        />
      </div>

      <AddGoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addGoal}
      />
    </div>
  );
}
