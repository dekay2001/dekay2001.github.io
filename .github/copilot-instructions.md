# GitHub Copilot Instructions

Use these files as the primary source of truth for this repository:

- [Product goals and user experience](../PRODUCT.md)
- [Architecture and system boundaries](../ARCHITECTURE.md)
- [Contributing workflow and coding rules](../CONTRIBUTING.md)

## Agent Workflow

- Planning template: [plan-template.md](../plan-template.md)
- Planning agent: [dekay-plan.agent.md](agents/dekay-plan.agent.md)
- Planning prompt: [plan-qna.prompt.md](prompts/plan-qna.prompt.md)
- Implementation agent: [dekay-implement.agent.md](agents/dekay-implement.agent.md)

Use planning-first workflow for non-trivial work:
1. Create or refine a plan with the planning agent.
2. Review and resolve open questions.
3. Handoff to implementation agent for execution.

## Repository Quick Facts

- Stack: Jekyll + GitHub Pages + Liquid + ES6 JavaScript.
- JavaScript tests: Jest/Babel.
- Blog pagination currently configured as 10 posts per page.
- Deployment target branch remains `master`.

## Non-Negotiable Constraints

- Preserve GitHub Pages compatibility.
- Keep changes focused and minimal.
- Avoid unrelated refactors.
- Update linked docs when they are incomplete or conflicting.
