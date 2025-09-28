class Todo {
  constructor(data, selector) {
    this._data = data;
    this._templateElement = document.querySelector(selector);
  }

  _cacheDom() {
    this._nameEl = this._todoElement.querySelector('.todo__name');
    this._dateEl = this._todoElement.querySelector('.todo__date');
    this._checkboxEl = this._todoElement.querySelector('.todo__completed');
    this._labelEl = this._todoElement.querySelector('.todo__label');
    this._deleteBtn = this._todoElement.querySelector('.todo__delete-btn');
  }

  _formatDate(d) {
    const date = new Date(d);
    if (isNaN(date)) return '';
    return `Due: ${date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })}`;
  }

  _renderName() {
    this._nameEl.textContent = this._data.name;
  }

  _renderDate() {
    this._dateEl.textContent = this._formatDate(this._data.date);
  }

  _setupCheckbox() {
    this._checkboxEl.checked = !!this._data.completed;
    this._checkboxEl.id = `todo-${this._data.id}`;
    this._labelEl.setAttribute('for', this._checkboxEl.id);
  }

  _setEventListeners() {
    this._deleteBtn.addEventListener('click', () => {
      this._todoElement.remove();
    });

    this._checkboxEl.addEventListener('change', () => {
      this._data.completed = this._checkboxEl.checked;
    });
  }

  getView() {
    this._todoElement = this._templateElement.content
      .querySelector('.todo')
      .cloneNode(true);

    // cache once ✅
    this._cacheDom();

    // render once using cached refs
    this._renderName();
    this._renderDate();
    this._setupCheckbox();
    this._setEventListeners();

    return this._todoElement;
  }
}

export default Todo;
