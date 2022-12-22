import { createElement } from './../render.js';

function createBoardViewTemplate() {
  return (
    `<div class="page-body__container">
    </div>`
  );
}

export default class BoardView {
  #element = null;

  get template() {
    return createBoardViewTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
