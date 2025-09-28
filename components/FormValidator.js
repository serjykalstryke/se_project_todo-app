class FormValidator {
    constructor(settings, formEl) {
        this._formEl = formEl;
        this._inputSelector = settings.inputSelector;
        this._submitButtonSelector = settings.submitButtonSelector;
        this._errorClass = settings.errorClass;
        this._inputErrorClass = settings.inputErrorClass;
        this._inactiveButtonClass = settings.inactiveButtonClass;

        this._inputs = Array.from(this._formEl.querySelectorAll(this._inputSelector));
        this._submitBtn = this._formEl.querySelector(this._submitButtonSelector);
    }

    _refreshCache() {
        this._inputs = Array.from(this._formEl.querySelectorAll(this._inputSelector));
        this._submitBtn = this._formEl.querySelector(this._submitButtonSelector);
    }

    _showInputError(inputElement, message) {
        const errorElement = this._formEl.querySelector(`#${inputElement.id}-error`);
        if (!errorElement) return;
        inputElement.classList.add(this._inputErrorClass);
        errorElement.textContent = message;
        errorElement.classList.add(this._errorClass);
    }

    _hideInputError(inputElement) {
        const errorElement = this._formEl.querySelector(`#${inputElement.id}-error`);
        if (!errorElement) return;
        inputElement.classList.remove(this._inputErrorClass);
        errorElement.classList.remove(this._errorClass);
        errorElement.textContent = '';
    }

    _checkInputValidity(inputElement) {
        // Force recompute of built-in validity before reading it
        inputElement.checkValidity();
        if (!inputElement.validity.valid) {
            this._showInputError(inputElement, inputElement.validationMessage);
        } else {
            this._hideInputError(inputElement);
        }
    }

    _hasInvalidInput() {
        return this._inputs.some(i => !i.validity.valid);
    }

    _toggleButtonState() {
        if (!this._submitBtn) return;
        const disable = this._hasInvalidInput();
        this._submitBtn.classList.toggle(this._inactiveButtonClass, disable);
        this._submitBtn.disabled = disable;
    }

    _setEventListeners() {
        // initial state
        this._toggleButtonState();

        const handler = (input) => {
            this._checkInputValidity(input);
            this._toggleButtonState();
        };

        this._inputs.forEach((input) => {
            input.addEventListener('input', () => handler(input));
            input.addEventListener('change', () => handler(input));
        });
    }

    enableValidation() {
        this._formEl.addEventListener('submit', (e) => e.preventDefault());
        this._setEventListeners();
    }

    resetValidation() {
        // if your DOM changed, uncomment next line:
        // this._refreshCache();

        this._inputs.forEach(i => this._hideInputError(i));
        this._toggleButtonState();
    }

    validateField(input) {
        this._checkInputValidity(input);
        this._toggleButtonState();
    }

    clearField(input) {
        this._hideInputError(input);
        this._toggleButtonState();
    }
}

export default FormValidator;