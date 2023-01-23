import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import {RenderPosition} from './render.js';
import PointsModel from './model/points-model';
import MainInfoView from './view/main-info-view.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view';

const tripMainContainer = document.querySelector('.trip-main');
const mainContainerElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  boardContainer: mainContainerElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

render(new MainInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createTask();
  newPointButtonComponent.element.disabled = true;
}

const tripMainElement = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({
  filterContainer: tripMainElement,
  filterModel,
  pointsModel
});

render(newPointButtonComponent, tripMainContainer, RenderPosition.BEFOREEND);

filterPresenter.init();
boardPresenter.init();
