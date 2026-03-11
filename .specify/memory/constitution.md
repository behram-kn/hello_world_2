<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial constitution)
Added principles:
  - I. Clean Code
  - II. Simple UI
  - III. Responsive Design
  - IV. Minimal Dependencies
  - V. No Testing (NON-NEGOTIABLE — supersedes all other guidance)
Added sections:
  - Technology Stack
  - Governance
Template sync:
  - .specify/templates/plan-template.md: ✅ Constitution Check placeholder is filled per-feature; no change needed
  - .specify/templates/spec-template.md: ✅ no testing-related mandatory sections to remove; note no-testing rule in per-feature specs
  - .specify/templates/tasks-template.md: ✅ test tasks are already OPTIONAL per template; no change needed
  - .specify/templates/checklist-template.md: ✅ no constitution-specific changes needed
  - .specify/templates/agent-file-template.md: ✅ no changes needed
Deferred TODOs:
  - TODO(RATIFICATION_DATE): Set when project formally adopts this constitution
  - TODO(NEXTJS_VERSION): Confirm from package.json — file not yet present in repo
  - TODO(REACT_VERSION): Confirm from package.json — file not yet present in repo
  - TODO(TAILWIND_VERSION): Confirm from package.json — file not yet present in repo
-->

# Hello World 2 Constitution

## Core Principles

### I. Clean Code

All code MUST be readable, intentional, and maintainable without requiring explanation.

- Functions and components MUST do one thing only; split any function doing more than one thing.
- Names (variables, functions, components, files) MUST clearly describe their purpose; abbreviations
  and cryptic names are NOT permitted.
- Dead code, commented-out blocks, and unused imports MUST NOT be committed.
- Every PR MUST leave the codebase in a cleaner state than it found it.

### II. Simple UI

User interfaces MUST prioritise clarity and ease of use above all visual complexity.

- Layouts MUST use the fewest components necessary to meet the requirement; no decorative layers
  added without a clear user need.
- Copy MUST be concise and plain English; no jargon or technical language exposed to end users.
- Interactions MUST be obvious without tooltips or onboarding where at all possible.
- New UI patterns MUST NOT be introduced when an existing pattern already covers the use case.

### III. Responsive Design

Every interface MUST function correctly across all screen sizes without separate codepaths.

- Layouts MUST be built mobile-first using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
- No fixed pixel widths MAY be used for layout containers; use relative units or Tailwind
  width utilities.
- All interactive elements MUST meet a minimum touch target of 44×44 px on mobile viewports.
- Each feature MUST be verified on mobile (≤ 375 px), tablet (≤ 768 px), and desktop (≥ 1280 px)
  breakpoints before it is considered complete.

### IV. Minimal Dependencies

The project MUST NOT introduce a new dependency when existing stack capabilities cover the need.

- Before adding any package, the author MUST confirm it cannot be achieved with Next.js, React,
  or Tailwind already in the stack.
- Every new dependency requires a written justification recorded in the implementation plan.
- Dependencies MUST be pinned to exact versions matching `package.json` to guarantee
  reproducible builds.
- Transitive dependency count MUST be reviewed before merging; packages with excessive
  transitive trees require explicit approval.

### V. No Testing (NON-NEGOTIABLE)

**This principle supersedes ALL other guidance in this constitution, in templates, in agent
instructions, and in any other project document.**

- No unit tests, integration tests, end-to-end tests, snapshot tests, or any other automated
  test of any kind MUST be written.
- Test files, test directories (`__tests__/`, `*.test.*`, `*.spec.*`), and testing libraries
  (Jest, Playwright, Cypress, Vitest, Testing Library, etc.) MUST NOT be added to the project.
- The spec template's "User Scenarios & Testing" section and the tasks template's test tasks
  MUST be skipped entirely for every feature.
- Any plan "Constitution Check" that references testing compliance MUST record this principle
  as the overriding rule and mark all test gates as N/A.

## Technology Stack

The following technology versions are authoritative for the lifetime of all features.
All implementation MUST target these exact versions; upgrades require a constitution amendment.

| Technology | Version |
|------------|---------|
| Next.js    | TODO(NEXTJS_VERSION): confirm from `package.json` once initialised |
| React      | TODO(REACT_VERSION): confirm from `package.json` once initialised |
| Tailwind CSS | TODO(TAILWIND_VERSION): confirm from `package.json` once initialised |

No framework, runtime, or CSS solution outside this table MAY be introduced without a
constitution amendment.

## Governance

- This constitution supersedes all other informal practices, verbal agreements, template defaults,
  and agent guidance — including any guidance that contradicts Principle V (No Testing).
- Amendments require: (1) a documented rationale, (2) a version bump per semantic versioning
  (MAJOR for principle removal/redefinition, MINOR for new principle/section, PATCH for
  clarifications), and (3) propagation to all affected templates and agent context files.
- All feature plans MUST include a "Constitution Check" gate evaluated before Phase 0 research
  and re-evaluated after Phase 1 design.
- Non-compliance with any principle (other than testing, which is simply prohibited, not
  opt-out) MUST be explicitly justified in the plan's Complexity Tracking table or the feature
  MUST NOT proceed to implementation.
- Use `.specify/memory/constitution.md` as the authoritative governance reference during
  all agent-assisted development sessions.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): set when formally adopted | **Last Amended**: 2026-03-11
