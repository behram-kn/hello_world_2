export type GoalStatus = "active" | "completed";

export interface Goal {
  id: string;
  title: string;
  endDate: string; // "YYYY-MM-DD" local date
  status: GoalStatus;
  completedAt?: string; // ISO timestamp; present only when status === "completed"
  createdAt: string; // ISO timestamp
}
