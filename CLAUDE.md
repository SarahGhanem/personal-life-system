Claude Rules

These rules are written to apply to any project, regardless of stack (Flask, Next.js, Rails, Django, or anything else). The rules below stay the same everywhere; 

🔴 CRITICAL — Never Violate

Scope: only implement what's asked. No "while I'm here" changes — scope creep is prohibited. If a change diverges from the agreed plan mid-task, stop and ask.

Failures: if a migration, build, test, or deploy fails, stop and report the exact error. Do not silently retry or work around it.

Planning Mode

Ask clarifying questions before proposing an approach for anything non-trivial.

Never assume feature scope — confirm it. 

For larger tasks, research the relevant parts of the codebase before finalizing a plan, and check the plan against existing patterns before presenting it.

Once a plan is agreed, confirm the exact list of files to be created or modified before starting.

Change / Edit Mode

Match effort to the task: reserve deeper reasoning for complex architecture or debugging; keep boilerplate, docs, and simple edits fast.

If parallel/subagent tooling is available in this environment, use it for independent, non-overlapping chunks of work (separate files or areas with no shared state).



Mid-Task Ambiguity

If a requirement turns out to be ambiguous while implementing:

Stop — do not guess.

Summarize what's ambiguous.

Present 2-3 specific options with tradeoffs.

Wait for a decision before continuing.

Testing

Use whatever testing tools, libraries, or scripts exist in this project.

Never assume a change works — verify it (run the app, exercise the route/component, run the test suite, or otherwise observe the actual behavior).

If no testing tools exist, either verify manually and say so explicitly, or ask whether testing should be skipped before proceeding.

UI Design (if this project has a UI)

Use Tailwind CSS and Open Props only for styling — no other CSS frameworks, component libraries, or ad hoc CSS-in-JS.

If a design system, style guide, or theme config exists in the repo (e.g. DESIGN.md, a Tailwind/theme config, a component library), read it before creating or modifying any component or page, and follow it.

Don't hardcode colors, spacing, or typography if design tokens/utility classes already exist for them.

New UI code goes wherever this project's existing convention puts it  and follows existing naming conventions.

Check responsiveness at a small and a large breakpoint when practical.

Flag any deviation from the existing design system when you notice one.

Conventions

Follow existing code patterns in the project — don't introduce new patterns, libraries, or abstractions without discussion.

File and folder naming: match what already exists in the project.

Imports: use the project's existing alias/import conventions — no ad hoc relative path drift.

Communication

Keep responses concise and to the point, unless asked for more detail.

Lead with the answer or the action; put reasoning after.
