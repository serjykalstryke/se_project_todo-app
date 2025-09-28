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

const closeModal = (modal) => {
  modal.classList.remove("popup_visible");

  const form = modal.querySelector(".popup__form");
  if (form) {
    form.reset();
    Array.from(form.elements).forEach(el => {
      if (typeof el.setCustomValidity === "function") el.setCustomValidity("");
    });
    addTodoValidator.resetValidation();
  }
};

const generateTodoValidator = (config, form) => {
  const formValidator = new FormValidator(config, form);
  formValidator.enableValidation();
  return formValidator;
};

const addTodoValidator = generateTodoValidator(validationConfig, addTodoForm);

const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template");
  const todoElement = todo.getView();
  return todoElement;
};

addTodoButton.addEventListener("click", () => {
  addTodoValidator?.resetValidation();
  openModal(addTodoPopup);
});

addTodoCloseBtn.addEventListener("click", () => {
  closeModal(addTodoPopup);
});

addTodoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = evt.target.name.value;
  const dateInput = evt.target.date.value;

  const date = new Date(dateInput);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  const id = uuidv4();

  const values = { name, date, id };
  const todo = generateTodo(values);
  todosList.append(todo);
  closeModal(addTodoPopup);
});

initialTodos.forEach((item) => {
  const todo = generateTodo(item);
  todosList.append(todo);
});

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

['input','change','blur'].forEach(evt =>
  dateInput.addEventListener(evt, validateDate)
);
