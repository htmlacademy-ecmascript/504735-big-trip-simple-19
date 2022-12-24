import AbstractView from '../framework/view/abstract-view.js';

function createBoardViewTemplate() {
  return (
    `<div class="page-body__container">
    </div>`
  );
}

export default class BoardView extends AbstractView {
  get template() {
    return createBoardViewTemplate();
  }
}
