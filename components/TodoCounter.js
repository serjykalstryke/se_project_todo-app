// components/TodoCounter.js
class TodoCounter {
  // todos: initial array; elementSelector: CSS selector for counter text (".counter__text")
  constructor(todos, elementSelector) {
    this._element = document.querySelector(elementSelector);
    this._completed = Array.isArray(todos) ? todos.filter(t => !!t.completed).length : 0;
    this._total = Array.isArray(todos) ? todos.length : 0;
    this._updateText();
  }

  // Call when a checkbox is toggled ON (true) or OFF (false)
  updateCompleted = (increment) => {
    this._completed += increment ? 1 : -1;
    if (this._completed < 0) this._completed = 0;
    if (this._completed > this._total) this._completed = this._total;
    this._updateText();
  };

  // Call on create (true) / delete (false)
  updateTotal = (increment) => {
    this._total += increment ? 1 : -1;
    if (!increment && this._completed > this._total) {
      this._completed = this._total;
    }
    if (this._total < 0) this._total = 0;
    this._updateText();
  };

  _updateText() {
    if (this._element) {
      this._element.textContent = `Showing ${this._completed} out of ${this._total} completed`;
    }
  }
}

export default TodoCounter;
