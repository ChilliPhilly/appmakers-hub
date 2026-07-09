# AppMakers LA Onboarding Hub

A self-contained, interactive onboarding dashboard and work hub for QA / PM roles at AppMakers LA.

**Live site: https://chilliphilly.github.io/appmakers-hub/**

## What's inside

- **Home**: a personal dashboard with all your tasks (grouped by project), onboarding progress, and project status cards.
- **Onboarding**: the get-set-up checklist (accounts, access, tools) plus how the company works: time tracking, billing cutoffs, dashboards and hours, the Makers app, people, meetings, and where things live.
- **QA Job**: an ordered training course for the QA role, with completion tracking, real-world examples, and a resources page.
- **PM Job**: the same course format for the PM role, including a guide to reading and writing specs.
- **Projects**: a page per project with a lifecycle stepper (R&D, Estimates, Development, Testing, Ship), your own editable stages and epics, budget tracking, links, and stage-specific playbooks.
- **Tools**: quick links to the tools you use, with notes on where each login lives. No passwords are stored here by design, keep those in a password manager.
- **Tasks**: a pop-out tracker available on every tab. Subtasks, notes, a pending status, open/closed filters, and drag-to-reorder.

## Using it to onboard

1. Open the live site and start at **Onboarding**, work through "My onboarding sequence" and tick items as you go.
2. Move to **QA Job** and work the modules in order, marking each complete. The progress bar tells you how far you are from fully trained.
3. When you get assigned a project, its page under **Projects** is your map: what the app is, where it's up to, and what to test hardest.

## Good to know

- **Your data stays on your device.** Tasks, ticks, notes, stages, and budgets are saved in your browser's local storage. Nothing you type is uploaded anywhere, and two people using the site never see each other's data.
- That also means your data is per-browser: your phone and laptop each keep their own state, and clearing browser data resets it.
- The site is a single HTML file with no build step and no dependencies. Open `index.html` locally and it works offline.

## Maintenance

The content is maintained with Claude Code. The published page updates when new learnings, projects, or process changes are added.
