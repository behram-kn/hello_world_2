# Research: Initial Page Setup — Diot Goal Tracker

**Feature**: `001-initial-page-setup`
**Date**: 2026-03-11
**Status**: Complete — all unknowns resolved

---

## Decision 1: UI Component Library — shadcn/ui

**Decision**: Use shadcn/ui (backed by Radix UI primitives).

**Rationale**: The feature requires an accessible modal dialog (FR-004/005), a checkbox (FR-008), and form inputs (FR-005/007). Building accessible focus-trap dialogs and form controls from scratch with plain Tailwind is prohibitively complex. shadcn provides copy-in components with zero runtime overhead that integrate natively with Tailwind v4 and Next.js App Router. User explicitly requested shadcn.

**Constitution IV compliance**: Justified — accessible dialog primitives cannot be achieved with Next.js, React, or Tailwind CSS alone without significant bespoke implementation. shadcn/ui is not a runtime dependency; components are copied into the project. Its only transitive runtime dependency is `@radix-ui/*`.

**Components required**: `Dialog`, `Button`, `Input`, `Checkbox`, `Label`.

**Alternatives considered**:
- Plain HTML `<dialog>` element — lacks consistent cross-browser focus trap and styling integration.
- Headless UI — viable but user explicitly chose shadcn.

---

## Decision 2: Date Arithmetic & Formatting — date-fns

**Decision**: Use `date-fns` v3.x.

**Rationale**: "Days left" (FR-002) must be calculated as whole calendar-day difference between local today and `endDate`. JavaScript's native `Date` arithmetic is error-prone with timezone offsets and DST. `date-fns` provides `differenceInCalendarDays` which handles this correctly. User explicitly requested date-fns.

**Constitution IV compliance**: Justified — reliable timezone-aware calendar-day arithmetic is not achievable with the existing stack without reimplementing substantial logic.

**Functions used**:
- `differenceInCalendarDays(endDate, today)` — days left / overdue delta
- `parseISO(dateString)` — parse stored `YYYY-MM-DD` strings
- `format(date, 'PP')` — human-readable end date on card (e.g., "Mar 14, 2026")

**Alternatives considered**: Native `Date` diff — rejected due to DST/tz edge cases.

---

## Decision 3: Persistence — localStorage

**Decision**: `localStorage` with key `"diot_goals"`, storing a `Goal[]` JSON array.

**Rationale**: No backend is in scope (FR-011). localStorage is universally available in the target browser environment and survives page refreshes (SC-006). Goal data is small (a list of text + dates).

**Read strategy**: Custom hook `useGoals` reads on mount; writes after every mutation. Wrapped in `try/catch` to handle private-browsing or storage-quota errors gracefully — falls back to in-memory only.

**Alternatives considered**:
- `sessionStorage` — rejected; does not survive page refresh (SC-006 violation).
- IndexedDB — overkill for a small list.

---

## Decision 4: Pastel Theme — Tailwind CSS v4 `@theme`

**Decision**: Define all pastel colour tokens in `app/globals.css` under `@theme {}` (Tailwind v4 syntax).

**Rationale**: Tailwind v4 uses `@theme` for custom design tokens instead of `tailwind.config.js`. Tokens defined here are available as utility classes (`bg-pastel-mint`, `border-pastel-rose`, etc.) with zero runtime cost.

**Token palette**:

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-pastel-mint` | `#bbf7d0` | Active goal cards (default) |
| `--color-pastel-sky` | `#bae6fd` | Page / column header accent |
| `--color-pastel-lavender` | `#ddd6fe` | Completed goal cards |
| `--color-pastel-peach` | `#fed7aa` | Urgent goal highlight (≤ 3 days) |
| `--color-pastel-rose` | `#fecdd3` | Trash icon hover accent |
| `--color-pastel-lemon` | `#fef08a` | "Add Goal" button accent |
| `--color-surface` | `#fafaf8` | Page background |
| `--color-card-border` | `#e2e8f0` | Card border (neutral) |

**Alternatives considered**: Hardcoded hex values inline — rejected as they scatter the theme and violate maintainability.

---

## Decision 5: Sort Order

- **Active goals**: ascending `endDate` (soonest deadline first — most urgent always at top).
- **Completed goals**: descending `completedAt` (most recently completed first).

---

## Decision 6: "Days Left" Edge Cases

| Scenario | Display | Highlight |
|----------|---------|-----------|
| `endDate` is past | "Overdue" | ✅ peach |
| `endDate` is today | "0 days left" | ✅ peach |
| `endDate` is 1 day away | "1 day left" (singular) | ✅ peach |
| `endDate` is 2–3 days away | "X days left" | ✅ peach |
| `endDate` > 3 days away | "X days left" | ❌ none |

---

## Decision 7: State Management

No external state library. All goal state is held in a single `useGoals` custom hook (`useState` + `useEffect` for localStorage sync). `GoalBoard` owns the hook; props are drilled to child components. The component tree is shallow enough that this is clean and avoids over-engineering.
