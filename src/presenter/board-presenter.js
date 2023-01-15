import ListSortView from './../view/list-sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render, RenderPosition} from '../framework/render.js';
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
  #currentSortType = SortType.DAY;
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

    if (!this.#boardPoints.length) {
      this.#renderNoPoints();
      return;
    }

    render(this.#eventListComponent, this.#boardContainer);
    this.#renderSort();
    this.#renderPointList(sortByDate(this.#boardPoints));
  }

  #renderPointList(points) {
    return points.forEach((el) => {
      this.#renderPoint(el, this.#destinations, this.#offers);
    });
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point, destinations, offers) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, destinations, offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);

    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offers);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      // case SortType.DAY:
      //   sortByDate(this.#boardPoints);
      //   break;
      case SortType.PRICE:
        sortByPrice(this.#boardPoints);
        break;
      case SortType.DURATION:
        sortByDuration(this.#boardPoints);
        break;
      default:
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList(this.#boardPoints);
  };

  #renderSort() {
    this.#sortComponent = new ListSortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#boardContainer);
  };

}
