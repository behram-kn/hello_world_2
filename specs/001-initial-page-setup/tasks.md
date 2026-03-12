# Tasks: Initial Page Setup — Diot Goal Tracker

**Input**: Design documents from `specs/001-initial-page-setup/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ui-contracts.md ✅ | quickstart.md ✅
**Tests**: None — Constitution V prohibits all automated tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Setup

**Purpose**: Install dependencies and configure the theme. Must be complete before all other phases.

- [ ] T001 Init shadcn/ui by running `npx shadcn@latest init` — choose `app/globals.css`, no CSS variables
- [ ] T002 Add shadcn components by running `npx shadcn@latest add dialog button input checkbox label` — generates `components/ui/`
- [ ] T003 Install date-fns by running `npm install date-fns`
- [ ] T004 Add `@theme {}` pastel token block to `app/globals.css` — tokens: `--color-pastel-mint`, `--color-pastel-sky`, `--color-pastel-lavender`, `--color-pastel-peach`, `--color-pastel-rose`, `--color-pastel-lemon`, `--color-surface`, `--color-card-border` (see plan.md for hex values)

---

## Phase 2: Foundational

**Purpose**: Core types, storage helpers, and date utilities that every user story depends on. Must be complete before any user story phase begins.

- [ ] T005 [P] Create `types/goal.ts` — export `GoalStatus = "active" | "completed"` and `Goal` interface with fields: `id`, `title`, `endDate`, `status`, `completedAt?`, `createdAt` (see data-model.md)
- [ ] T006 [P] Create `lib/goal-storage.ts` — export `loadGoals(): Goal[]` (reads `"diot_goals"` from localStorage, returns `[]` on error) and `saveGoals(goals: Goal[]): void` (JSON-stringify, swallows errors)
- [ ] T007 [P] Create `lib/goal-utils.ts` — export `getDaysLeft(endDate: string): number` using `differenceInCalendarDays` + `parseISO` from date-fns; `isUrgent(daysLeft: number): boolean` (returns `daysLeft <= 3`); `getDaysLeftLabel(daysLeft: number): string` (returns "Overdue" / "0 days left" / "1 day left" / "N days left")

**Checkpoint**: Foundation ready — user story phases can now proceed.

---

## Phase 3: User Story 1 — View Active and Completed Goals (Priority: P1) 🎯 MVP

**Goal**: Render the two-column layout with goal cards showing title, days-left label, and urgent highlighting. Completed goals shown separately with no days-left label.

**Independent Test**: Seed `localStorage["diot_goals"]` with a mix of active and completed goals (including one with end date ≤ 3 days). Load the page and verify both columns render correctly with appropriate highlights.

### Implementation for User Story 1

- [ ] T008 [P] [US1] Create `hooks/use-goals.ts` — export `useGoals()` hook: reads `loadGoals()` on mount via `useEffect`; holds `goals: Goal[]` in `useState`; exposes `activeGoals` (filtered + sorted ascending `endDate`) and `completedGoals` (filtered + sorted descending `completedAt`); exposes `addGoal`, `completeGoal`, `deleteGoal` mutations (stubs for now — implement in US2–US4 phases); calls `saveGoals` after every state mutation
- [ ] T009 [P] [US1] Create `components/goal-card.tsx` — renders a card with: goal `title`; days-left label (active goals only, using `getDaysLeftLabel`); peach background (`bg-pastel-peach`) when `isUrgent` is true; mint background (`bg-pastel-mint`) for normal active cards; lavender background (`bg-pastel-lavender`) for completed cards; always-visible trash icon button calling `onDelete(goal.id)`; checkbox (active goals only, when `onComplete` prop present) calling `onComplete(goal.id)` on change — props: `{ goal: Goal; onComplete?: (id: string) => void; onDelete: (id: string) => void }`
- [ ] T010 [P] [US1] Create `components/goal-column.tsx` — renders a titled scrollable column; maps `goals` to `<GoalCard>` components; shows empty-state message when `goals.length === 0`; passes `onComplete` (only for active column) and `onDelete` through to `GoalCard` — props: `{ title: string; goals: Goal[]; onComplete?: (id: string) => void; onDelete: (id: string) => void }`
- [ ] T011 [US1] Create `components/goal-board.tsx` — owns `useGoals()`; renders page header with "diot" app name; renders `<GoalColumn>` for active goals (left) and `<GoalColumn>` for completed goals (right); passes `completeGoal` as `onComplete` to active column only; passes `deleteGoal` as `onDelete` to both columns; includes "Add Goal" button placeholder (no modal yet)
- [ ] T012 [US1] Update `app/page.tsx` — replace placeholder content with `<GoalBoard />`

**Checkpoint**: US1 complete — two-column layout renders with seeded data, urgent highlighting works, page is responsive.

---

## Phase 4: User Story 2 — Add a New Goal (Priority: P2)

**Goal**: "Add Goal" button opens a modal with Title and End Date fields. Valid submission creates a goal in the active column; invalid submission shows inline errors.

**Independent Test**: Open the app, click "Add Goal", submit with empty fields → errors shown. Fill both fields, submit → modal closes, new goal appears in Active column with correct days-left count.

### Implementation for User Story 2

- [ ] T013 [US2] Create `components/add-goal-modal.tsx` — shadcn `Dialog` component; controlled by `open` prop; contains a form with: `title` text `Input` (required, max 200 chars) with inline error when empty; `endDate` `input[type="date"]` (required) with inline error when empty; submit `Button`; on valid submit calls `onAdd(title, endDate)` then `onClose()`; on invalid submit shows inline errors without calling `onAdd`; Escape / outside-click calls `onClose()` via Dialog's `onOpenChange`; form state resets to empty on close — props: `{ open: boolean; onClose: () => void; onAdd: (title: string, endDate: string) => void }`
- [ ] T014 [US2] Implement `addGoal` in `hooks/use-goals.ts` — creates a new `Goal` with `crypto.randomUUID()` id, `status: "active"`, `createdAt: new Date().toISOString()`, provided `title` and `endDate`; prepends to goals array; calls `saveGoals`
- [ ] T015 [US2] Wire `AddGoalModal` into `components/goal-board.tsx` — add `modalOpen` state; "Add Goal" button sets `modalOpen = true`; render `<AddGoalModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addGoal} />`

**Checkpoint**: US2 complete — users can add goals via the modal; new goals appear in the active column with correct days-left.

---

## Phase 5: User Story 3 — Move a Goal to Completed (Priority: P3)

**Goal**: Checking the checkbox on an active goal card moves it to the Completed Goals column immediately. Completed goals have no checkbox and no days-left label.

**Independent Test**: With at least one active goal visible, check its checkbox — verify it disappears from the Active column and appears in the Completed column with no days-left label.

### Implementation for User Story 3

- [ ] T016 [US3] Implement `completeGoal` in `hooks/use-goals.ts` — finds the goal by `id`; sets `status: "completed"` and `completedAt: new Date().toISOString()`; replaces the goal in the array; calls `saveGoals`
- [ ] T017 [US3] Verify `goal-card.tsx` checkbox — confirm `onComplete` prop triggers on checkbox `onChange`; completed `GoalCard` renders with lavender background, no checkbox, no days-left label (already handled by US1 implementation — mark done if correct)

**Checkpoint**: US3 complete — checking a goal's checkbox moves it to the Completed column immediately; completion is irreversible.

---

## Phase 6: User Story 4 — Permanently Delete a Goal (Priority: P4)

**Goal**: Clicking the always-visible trash icon on any goal card (active or completed) permanently removes the goal from both columns.

**Independent Test**: With at least one active and one completed goal visible, click the trash icon on each — verify both are removed from the page.

### Implementation for User Story 4

- [ ] T018 [US4] Implement `deleteGoal` in `hooks/use-goals.ts` — filters the goal with matching `id` out of the goals array; calls `saveGoals`
- [ ] T019 [US4] Verify `goal-card.tsx` trash icon — confirm trash icon `onClick` calls `onDelete(goal.id)` and is always visible on every card regardless of status (already handled by US1 implementation — mark done if correct)

**Checkpoint**: US4 complete — trash icon on any card permanently removes the goal.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, empty states, edge cases, and production build validation.

- [ ] T020 Verify two-column layout stacks vertically on mobile — `goal-board.tsx` uses `flex-col sm:flex-row` (or equivalent Tailwind responsive classes); test at 375 px viewport
- [ ] T021 Verify empty-state messages render in both columns when no goals exist — "No active goals yet" and "No completed goals yet"
- [ ] T022 Verify long goal titles wrap or truncate gracefully in `goal-card.tsx` without breaking card layout — add `truncate` or `line-clamp` Tailwind class if needed
- [ ] T023 Verify `app/globals.css` has `@import "tailwindcss"` as the first line followed by the `@theme {}` pastel token block — fix ordering if incorrect
- [ ] T024 Run `npm run build` and resolve all TypeScript and ESLint errors — zero errors required before feature is considered complete

---

## Dependencies

```
T001 → T002 → T003 → T004
                         ↓
              T005, T006, T007 (parallel)
                         ↓
              T008, T009, T010 (parallel)
                         ↓
                       T011
                         ↓
                       T012  ← US1 complete
                         ↓
                       T013
                         ↓
                  T014, T015
                         ↓  ← US2 complete
                       T016
                         ↓
                       T017  ← US3 complete
                         ↓
                  T018, T019  ← US4 complete
                         ↓
              T020–T024 (polish, parallel)
```

## Parallel Execution Examples

**Phase 2** (after T004): T005, T006, T007 can all run simultaneously.

**Phase 3** (after T007): T008, T009, T010 can all run simultaneously.

**Phase 7** (after T024 prerequisite): T020, T021, T022, T023 can all run simultaneously before T024.

## Implementation Strategy

- **MVP**: Complete Phase 1 + Phase 2 + Phase 3 (US1) → working two-column read view with seeded data.
- **Increment 2**: Phase 4 (US2) → users can add goals.
- **Increment 3**: Phase 5 (US3) → users can complete goals.
- **Increment 4**: Phase 6 (US4) → users can delete goals.
- **Done**: Phase 7 (Polish) + T024 build check passes.

## Summary

| Phase | User Story | Tasks | Parallel |
|-------|-----------|-------|---------|
| Setup | — | T001–T004 | — |
| Foundational | — | T005–T007 | T005, T006, T007 |
| US1 (P1) | View Goals | T008–T012 | T008, T009, T010 |
| US2 (P2) | Add Goal | T013–T015 | — |
| US3 (P3) | Complete Goal | T016–T017 | — |
| US4 (P4) | Delete Goal | T018–T019 | T018, T019 |
| Polish | — | T020–T024 | T020–T023 |
| **Total** | | **24 tasks** | **9 parallel** |
