import ListSortView from './../view/list-sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {sortByDuration, sortByPrice, sortByDate} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #eventListComponent = new EventListView();
  #sortComponent = null;
  #noPointsComponent = null;
  #loadingComponent = new LoadingView();
  #pointPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });


  constructor({boardContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

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

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#pointsModel.destinations, this.#pointsModel.offers);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.#pointsModel.destinations, this.#pointsModel.offers );
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
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

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
    remove(this.#loadingComponent);

    if(this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterType
    });
    render(this.#noPointsComponent, this.#boardContainer);
  };
}
