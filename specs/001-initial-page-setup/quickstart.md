# Quickstart: Initial Page Setup — Diot Goal Tracker

**Feature**: `001-initial-page-setup`
**Date**: 2026-03-11

---

## Prerequisites

- Node.js v18+ installed
- Repository cloned and on branch `001-initial-page-setup`
- Base Next.js app already scaffolded (package.json, tsconfig.json, app/ present)

---

## Step 1: Install shadcn/ui

```powershell
cd hello_world_2
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base colour: **Neutral** (pastel tokens override this via `@theme`)
- CSS variables: **No** (we use Tailwind v4 `@theme` instead)
- `globals.css` path: `app/globals.css`

Then add the required components:

```powershell
npx shadcn@latest add dialog button input checkbox label
```

---

## Step 2: Install date-fns

```powershell
npm install date-fns
```

---

## Step 3: Add pastel theme tokens

Add the following `@theme {}` block to `app/globals.css` (after `@import "tailwindcss"`):

```css
@theme {
  --color-pastel-mint: #bbf7d0;
  --color-pastel-sky: #bae6fd;
  --color-pastel-lavender: #ddd6fe;
  --color-pastel-peach: #fed7aa;
  --color-pastel-rose: #fecdd3;
  --color-pastel-lemon: #fef08a;
  --color-surface: #fafaf8;
  --color-card-border: #e2e8f0;
}
```

---

## Step 4: Implement source files

In order (respecting dependencies):

1. `types/goal.ts`
2. `lib/goal-storage.ts` and `lib/goal-utils.ts` (parallel)
3. `hooks/use-goals.ts`
4. `components/goal-card.tsx`, `components/goal-column.tsx`, `components/add-goal-modal.tsx` (parallel)
5. `components/goal-board.tsx`
6. `app/page.tsx` — replace placeholder with `<GoalBoard />`

See [data-model.md](data-model.md) for the `Goal` type and [contracts/ui-contracts.md](contracts/ui-contracts.md) for component props.

---

## Step 5: Run the dev server

```powershell
npm run dev
```

Open `http://localhost:3000` in a browser.

---

## Step 6: Manual verification

| # | Action | Expected result |
|---|--------|----------------|
| 1 | Page loads | Two-column layout visible; no console errors |
| 2 | Resize to 375 px | Columns stack vertically |
| 3 | Click "Add Goal", submit empty | Inline validation errors; no goal created |
| 4 | Press Escape in modal | Modal closes; no goal created |
| 5 | Add goal with end date > 3 days | Appears in Active column; no highlight |
| 6 | Add goal with end date ≤ 3 days | Appears in Active column; peach highlight |
| 7 | Add goal with past end date | Appears highlighted; shows "Overdue" |
| 8 | Check a goal's checkbox | Goal moves to Completed column |
| 9 | Click trash on active goal | Goal removed |
| 10 | Click trash on completed goal | Goal removed |
| 11 | Refresh page | All goals reappear |

---

## Step 7: Production build check

```powershell
npm run build
```

Must complete with zero TypeScript errors and zero ESLint errors.
