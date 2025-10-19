# Todo App

A tiny, dependency-light Todo app built with vanilla ES modules and a sprinkle of OOP. Add tasks with an optional due date, validate inline, and manage items with a clean, accessible UI.

## Features

* Add todos via a modal form

  * **Task name** required (`minlength=2`)
  * **Date** optional; validated when present:

    * Blocks malformed/partial input with custom message
    * Blocks past dates (today or future allowed)
  * Inline validation UI (errors under fields; submit disabled when invalid)
* Toggle **complete** with a checkbox (state reflected in UI)
* **Delete** a todo
* **UUID v4** for new items
* Form **resets only after successful submit** (closing the modal preserves input)
* **Dynamic counter**: shows total todos and how many are completed

## Tech

* **HTML/CSS** — semantic markup, small responsive styles
* **Vanilla JS (ES modules)** — no frameworks
* **OOP components** (loosely coupled):

  * `FormValidator` — reusable validator with `validateField` / `resetValidation`
  * `Todo` — renders from a `<template>`; caches refs (`_nameEl`, `_dateEl`, `_checkboxEl`, `_deleteBtn`)
  * `Section` — utility to render a list into a container
  * `Popup` / `PopupWithForm` — modal open/close, ESC/overlay handling, form submit callback
  * `TodoCounter` — tracks and renders “completed out of total”
* **Custom date validation**

  * Listeners on `input`, `change`, `focusout` for reliable native `<input type="date">`
  * Custom messages (e.g., “Please enter a valid date (MM-DD-YYYY)”)
  * Past-date check avoids timezone gotchas
* **UUID v4** via ESM CDN:

  ```js
  import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
  ```

## Architecture (OOP)

* **Section**

  * **Constructor:** `{ items, renderer, containerSelector }`
  * **`renderItems()`** — iterates `items` and calls `renderer(item)` (renderer **creates & adds** one item)
  * **`addItem(element)`** — appends a ready DOM element to the container
* **Popup**

  * **Constructor:** `popupSelector`
  * **`open()` / `close()`** — toggles modal; ESC listener
  * **`setEventListeners()`** — close on X and on overlay
* **PopupWithForm** (extends `Popup`)

  * **Constructor:** `(popupSelector, handleFormSubmit)`
  * **`_getInputValues()`** — collects form inputs
  * **`setEventListeners()`** — wires submit + parent listeners
* **TodoCounter**

  * **Constructor:** `(todos, selector)` → initializes counts & renders
  * **`updateCompleted(increment)`** — +/- completed, updates text
  * **`updateTotal(increment)`** — +/- total, updates text

### Minimal usage examples

```js
// Section
const section = new Section({
  items: initialTodos,
  renderer: (data) => {
    const el = new Todo(data, "#todo-template").getView();
    section.addItem(el); // per spec: add DOM element via Section
  },
  containerSelector: ".todos__list",
});
section.renderItems();
```

```js
// PopupWithForm
const addPopup = new PopupWithForm("#add-todo-popup", (values) => {
  const data = {
    id: uuidv4(),
    name: values.name.trim(),
    date: values.date ? new Date(values.date) : null,
    completed: false,
  };
  const el = new Todo(data, "#todo-template").getView();
  section.addItem(el);
  counter.updateTotal(true);
  addPopup.close();
});
addPopup.setEventListeners();
```

```js
// TodoCounter
const counter = new TodoCounter(initialTodos, ".todos__counter");
// Hook checkbox/delete events to call counter.updateCompleted()/updateTotal()
```

## Getting Started

### Run locally

1. Clone the repo
2. Serve with any static server (or open `index.html` directly)

Quick dev server:

```bash
npx serve .
```

Open the printed URL (e.g., `http://localhost:3000`).

### Project structure (key files)

```
/components
  FormValidator.js
  Popup.js
  PopupWithForm.js
  Section.js
  Todo.js
/utils
  constants.js        # initialTodos, validationConfig
index.js
index.html
styles.css
```

## Deployment

Deployed on GitHub Pages.

Live demo: [https://serjykalstryke.github.io/se_project_todo-app/](https://serjykalstryke.github.io/se_project_todo-app/)

**How to deploy**

1. Push to `main`
2. Repo → **Settings → Pages**
   Source: *Deploy from a branch* → Branch: `main` / root
3. Save and grab the URL

## Notes / Decisions

* Date field **optional by design**; clearing it enables submit (if name valid)
* Manual close of modal **does not reset** form; reset only after successful submit
* DOM queries cached inside components for perf & clarity
* Components are **loosely coupled**: `index.js` wires interactions (creation, events, counters)

## License

MIT
