// components/Section.js
class Section {
  // items: array of raw data to render on load
  // renderer: (item) => void  // MUST create & add a single item to the page
  // containerSelector: CSS selector for list container
  constructor({ items = [], renderer, containerSelector }) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  // Add a ready-made DOM element to the container
  addItem(element) {
    if (element instanceof HTMLElement) {
      this._container.append(element);
    }
  }

  // Iterate data and call the provided renderer for each
  renderItems() {
    this._items.forEach((item) => this._renderer(item));
  }
}

export default Section;
