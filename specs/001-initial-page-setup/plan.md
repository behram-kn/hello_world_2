# Implementation Plan: Initial Page Setup — Diot Goal Tracker

**Branch**: `001-initial-page-setup` | **Date**: 2026-03-11 | **Spec**: [spec.md](spec.md)

## Summary

Build the full UI for the Diot goal-tracking web app inside the existing Next.js 16 / React 19 / Tailwind 4 workspace. The page displays two columns — Active Goals (left) and Completed Goals (right) — with goal cards, a checkbox-to-complete flow, always-visible delete icons, and an Add Goal modal. All state is client-side via a custom `useGoals` hook persisted to `localStorage`. New dependencies: shadcn/ui (accessible dialog primitives) and date-fns (calendar-day arithmetic).

## Technical Context

**Language/Version**: TypeScript 5, targeting Next.js App Router  
**Primary Dependencies**: Next.js 16.1.6, React 19.2.4, Tailwind CSS 4.2.1, shadcn/ui (Radix UI primitives), date-fns v3  
**Storage**: Browser `localStorage` (key: `"diot_goals"`, value: `Goal[]` JSON array)  
**Testing**: N/A — Constitution V prohibits all automated tests  
**Target Platform**: Browser (web app)  
**Project Type**: Web application (single page, client-side state)  
**Performance Goals**: Page load with goal list under 2 seconds; state mutations perceptible within 300 ms  
**Constraints**: No backend, no external APIs, no test libraries  
**Scale/Scope**: Single page; goal list expected to be small (tens of items)

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | ✅ | Single-responsibility components; descriptive names throughout |
| II. Simple UI | ✅ | Minimal shadcn primitives; plain-English copy; no decorative layers |
| III. Responsive Design | ✅ | Mobile-first Tailwind; two columns stack vertically on `sm:` breakpoint |
| IV. Minimal Dependencies | ✅ justified | shadcn/ui: accessible Dialog focus-trap not achievable with existing stack. date-fns: reliable `differenceInCalendarDays` across DST not achievable natively. Both user-specified with written justification in `research.md`. |
| V. No Testing | ✅ | No test files, no test directories, no testing libraries added |

## Project Structure

```text
hello_world_2/
├── app/
│   ├── globals.css          # Add @theme {} pastel token block
│   ├── layout.tsx           # Existing — no changes
│   └── page.tsx             # Replace placeholder with <GoalBoard />
├── types/
│   └── goal.ts              # Goal interface + GoalStatus type [NEW]
├── lib/
│   ├── goal-storage.ts      # loadGoals() / saveGoals() localStorage helpers [NEW]
│   └── goal-utils.ts        # getDaysLeft(), isUrgent(), getDaysLeftLabel() [NEW]
├── hooks/
│   └── use-goals.ts         # useGoals() — state + mutations + localStorage sync [NEW]
├── components/
│   ├── goal-board.tsx       # Two-column layout; owns useGoals [NEW]
│   ├── goal-column.tsx      # Scrollable column with title + empty-state [NEW]
│   ├── goal-card.tsx        # Goal card with checkbox, days-left, trash icon [NEW]
│   ├── add-goal-modal.tsx   # shadcn Dialog with form + validation [NEW]
│   └── ui/                  # shadcn generated: Button, Checkbox, Dialog, Input, Label
└── specs/
    └── 001-initial-page-setup/
        ├── spec.md
        ├── plan.md          # This file
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        └── contracts/
            └── ui-contracts.md
```

**Structure Decision**: Single Next.js project at repository root with App Router. No separate frontend/backend split needed — app is fully client-side. Components are co-located flat under `/components/` (no subdirectories needed at this scale).

## Decisions

- **shadcn/ui** — Dialog, Button, Input, Checkbox, Label. Justified: accessible focus-trap dialog cannot be built from Next.js / React / Tailwind alone without significant bespoke implementation.
- **date-fns** — `differenceInCalendarDays`, `parseISO`, `format`. Justified: reliable calendar-day arithmetic across DST edge cases is not in the existing stack.
- **localStorage key** — `"diot_goals"`, `Goal[]` JSON array. Read on mount, written after every mutation. Errors fall back to in-memory only.
- **Sort orders** — Active: ascending `endDate` (soonest deadline first). Completed: descending `completedAt` (most recent first).
- **Urgency threshold** — `daysLeft <= 3` (includes today = 0 and overdue = negative).
- **State management** — Single `useGoals` hook in `GoalBoard`; props drilled to children. No external state library.
- **Pastel theme** — Defined via `@theme {}` in `app/globals.css` (Tailwind v4 syntax).

## Pastel Token Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-pastel-mint` | `#bbf7d0` | Active goal cards (default) |
| `--color-pastel-sky` | `#bae6fd` | Page / column header accent |
| `--color-pastel-lavender` | `#ddd6fe` | Completed goal cards |
| `--color-pastel-peach` | `#fed7aa` | Urgent highlight (≤ 3 days / overdue) |
| `--color-pastel-rose` | `#fecdd3` | Trash icon hover accent |
| `--color-pastel-lemon` | `#fef08a` | "Add Goal" button accent |
| `--color-surface` | `#fafaf8` | Page background |

## Data Model

```ts
// types/goal.ts
export type GoalStatus = "active" | "completed";

export interface Goal {
  id: string;           // crypto.randomUUID()
  title: string;        // non-empty, max 200 chars
  endDate: string;      // "YYYY-MM-DD" local date
  status: GoalStatus;
  completedAt?: string; // ISO timestamp — present only when status === "completed"
  createdAt: string;    // ISO timestamp
}
```

State transitions:
- **CREATE** → `status: "active"`, `completedAt: undefined`
- **COMPLETE** (checkbox) → `status: "completed"`, `completedAt: <now>` — irreversible
- **DELETE** (trash icon) → goal removed from array — applies to any status

## UI Component Contracts

| Component | Props |
|-----------|-------|
| `GoalBoard` | `{}` — owns all state via `useGoals` |
| `GoalColumn` | `{ title: string; goals: Goal[]; onComplete?: (id) => void; onDelete: (id) => void }` |
| `GoalCard` | `{ goal: Goal; onComplete?: (id) => void; onDelete: (id) => void }` |
| `AddGoalModal` | `{ open: boolean; onClose: () => void; onAdd: (title: string, endDate: string) => void }` |

## Implementation Phases

### Phase 0: Dependencies & Theme *(prerequisite — complete before all other phases)*

1. Init shadcn/ui: `npx shadcn@latest init`
2. Add components: `npx shadcn@latest add dialog button input checkbox label`
3. Install date-fns: `npm install date-fns`
4. Add `@theme {}` pastel token block to `app/globals.css`

### Phase 1: Types, Storage & Utils *(parallel — no inter-dependencies)*

5. [P] `types/goal.ts`
6. [P] `lib/goal-storage.ts`
7. [P] `lib/goal-utils.ts`

### Phase 2: Custom Hook *(depends on 5, 6, 7)*

8. `hooks/use-goals.ts`

### Phase 3: Components *(9–11 parallel; 12 depends on all three)*

9. [P] `components/goal-card.tsx`
10. [P] `components/goal-column.tsx`
11. [P] `components/add-goal-modal.tsx`
12. `components/goal-board.tsx`

### Phase 4: Wire Up *(depends on 12)*

13. Update `app/page.tsx`
14. Update `app/globals.css` with `@theme {}` block

### Phase 5: Spec Artifacts *(parallel — no code dependencies)*

15. [P] `specs/001-initial-page-setup/research.md`
16. [P] `specs/001-initial-page-setup/data-model.md`
17. [P] `specs/001-initial-page-setup/contracts/ui-contracts.md`
18. `specs/001-initial-page-setup/quickstart.md`

## Verification Checklist

1. `npm run dev` — page loads at `localhost:3000` with no console errors
2. Layout renders correctly at 375 px, 768 px, 1280 px viewports (columns stack on mobile)
3. Add a goal → appears in Active column with correct days-left count
4. Add a goal with end date ≤ 3 days away → card shows peach highlight
5. Check a goal's checkbox → moves to Completed column immediately; no days-left label shown
6. Click trash icon on an active goal → removed from page
7. Click trash icon on a completed goal → removed from page
8. Refresh page → all goals reappear (localStorage persistence confirmed)
9. Submit modal with empty fields → inline validation errors; no goal created
10. Press Escape in modal → closes without creating a goal
11. `npm run build` → zero TypeScript errors, zero ESLint errors
