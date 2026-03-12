# Data Model: Initial Page Setup — Diot Goal Tracker

**Feature**: `001-initial-page-setup`
**Date**: 2026-03-11

---

## Entity: Goal

The sole data entity in this feature. Stored as a JSON array in `localStorage` under the key `"diot_goals"`.

### Fields

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `id` | `string` | ✅ | Non-empty, globally unique | Generated via `crypto.randomUUID()` on creation |
| `title` | `string` | ✅ | Non-empty, max 200 characters | User-entered goal title |
| `endDate` | `string` | ✅ | ISO date `YYYY-MM-DD`, valid calendar date | Local date; no time component stored |
| `status` | `"active" \| "completed"` | ✅ | One of two values | `"active"` on creation; transitions to `"completed"` on checkbox (irreversible) |
| `completedAt` | `string \| undefined` | — | ISO 8601 timestamp | Set when status → `"completed"`; absent on active goals |
| `createdAt` | `string` | ✅ | ISO 8601 timestamp | Set at creation time |

### TypeScript Type

```ts
// types/goal.ts
export type GoalStatus = "active" | "completed";

export interface Goal {
  id: string;
  title: string;
  endDate: string;       // "YYYY-MM-DD" local date
  status: GoalStatus;
  completedAt?: string;  // ISO timestamp; present only when status === "completed"
  createdAt: string;     // ISO timestamp
}
```

---

## State Transitions

```
[CREATE]
  → status: "active"
  → completedAt: undefined

[COMPLETE]  (checkbox — irreversible)
  status: "active"  →  status: "completed"
  completedAt: undefined  →  completedAt: new Date().toISOString()

[DELETE]  (trash icon — any status)
  Goal removed from array entirely
```

---

## Derived Values (computed at render time, not stored)

| Derived | Source fields | Computation |
|---------|--------------|-------------|
| `daysLeft` | `goal.endDate`, current date | `differenceInCalendarDays(parseISO(goal.endDate), startOfDay(new Date()))` |
| `isUrgent` | `daysLeft` | `daysLeft <= 3` |
| `daysLeftLabel` | `daysLeft` | `< 0 → "Overdue"` / `0 → "0 days left"` / `1 → "1 day left"` / `N → "N days left"` |

---

## Validation Rules

| Field | Rule | Error message |
|-------|------|---------------|
| `title` | Must not be empty after trimming | "Title is required" |
| `endDate` | Must be a valid calendar date string | "A valid end date is required" |

Past end dates are accepted without error — goals can be created for already-overdue scenarios and will appear highlighted.

---

## localStorage Schema

```
Key:   "diot_goals"
Value: JSON-stringified Goal[] array

Example:
[
  {
    "id": "a1b2c3d4-e5f6-...",
    "title": "Run a 5K",
    "endDate": "2026-03-14",
    "status": "active",
    "createdAt": "2026-03-11T09:00:00.000Z"
  },
  {
    "id": "b2c3d4e5-f6a7-...",
    "title": "Read 12 books",
    "endDate": "2026-12-31",
    "status": "completed",
    "completedAt": "2026-03-10T14:30:00.000Z",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

**Error handling**: If `localStorage.getItem("diot_goals")` throws or returns invalid JSON, fall back to `[]` and continue in-memory only.
