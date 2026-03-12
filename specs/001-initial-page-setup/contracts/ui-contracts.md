# UI Contracts: Initial Page Setup — Diot Goal Tracker

**Feature**: `001-initial-page-setup`
**Date**: 2026-03-11

This document defines the public interface (props) for every component in this feature. These contracts are the boundary between components — they must remain stable across implementation.

---

## `GoalBoard`

**File**: `components/goal-board.tsx`
**Role**: Root component. Owns all state via `useGoals`. Renders the two-column layout, the Add Goal button, and the modal.

```ts
// No props — GoalBoard is a self-contained root
type GoalBoardProps = Record<string, never>;
```

**Renders**:
- Page header with app name "diot"
- "Add Goal" button (opens `AddGoalModal`)
- `GoalColumn` (active) — left
- `GoalColumn` (completed) — right
- `AddGoalModal`

---

## `GoalColumn`

**File**: `components/goal-column.tsx`
**Role**: Scrollable column displaying a list of goal cards with a heading and empty-state fallback.

```ts
interface GoalColumnProps {
  title: string;                       // Column heading e.g. "Active Goals"
  goals: Goal[];                       // Goals to render
  onComplete?: (id: string) => void;   // Only passed for the active column
  onDelete: (id: string) => void;      // Always passed
}
```

**Behaviour**:
- When `goals.length === 0`: renders an empty-state message (e.g., "No active goals yet").
- `onComplete` is omitted for the completed column — `GoalCard` hides the checkbox when this prop is absent.

---

## `GoalCard`

**File**: `components/goal-card.tsx`
**Role**: Single goal card. Shows title, days-left label (active only), checkbox (active only), and always-visible trash icon.

```ts
interface GoalCardProps {
  goal: Goal;
  onComplete?: (id: string) => void;   // Absent for completed goals; hides checkbox when omitted
  onDelete: (id: string) => void;
}
```

**Behaviour**:
- If `goal.status === "active"` and `onComplete` is provided: renders a checkbox. Checking it calls `onComplete(goal.id)`.
- If `isUrgent(daysLeft)` is true: applies peach highlight background.
- Trash icon is always visible regardless of status or hover state. Clicking it calls `onDelete(goal.id)`.
- Completed cards show no days-left label and no checkbox.

---

## `AddGoalModal`

**File**: `components/add-goal-modal.tsx`
**Role**: shadcn `Dialog` containing a controlled form for creating a new goal.

```ts
interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, endDate: string) => void;  // endDate is "YYYY-MM-DD"
}
```

**Behaviour**:
- Controlled by `open` prop — parent owns open/close state.
- Form fields: `title` (text input, required) and `endDate` (date input, required).
- On submit with valid data: calls `onAdd(title, endDate)` then `onClose()`.
- On submit with invalid data: displays inline validation errors; does not call `onAdd`.
- Pressing Escape or clicking outside the dialog: calls `onClose()` without calling `onAdd`.
- Form resets to empty on close.

---

## `useGoals` Hook

**File**: `hooks/use-goals.ts`
**Role**: Single source of truth for goal state. Syncs with localStorage.

```ts
interface UseGoalsReturn {
  activeGoals: Goal[];                              // Sorted ascending by endDate
  completedGoals: Goal[];                           // Sorted descending by completedAt
  addGoal: (title: string, endDate: string) => void;
  completeGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
}

function useGoals(): UseGoalsReturn;
```

---

## `lib/goal-storage`

**File**: `lib/goal-storage.ts`

```ts
function loadGoals(): Goal[];                 // Returns [] on error
function saveGoals(goals: Goal[]): void;      // Silently swallows storage errors
```

---

## `lib/goal-utils`

**File**: `lib/goal-utils.ts`

```ts
function getDaysLeft(endDate: string): number;        // Negative = overdue
function isUrgent(daysLeft: number): boolean;         // true when daysLeft <= 3
function getDaysLeftLabel(daysLeft: number): string;  // "Overdue" | "0 days left" | "1 day left" | "N days left"
```
