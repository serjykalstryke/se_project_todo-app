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

// Counter
const counter = new TodoCounter(initialTodos, ".todos__counter");

// Section: pass initialTodos (NOT []), and a renderer that creates & adds one item
let section; // need hoist for renderer closure
section = new Section({
  items: initialTodos,
  renderer: (item) => {
    const el = generateTodo(item);

    // bridge checkbox + delete -> counter updates
    const checkbox = el.querySelector(".todo__completed");
    const delBtn = el.querySelector(".todo__delete-btn");

    if (checkbox) {
      // reflect initial state to counter (already counted in ctor, so only react to changes)
      checkbox.addEventListener("change", (e) => {
        counter.updateCompleted(e.target.checked ? true : false);
      });
    }

    if (delBtn) {
      delBtn.addEventListener("click", () => {
        // if it was completed, decrement completed; always decrement total
        const wasCompleted = checkbox && checkbox.checked;
        if (wasCompleted) counter.updateCompleted(false);
        counter.updateTotal(false);
      }, { once: true });
    }

    section.addItem(el);
  },
  containerSelector: ".todos__list",
});

// paint initial
section.renderItems();

// Validators (unchanged)
const addTodoPopupSelector = "#add-todo-popup";
const addTodoFormEl = document.querySelector(`${addTodoPopupSelector} .popup__form`);
const addTodoValidator = new FormValidator(validationConfig, addTodoFormEl);
addTodoValidator.enableValidation();

// Popup with form submit callback
const addTodoPopup = new PopupWithForm(addTodoPopupSelector, (formValues) => {
  // run native validity UI if needed
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

  // create & add one card through Section API
  const el = generateTodo(values);

  // wire counter updates for this new element
  const checkbox = el.querySelector(".todo__completed");
  const delBtn = el.querySelector(".todo__delete-btn");
  if (checkbox) {
    checkbox.addEventListener("change", (e) => {
      counter.updateCompleted(e.target.checked ? true : false);
    });
  }
  if (delBtn) {
    delBtn.addEventListener("click", () => {
      const wasCompleted = checkbox && checkbox.checked;
      if (wasCompleted) counter.updateCompleted(false);
      counter.updateTotal(false);
    }, { once: true });
  }

  section.addItem(el);
  counter.updateTotal(true);

  // successful submit: reset + validator reset + close
  addTodoFormEl.reset();
  Array.from(addTodoFormEl.elements).forEach((el2) => {
    if (typeof el2.setCustomValidity === "function") el2.setCustomValidity("");
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

// ---- date validation (your same logic, just reuse existing code) ----
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
['input','change','focusout'].forEach(evt =>
  dateInput.addEventListener(evt, validateDate)
);
