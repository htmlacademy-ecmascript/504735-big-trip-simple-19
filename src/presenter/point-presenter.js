import RoutPointView from '../view/route-point-view.js';
import EditingFormView from '../view/editing-form-view.js';
import {render, replace, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import {isDatesEqual} from '../utils/points.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #destinations = null;
  #offers = null;
  #mode = Mode.DEFAULT;
  #isPointEdit = null;

  constructor({pointListContainer, onDataChange, onModeChange, isPointEdit = true}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#isPointEdit = isPointEdit;
  }

  init(point, destinations, offers) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new RoutPointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditBtnClick: this.#handleEditBtn,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new EditingFormView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onCloseEditBtn: this.#handleCloseEditBtn,
      onDeleteClick: this.#handleDeleteClick,
      isPointEdit: this.#isPointEdit,
    });

    if(prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point, this.#destinations, this.#offers);
      this.#replaceFormToPoint();
    }
  };

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point, this.#destinations, this.#offers);
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleCloseEditBtn = () => {
    this.#pointEditComponent.reset(this.#point, this.#destinations, this.#offers);
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleFormSubmit = (point) => {
    const isMinorUpdate = !isDatesEqual(this.#point.dateFrom, point.dateFrom);
    const updateType = isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH;
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      updateType,
      point
    );
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleEditBtn = () => {
    this.#replacePointToForm();
  };

}
