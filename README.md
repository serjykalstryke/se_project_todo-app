Todo App

A tiny, dependency-light Todo app built with vanilla JS modules and a sprinkle of OOP. Add tasks with an optional due date, validate inputs inline, and manage items with a clean, accessible UI.

Functionality

Add todos via a modal form

Task name is required (minlength=2)

Date is optional, but validated when present:

blocks malformed/partial date input with a custom message

blocks past dates; today or future is allowed

Inline validation UI (errors render under each field; submit button disables when invalid)

Mark complete with a checkbox (state reflected in UI)

Delete a todo

UUIDs for new items

Form resets only after a successful submit (closing the modal manually preserves current input)

Technology

HTML/CSS — semantic markup + small, responsive styles

Vanilla JS (ES Modules) — no frameworks

OOP components

FormValidator — reusable, generic validator with cached DOM references and a validateField/resetValidation API

Todo — renders a todo item from a <template>, caches refs (_nameEl, _dateEl, _checkboxEl, _deleteBtn)

Custom date validation

Listeners on input, change, and focusout for reliable native <input type="date"> behavior

Custom messages for bad/partial input (e.g., “Please enter a valid date (MM-DD-YYYY)”)

Past date check using string comparison to avoid timezone gotchas

UUID v4 via ESM CDN import:

import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

Getting Started
Run locally

Clone the repo

Serve with any static server (or open index.html directly)

Quick dev server:

npx serve .


Open http://localhost:3000 (or whatever port your server prints)

Key Scripts (optional)

If you’re using a simple static server, no build step is required.

Deployment

This project is deployed on GitHub Pages.

Live demo: https://serjykalstryke.github.io/se_project_todo-app/

How to deploy (quick)

Push your code to the main branch.

In your repo: Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / root.

Save. GitHub Pages will publish and give you a URL.

Notes / Decisions

Date field is optional by design; clearing it enables submit (assuming the name is valid).

Manual close of the modal does not reset the form; fields reset only after successful submission (per spec).

DOM queries for inputs/buttons are cached inside components for perf and clarity.

License

MIT