---
title: "<short feature or fix title>"
version: "<optional>"
date_created: "<YYYY-MM-DD>"
last_updated: "<YYYY-MM-DD>"
owner: "<owner or team>"
status: "<status>"
---

> Note: `status` must be one of: `draft`, `in-review`, `approved`, `in-progress`, `done`.
# Implementation Plan: <feature>

## Goal
Describe the user-facing goal and what success looks like.

## Requirements and Constraints
- Functional requirements
- Non-functional requirements
- Compatibility constraints (Jekyll/GitHub Pages, existing URLs, content structure)

## Architecture and Design
Describe the affected components, files, and data flow.

## SOLID Design Review
- Single Responsibility: define responsibilities per module/class and avoid mixed concerns.
- Open/Closed: identify extension points and avoid brittle modification-heavy designs.
- Liskov Substitution: preserve expected behavior when replacing abstractions.
- Interface Segregation: keep interfaces small and consumer-focused.
- Dependency Inversion: prefer dependency injection/abstractions over hard coupling.

## Tasks
- [ ] Task 1: ...
- [ ] Task 2: ...
- [ ] Task 3: ...

## Validation
- Unit tests to add or update
- Manual verification steps
- Regression checks

## TDD Strategy
- Red: list failing tests to write first.
- Green: list minimal implementation steps to satisfy tests.
- Refactor: list cleanup steps that preserve passing tests.

## Risks and Mitigations
- Risk: ...
  - Mitigation: ...

## Open Questions
- Question 1
- Question 2
