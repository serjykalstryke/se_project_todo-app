import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";

// DOM Elements
const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopup = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopup.querySelector(".popup__form");
const addTodoCloseBtn = addTodoPopup.querySelector(".popup__close");
const todosList = document.querySelector(".todos__list");

const openModal = (modal) => {
  modal.classList.add("popup_visible");
};

// ⬇️ Close now only hides the popup; no reset here per spec
const closeModal = (modal) => {
  modal.classList.remove("popup_visible");
};

const generateTodoValidator = (config, form) => {
  const formValidator = new FormValidator(config, form);
  formValidator.enableValidation();
  return formValidator;
};

const addTodoValidator = generateTodoValidator(validationConfig, addTodoForm);

const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template");
  return todo.getView();
};

// ⬇️ DRY helper
const renderTodo = (item) => {
  const el = generateTodo(item);
  todosList.append(el);
};

// Open
addTodoButton.addEventListener("click", () => {
  addTodoValidator.resetValidation(); // okay to clear errors when opening
  openModal(addTodoPopup);
});

// Manual close preserves current input (no reset)
addTodoCloseBtn.addEventListener("click", () => {
  closeModal(addTodoPopup);
});

// Submit
addTodoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  // If invalid, let validator surface messages
  if (!addTodoForm.checkValidity()) {
    [...addTodoForm.querySelectorAll(validationConfig.inputSelector)]
      .forEach((i) => addTodoValidator.validateField(i));
    return;
  }

  const name = evt.target.name.value.trim();
  const dateStr = evt.target.date.value;

  // Optional date: store null if empty (avoids Invalid Date)
  const date = dateStr ? new Date(dateStr) : null;

  const id = uuidv4();

  // ⬇️ include completed default
  const values = { id, name, date, completed: false };

  renderTodo(values);

  // ⬇️ Per spec: reset ONLY after successful submission
  addTodoForm.reset();
  // clear any custom validity (e.g., date)
  Array.from(addTodoForm.elements).forEach((el) => {
    if (typeof el.setCustomValidity === "function") el.setCustomValidity("");
  });
  addTodoValidator.resetValidation();

  closeModal(addTodoPopup);
});

// Seed initial items via the same helper (DRY)
initialTodos.forEach(renderTodo);

// --- Date validation (unchanged from your working version) ---
const dateInput = addTodoForm.querySelector('#todo-date');

function validateDate() {
  dateInput.setCustomValidity('');

  const val = dateInput.value;

  if (!val && dateInput.validity.badInput) {
    dateInput.setCustomValidity('Please enter a valid date (MM-DD-YYYY).');
    return addTodoValidator.validateField(dateInput);
  }

  if (!val) {
    const err = addTodoForm.querySelector('#todo-date-error');
    dateInput.classList.remove(validationConfig.inputErrorClass);
    if (err) {
      err.textContent = '';
      err.classList.remove(validationConfig.errorClass);
    }
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
