import SortView from './../view/list-sort-view.js';
import EventListView from '../view/event-list-view.js';
import EditingFormView from '../view/editing-form-view.js';
import NoPointsView from '../view/no-points-view.js';
import RoutPointView from '../view/route-point-view.js';
import {render} from '../framework/render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #eventListComponent = new EventListView();
  #boardPoints = [];
  #destinations = null;
  #offers = null;

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    //Сохраняем данные полученные из модели.
    this.#boardPoints = [...this.#pointsModel.points];
    this.#destinations = this.#pointsModel.allDestinations;
    this.#offers = this.#pointsModel.allOffersByType;

    if (!this.#boardPoints.length) {
      render(new NoPointsView(), this.#boardContainer);
    } else {
      render(new SortView(), this.#boardContainer);
      render(this.#eventListComponent, this.#boardContainer);
      this.#boardPoints.forEach((el) => {
        this.#renderPoint({ point: el, destinations: this.#destinations, offers: this.#offers });
      });
    }
  }

  #renderPoint({point, destinations, offers}) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new RoutPointView({
      point,
      destinations,
      offers,
      onEditBtnClick: () => {
        replacePointToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new EditingFormView({
      point,
      destinations,
      offers,
      onFormSubmit: (evt) => {
        evt.preventDefault();
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onCloseEditBtn: () => {
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      this.#eventListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    }

    function replaceFormToPoint() {
      this.#eventListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    }

    render(pointComponent, this.#eventListComponent.element);
  }
}
