// components/TodoCounter.js
class TodoCounter {
  // selector: text node for counter (".counter__text")
  // containerSelector: list container (".todos__list")
  constructor(selector, containerSelector) {
    this._element = document.querySelector(selector);
    this._container = document.querySelector(containerSelector);
    this.updateFromDom();
  }

  updateFromDom = () => {
    const items = Array.from(this._container.querySelectorAll("li.todo"));
    const completed = items.filter(
      (el) => el.querySelector(".todo__completed")?.checked
    ).length;

    this._total = items.length;
    this._completed = completed;
    this._updateText();
  };

  _updateText() {
    if (this._element) {
      this._element.textContent = `Showing ${this._completed} out of ${this._total} completed`;
    }
  }
}

export default TodoCounter;
