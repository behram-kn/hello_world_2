# Feature Specification: Initial Page Setup — Diot Goal Tracker

**Feature Branch**: `001-initial-page-setup`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "initial page setup - this application should be a goal tracking web app called 'diot'. There should be two columns - a left one where current goals are shown along with how many days left the user has to achieve the goal, and a right one where completed goals are. Each goal can be checked using a checkbox, and then either moved to the completed column or permanently deleted. To add new goals, a user can click on a button to open a new goal form in a modal (title and end date fields). Goals reaching their end date (within 3 days) are highlighted. Use a modern light theme with fun pastel colours."

## User Scenarios & Testing

### User Story 1 — View Active and Completed Goals (Priority: P1)

A user opens the app and immediately sees two columns: **Active Goals** on the left and **Completed Goals** on the right. Each active goal card shows the goal title and how many days remain until the end date. The layout is clear, pastel-coloured, and works across mobile, tablet, and desktop.

**Why this priority**: This is the core read view of the application. Every other action depends on being able to see goals displayed in their respective columns.

**Independent Test**: Open the app with pre-seeded goals data. Verify active goals appear in the left column with day counts, and completed goals appear in the right column.

**Acceptance Scenarios**:

1. **Given** the app has active goals, **When** the page loads, **Then** each goal is shown in the left column with its title and "X days left" label.
2. **Given** the app has completed goals, **When** the page loads, **Then** each goal is shown in the right column with its title.
3. **Given** an active goal has an end date within 3 days (including today), **When** the page loads, **Then** that goal card is visually highlighted (e.g., distinct pastel accent or border).
4. **Given** an active goal's end date has already passed, **When** the page loads, **Then** the "days left" label shows 0 days (or "overdue") and the card is highlighted.

---

### User Story 2 — Add a New Goal (Priority: P2)

A user clicks an "Add Goal" button. A modal dialog opens containing a **Title** field and an **End Date** field. After filling in both fields and submitting, the modal closes and the new goal appears in the Active Goals column.

**Why this priority**: Goal creation is the primary write action. Without it the app has no data to show, making it the next most critical capability after the read view.

**Independent Test**: Open the app with an empty state, click "Add Goal", fill in title and end date, submit — verify the new goal appears in the active column with the correct day count.

**Acceptance Scenarios**:

1. **Given** the user clicks "Add Goal", **When** the modal opens, **Then** it contains a Title input and an End Date picker, and a submit button.
2. **Given** the modal is open with both fields empty, **When** the user clicks submit, **Then** validation prevents submission and shows an inline error.
3. **Given** the modal has valid title and end date, **When** the user submits, **Then** the modal closes and the new goal appears at the top of the Active Goals column with the correct days-left count.
4. **Given** the modal is open, **When** the user presses Escape or clicks outside the modal, **Then** the modal closes without creating a goal.

---

### User Story 3 — Move a Goal to Completed (Priority: P3)

A user checks the checkbox on an active goal. The goal moves from the Active Goals column to the Completed Goals column.

**Why this priority**: Checking off a goal is the primary act of progress in the app. It is lower priority than creation only because the app still delivers some value as a read-only tracker.

**Independent Test**: With at least one active goal visible, check its checkbox — verify it disappears from the active column and appears in the completed column.

**Acceptance Scenarios**:

1. **Given** an active goal is visible, **When** the user checks its checkbox, **Then** the goal moves to the Completed Goals column immediately.
2. **Given** a completed goal is visible in the right column, **When** the user views it, **Then** it no longer shows a days-left label.

---

### User Story 4 — Permanently Delete a Goal (Priority: P4)

A user clicks the trash icon on any goal card (active or completed). The goal is removed from the app entirely and does not appear in either column.

**Why this priority**: Deletion is a maintenance action. The app is usable without it; it becomes important once users accumulate stale goals.

**Independent Test**: With at least one active or completed goal visible, click its trash icon — verify it no longer appears in either column.

**Acceptance Scenarios**:

1. **Given** a goal is visible in either column, **When** the user clicks the trash icon on its card, **Then** the goal is permanently removed from both columns.
2. **Given** any goal card, **When** it is rendered, **Then** the trash icon is always visible (no hover or selection required to reveal it).

---

### Edge Cases

- What happens when there are no active goals? → Left column shows an empty state message (e.g., "No active goals yet").
- What happens when there are no completed goals? → Right column shows an empty state message (e.g., "No completed goals yet").
- What if the user submits the "Add Goal" form with a past end date? → The goal is accepted and immediately shows as highlighted (0 days / overdue) in the active column.
- What if a goal's title is very long? → Card text wraps or is truncated with ellipsis; layout is not broken.
- What if the user adds many goals? → Columns scroll independently without breaking the two-column layout.

## Requirements

### Functional Requirements

- **FR-001**: The page MUST display two columns: "Active Goals" (left) and "Completed Goals" (right).
- **FR-002**: Each active goal card MUST display the goal title and the number of days remaining until the end date.
- **FR-003**: Active goals with an end date within 3 calendar days (inclusive of today) MUST be visually highlighted.
- **FR-004**: The page MUST include an "Add Goal" button that opens a modal dialog.
- **FR-005**: The modal MUST contain a required Title text field and a required End Date date picker.
- **FR-006**: Submitting the modal with valid data MUST add the goal to the Active Goals column and close the modal.
- **FR-007**: Submitting the modal with missing or invalid data MUST prevent submission and display an inline validation error.
- **FR-008**: Each active goal MUST have a checkbox; checking it MUST move the goal to the Completed Goals column. Once completed, a goal CANNOT be moved back to active — completion is final.
- **FR-009**: Every goal card in both columns MUST display a permanently visible trash icon; clicking it MUST permanently delete that goal from the application entirely.
- **FR-010**: Empty columns MUST display a clear empty-state message.
- **FR-011**: Goal data MUST persist within the browser session (client-side state is acceptable for this feature; persistence across page reloads is in scope via localStorage).
- **FR-012**: The UI MUST use a modern light theme with pastel colours consistent with the constitution's Simple UI and Responsive Design principles.
- **FR-013**: The layout MUST be responsive across mobile (≤ 375 px), tablet (≤ 768 px), and desktop (≥ 1280 px) breakpoints; on small screens the two-column layout may stack vertically.

### Key Entities

- **Goal**: Represents a single user objective. Key attributes: unique identifier, title (string), end date (date), status (active | completed).

## Assumptions

- Goal data is stored in browser `localStorage` for persistence across page reloads; no backend or database is required for this feature.
- "Days left" is calculated as the difference in whole calendar days between today (local date) and the goal's end date; negative values are treated as 0 / overdue.
- Deletion does not require a confirmation dialog (a simple delete affordance per card is sufficient); if the constitution or a future PR demands confirmation, that can be added.
- The "Add Goal" modal is triggered by a single button; there is no inline form.
- Completed goals are shown in the right column in reverse-chronological order of completion; active goals are shown in ascending order of end date (soonest first).

## Success Criteria

### Measurable Outcomes

- **SC-001**: A user can view all their active goals with accurate day counts within 2 seconds of the page loading.
- **SC-002**: A user can add a new goal (open modal → fill fields → submit) in under 30 seconds.
- **SC-003**: Checking a goal's checkbox moves it to the completed column within 300 ms (no perceptible delay).
- **SC-004**: Goals expiring within 3 days are immediately distinguishable from other goals without additional user interaction.
- **SC-005**: The page is fully functional and visually intact at 375 px, 768 px, and 1280 px viewport widths.
- **SC-006**: Goal data survives a page refresh (persisted via localStorage).

## Clarifications

### Session 2026-03-11

- Q: Can a completed goal be moved back to active? → A: No — completion is final; no reversal is possible.
- Q: Which columns support permanent deletion? → A: Both — active and completed goals can be deleted.
- Q: How is deletion triggered on a goal card? → A: A trash icon is always visible on every card; clicking it deletes the goal immediately.
