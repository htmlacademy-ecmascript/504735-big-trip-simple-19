import SortView from './../view/list-sort-view.js';
import EventListView from '../view/event-list-view.js';
import EditingFormView from '../view/editing-form-view.js';
import NoPointsView from '../view/no-points-view.js';
import RoutPointView from '../view/route-point-view.js';
import {render} from '../render.js';

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
    const pointComponent = new RoutPointView({point, destinations, offers });
    const pointEditComponent = new EditingFormView({point, destinations, offers});

    const replacePointToForm = () => {
      this.#eventListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#eventListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('form .event__save-btn').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });


    render(pointComponent, this.#eventListComponent.element);
  }
}
