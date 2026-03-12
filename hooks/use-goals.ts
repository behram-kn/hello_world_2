"use client";

import { useEffect, useState } from "react";
import type { Goal } from "@/types/goal";
import { loadGoals, saveGoals } from "@/lib/goal-storage";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const activeGoals = goals
    .filter((g) => g.status === "active")
    .sort((a, b) => a.endDate.localeCompare(b.endDate));

  const completedGoals = goals
    .filter((g) => g.status === "completed")
    .sort((a, b) => {
      const aTime = a.completedAt ?? "";
      const bTime = b.completedAt ?? "";
      return bTime.localeCompare(aTime);
    });

  function addGoal(title: string, endDate: string) {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title,
      endDate,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => {
      const updated = [newGoal, ...prev];
      saveGoals(updated);
      return updated;
    });
  }

  function completeGoal(id: string) {
    setGoals((prev) => {
      const updated = prev.map((g) =>
        g.id === id
          ? { ...g, status: "completed" as const, completedAt: new Date().toISOString() }
          : g
      );
      saveGoals(updated);
      return updated;
    });
  }

  function deleteGoal(id: string) {
    setGoals((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      saveGoals(updated);
      return updated;
    });
  }

  return { activeGoals, completedGoals, addGoal, completeGoal, deleteGoal };
}
