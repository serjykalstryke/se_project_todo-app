// components/PopupWithForm.js
import Popup from "./Popup.js";

class PopupWithForm extends Popup {
  // handleFormSubmit: (formValues) => void
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".popup__form");
    this._inputs = Array.from(this._form.querySelectorAll("input, textarea, select"));
  }

  _getInputValues() {
    const values = {};
    this._inputs.forEach((i) => (values[i.name] = i.type === "date" ? i.value : i.value.trim()));
    return values;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }

  close() {
    super.close();
    // per spec you can reset after successful submit in index.js; we won’t reset here automatically
  }
}

export default PopupWithForm;
