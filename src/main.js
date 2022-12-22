import {render} from './render.js';
import ListFilterView from './view/list-filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import {RenderPosition} from './render.js';
import PointsModel from './model/points-model';
import MainInfoView from './view/main-info-view.js';

const tripMainContainer = document.querySelector('.trip-main');
render(new MainInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);

const tripMainElement = document.querySelector('.trip-controls__filters');
render(new ListFilterView(), tripMainElement);

const mainContainerElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({
  boardContainer: mainContainerElement,
  pointsModel,
});

boardPresenter.init();
