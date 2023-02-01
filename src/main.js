import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import {RenderPosition} from './render.js';
import PointsModel from './model/points-model';
import MainInfoView from './view/main-info-view.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view';
import PointsApiService from './points-api-service.js';


const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip';


const tripMainContainer = document.querySelector('.trip-main');
const mainContainerElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
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
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

const tripMainElement = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({
  filterContainer: tripMainElement,
  filterModel,
  pointsModel
});

filterPresenter.init();
boardPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, tripMainContainer);
  });
