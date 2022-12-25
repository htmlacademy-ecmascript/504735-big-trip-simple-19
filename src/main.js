import {render} from './framework/render.js';
import ListFilterView from './view/list-filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import {RenderPosition} from './render.js';
import PointsModel from './model/points-model';
import MainInfoView from './view/main-info-view.js';

import {generateFilter} from './mock/filter.js';

const tripMainContainer = document.querySelector('.trip-main');
render(new MainInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);

const mainContainerElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({
  boardContainer: mainContainerElement,
  pointsModel,
});

const filters = generateFilter(pointsModel.points);
const tripMainElement = document.querySelector('.trip-controls__filters');
render(new ListFilterView({filters}), tripMainElement);

boardPresenter.init();
