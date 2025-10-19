import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

// DOM
const addTodoButton = document.querySelector(".button_action_add");

// build a Todo element from data
const generateTodo = (data) => new Todo(data, "#todo-template").getView();

// Counter (spec API: (todos, selector))
const counter = new TodoCounter(initialTodos, ".counter__text");

// Section (renderer creates & adds one item; no counting during initial render)
let section;
section = new Section({
  items: initialTodos,
  renderer: (item) => renderTodo(item, { countDelta: false }),
  containerSelector: ".todos__list",
});

// DRY helper: create, wire events, append via Section, optionally update counter
function renderTodo(item, { countDelta } = { countDelta: false }) {
  const el = generateTodo(item);

  const checkbox = el.querySelector(".todo__completed");
  const deleteBtn = el.querySelector(".todo__delete-btn");

  if (checkbox) {
    checkbox.addEventListener("change", (e) => {
      // if now checked -> increment completed; else decrement
      counter.updateCompleted(!!e.target.checked);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener(
      "click",
      () => {
        const wasCompleted = checkbox && checkbox.checked;
        if (wasCompleted) counter.updateCompleted(false);
        counter.updateTotal(false);
        // Todo element removes itself inside Todo.js
      },
      { once: true }
    );
  }

  section.addItem(el);

  // If this is a *newly created* todo, bump total by 1
  if (countDelta) counter.updateTotal(true);

  return el;
}

// Initial paint
section.renderItems();

// Validators
const addTodoPopupSelector = "#add-todo-popup";
const addTodoFormEl = document.querySelector(`${addTodoPopupSelector} .popup__form`);
const addTodoValidator = new FormValidator(validationConfig, addTodoFormEl);
addTodoValidator.enableValidation();

// Popup with form submit callback
const addTodoPopup = new PopupWithForm(addTodoPopupSelector, (formValues) => {
  if (!addTodoFormEl.checkValidity()) {
    [...addTodoFormEl.querySelectorAll(validationConfig.inputSelector)]
      .forEach((i) => addTodoValidator.validateField(i));
    return;
  }

  const id = uuidv4();
  const name = formValues.name;
  const dateStr = formValues.date;
  const date = dateStr ? new Date(dateStr) : null;

  const values = { id, name, date, completed: false };

  // Create + wire + append + update counter totals
  renderTodo(values, { countDelta: true });

  // successful submit: reset + validator reset + close
  addTodoFormEl.reset();
  Array.from(addTodoFormEl.elements).forEach((formElement) => {
    if (typeof formElement.setCustomValidity === "function") formElement.setCustomValidity("");
  });
  addTodoValidator.resetValidation();
  addTodoPopup.close();
});

// attach popup listeners (close btn + overlay + submit)
addTodoPopup.setEventListeners();

// Open handler stays in index.js per spec
addTodoButton.addEventListener("click", () => {
  addTodoValidator.resetValidation();
  addTodoPopup.open();
});

// ---- date validation (unchanged logic) ----
const dateInput = addTodoFormEl.querySelector('#todo-date');
function validateDate() {
  dateInput.setCustomValidity('');
  const val = dateInput.value;

  if (!val && dateInput.validity.badInput) {
    dateInput.setCustomValidity('Please enter a valid date (MM-DD-YYYY).');
    return addTodoValidator.validateField(dateInput);
  }

  if (!val) {
    const err = addTodoFormEl.querySelector('#todo-date-error');
    dateInput.classList.remove(validationConfig.inputErrorClass);
    if (err) { err.textContent = ''; err.classList.remove(validationConfig.errorClass); }
    requestAnimationFrame(() => addTodoValidator.validateField(dateInput));
    return;
  }

  if (dateInput.validity.badInput || dateInput.valueAsDate === null) {
    dateInput.setCustomValidity('Please enter a valid date (MM-DD-YYYY).');
    return addTodoValidator.validateField(dateInput);
  }

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (!dateInput.validationMessage && val < todayStr) {
    dateInput.setCustomValidity('Please pick today or a future date.');
  }

  addTodoValidator.validateField(dateInput);
}
['input', 'change', 'focusout'].forEach(evt =>
  dateInput.addEventListener(evt, validateDate)
);
