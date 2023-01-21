import ListSortView from './../view/list-sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
// import {updateItem} from '../utils/common.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {sortByDuration, sortByPrice, sortByDate } from '../utils/sort.js';
import {filter} from '../utils/filter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #eventListComponent = new EventListView();
  #sortComponent = null;
  // #noPointsComponent = new NoPointsView();
  #noPointsComponent = null;
  // #boardPoints = [];
  // #destinations = null;
  // #offers = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  // #sourcedBoardPoints = [];

  constructor({boardContainer, pointsModel, filterModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        sortByDate(filteredPoints);
        break;
      case SortType.PRICE:
        sortByPrice(filteredPoints);
        break;
      case SortType.DURATION:
        sortByDuration(filteredPoints);
        break;
      // default:
      //   this.#boardPoints = [...this.#sourcedBoardPoints];
    }

    return filteredPoints;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }


  init() {
    this.#renderBoard();
  }

  #renderPointList(points) {
    return points.forEach((el) => {
      this.#renderPoint(el, this.destinations, this.offers);
    });
  }


  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point, destinations, offers) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, destinations, offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenter.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });////Что добавить в пердаваемый объект???
        this.#renderBoard();
        break;
    }
  };

  // #handlePointChange = (updatedPoint) => {
  // this.#pointsModel.points = updateItem(this.#pointsModel.points, updatedPoint);
  // this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);

  //   this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offers);
  // };

  // #sortPoints(sortType) {
  //   switch (sortType) {
  //     // case SortType.DAY:
  //     //   sortByDate(this.#boardPoints);
  //     //   break;
  //     case SortType.PRICE:
  //       sortByPrice(this.#boardPoints);
  //       break;
  //     case SortType.DURATION:
  //       sortByDuration(this.#boardPoints);
  //       break;
  //     default:
  //       this.#boardPoints = [...this.#sourcedBoardPoints];
  //   }

  //   this.#currentSortType = sortType;
  // }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    // this.#sortPoints(sortType);
    this.#currentSortType = sortType;
    // this.#clearPointList();
    // this.#renderPointList(this.#pointsModel.points);
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new ListSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    render(this.#eventListComponent, this.#boardContainer);
    const points = this.points;

    if (!points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointList(points);
  }

  #clearBoard({ resetSortType = false} = {}) {

    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if(this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterType
    });
    render(this.#noPointsComponent, this.#boardContainer);
  };

}
