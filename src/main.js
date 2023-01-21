import {render} from './framework/render.js';
// import ListFilterView from './view/list-filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import {RenderPosition} from './render.js';
import PointsModel from './model/points-model';
import MainInfoView from './view/main-info-view.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

// import {generateFilter} from './mock/filter.js';

// const filters = [
//   {
//     type: 'everything',
//     name: 'EVERYTHING',
//     count: 0,
//   },
// ];

const tripMainContainer = document.querySelector('.trip-main');
render(new MainInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);

const mainContainerElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  boardContainer: mainContainerElement,
  pointsModel,
  filterModel,
});

const tripMainElement = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({
  filterContainer: tripMainElement,
  filterModel,
  pointsModel
});

// const filters = generateFilter(pointsModel.points);
// const tripMainElement = document.querySelector('.trip-controls__filters');
// render(new ListFilterView({
//   filters,
//   currentFilterType: 'everything',
//   onFilterTypeChange: () => {}
// }), tripMainElement);

filterPresenter.init();
boardPresenter.init();
