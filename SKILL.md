# UI/UX Designer Skill

## Purpose
Provide a reusable, workspace-scoped UI/UX design workflow for product teams, designers, and engineers working on the SkillSwap app (or similar React-powered frontends).

## When to use
- Starting a new feature or page in the app
- Improving the UX of an existing flow (auth, matching, profile, onboarding)
- Translating stakeholder requirements into UI deliverables
- Preparing usability test artifacts and implementation handoff

## Outputs
1. Product / user problem statement
2. User personas and journey maps
3. Low-fidelity wireframes and information architecture
4. High-fidelity mockups/prototypes and interaction specs
5. Usability test plan, results, and iteration actions
6. Frontend implementation checklist with acceptance criteria

## Workflow
1. Understand the problem
   - Gather goals, constraints, metrics, and edge cases.
   - Identify existing data (analytics, support tickets, user feedback).
   - Validate with stakeholders and PM(s).

2. Define users and scenarios
   - Create 2-3 primary persona profiles.
   - List key user goals and pain points for each persona.
   - Outline user journey for the targeted flow (entry -> task -> exit).

3. Map information architecture
   - Audit existing screens/components in `src/pages`, `src/components`.
   - Create a site/page flow diagram with screen states.
   - Decide where to add or update features (cards, filters, forms).

4. Design wireframes
   - Produce low-fi sketches (digital or paper) for core screens.
   - Review for accessibility, clarity, and progressive disclosure.
   - Iterate quickly with reviewers before moving to visual design.

5. Build visual design/prototype
   - Apply brand system (colors, fonts, spacing, iconography).
   - Use design tokens in code (existing CSS variables or component tokens).
   - Capture states: normal, hover, focus, disabled, error.
   - Create interactive prototype for critical path (e.g., match creation, profile editing).

6. Validate with users
   - Prepare test script and recruitment criteria.
   - Observe 5-8 users performing tasks; note friction and confusion.
   - Synthesize insights into prioritized UI updates.

7. Handoff and implementation
   - Deliver final artifacts: annotated screens, component spec, spacing/grid rules.
   - Provide developer notes for CSS/React updates and accessibility.
   - Define acceptance criteria with functional and non-functional checks.

8. Review completion
   - Confirm UX metrics (task success, time-on-task, NPS change).
   - Ensure cross-team review (design, product, engineering, QA).

## Decision branches
- If existing UI already meets baseline but data indicates issue: run targeted usability testing before full redesign.
- For unknown user problems: start with discovery sprint and lightweight prototypes.
- If tight timeline: prioritize first the minimal viable experience (MVE) path and deferred enhancements.

## Quality criteria
- Clear user goal alignment and measurable success criteria
- Compliant with WCAG 2.1 AA (expand when needed)
- Responsive behavior for mobile + desktop
- Minimized cognitive load for core task
- Documented tradeoffs and design rationale

## Suggested prompts (for Copilot Chat use)
- "Use the UI/UX Designer Skill to propose a redesign of the SkillSwap matching flow based on these goals..."
- "Create persona summaries and wireframes for a new skill-sharing onboarding experience."
- "Review this React component tree and suggest improved UX patterns and accessibility updates."

---

> Note: This file is a reusable step-by-step design workflow template. Adjust step-specific details for your product domain and team handoff process.
