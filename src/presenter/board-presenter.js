import SortView from './../view/list-sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../const.js';
import {sortByDuration, sortByPrice, sortByDate } from '../utils/sort.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #eventListComponent = new EventListView();
  #sortComponent = null;
  #noPointsComponent = new NoPointsView();
  #boardPoints = [];
  #destinations = null;
  #offers = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardPoints = [];

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    //Сохраняем данные полученные из модели.
    this.#boardPoints = [...this.#pointsModel.points];
    this.#destinations = this.#pointsModel.allDestinations;
    this.#offers = this.#pointsModel.allOffersByType;

    this.#sourcedBoardPoints = [...this.#pointsModel.points];
    this.#renderContent();
  }

  #renderPointList = () => {
    render(this.#eventListComponent, this.#boardContainer);
    this.#boardPoints.forEach((el) => {
      this.#renderPoint({ point: el, destinations: this.#destinations, offers: this.#offers });
    });
  };

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = ({point, destinations, offers}) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init({point, destinations, offers});
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    /////////////////////////////
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);//////////////////////////
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DEFAULT:
        this.#boardPoints.sort(sortByDate);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortByPrice);
        break;
      case SortType.DURATION:
        this.#boardPoints.sort(sortByDuration);
        break;
      default:
        this.#boardPoints = [...this.#boardPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer);
  };

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#boardContainer);
  };

  #renderContent = () => {

    if (!this.#boardPoints.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  };
}
