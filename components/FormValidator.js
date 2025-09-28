class FormValidator {
    constructor(settings, formEl) {
        this._formEl = formEl;
        this._inputSelector = settings.inputSelector;
        this._submitButtonSelector = settings.submitButtonSelector;
        this._errorClass = settings.errorClass;
        this._inputErrorClass = settings.inputErrorClass;
        this._inactiveButtonClass = settings.inactiveButtonClass;
    }

    _showInputError(inputElement, message) {
        const errorElement = this._formEl.querySelector(
            `#${inputElement.id}-error`
        );
        if (!errorElement) return;
        inputElement.classList.add(this._inputErrorClass);
        errorElement.textContent = message;
        errorElement.classList.add(this._errorClass);
    }

    _hideInputError(inputElement) {
        const errorElement = this._formEl.querySelector(
            `#${inputElement.id}-error`
        );
        if (!errorElement) return;
        inputElement.classList.remove(this._inputErrorClass);
        errorElement.classList.remove(this._errorClass);
        errorElement.textContent = "";
    }

    _checkInputValidity(inputElement) {
        inputElement._checkInputValidity = this._checkInputValidity;
        if (!inputElement.validity.valid) {
            this._showInputError(inputElement, inputElement.validationMessage);
        } else {
            this._hideInputError(inputElement);
        }
    }

    _hasInvalidInput(inputs) {
        return inputs.some((i) => !i.validity.valid);
    }

    _toggleButtonState(inputs, button) {
        if (!button) return;
        const disable = this._hasInvalidInput(inputs);
        button.classList.toggle(this._inactiveButtonClass, disable);
        button.disabled = disable;
    }

    _setEventListeners() {
        const inputs = Array.from(
            this._formEl.querySelectorAll(this._inputSelector)
        );
        const submitBtn = this._formEl.querySelector(this._submitButtonSelector);

        this._toggleButtonState(inputs, submitBtn);

        inputs.forEach((input) => {
            const handler = () => {
                this._checkInputValidity(input);
                this._toggleButtonState(inputs, submitBtn);
            };
            input.addEventListener('input', handler);
            input.addEventListener('change', handler);
        });
    }

    enableValidation() {
        this._formEl.addEventListener("submit", (e) => e.preventDefault());
        this._setEventListeners();
    }

    resetValidation() {
        const inputs = Array.from(
            this._formEl.querySelectorAll(this._inputSelector)
        );
        const submitBtn = this._formEl.querySelector(this._submitButtonSelector);
        inputs.forEach((i) => this._hideInputError(i));
        this._toggleButtonState(inputs, submitBtn);
    }

    validateField(input) {
        this._checkInputValidity(input);
        const inputs = Array.from(this._formEl.querySelectorAll(this._inputSelector));
        const btn = this._formEl.querySelector(this._submitButtonSelector);
        this._toggleButtonState(inputs, btn);
    }

    clearField(input) {
        // hide the error UI for this input
        this._hideInputError(input);

        // re-toggle button state based on the whole form
        const inputs = Array.from(this._formEl.querySelectorAll(this._inputSelector));
        const btn = this._formEl.querySelector(this._submitButtonSelector);
        this._toggleButtonState(inputs, btn);
    }
}

export default FormValidator;
