import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDate, humanizePointTime, calculateDurationInPoint} from '../utils/points.js';
import he from 'he';

const createOfferElement = (offers) => {
  if (offers.length === 0) {
    return '';
  }

  return (`
  ${offers.map(({ title, price: offerPrice }) => `<li class="event__offer">
  <span class="event__offer-title">${title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${offerPrice}</span>
</li>`).join('')}
`);
};

function createRoutPointTemplate(point, destinations, offers) {
  const {price, type, dateFrom, dateTo, isFavorite, offers: pointOffers} = point;

  const eventDate = humanizePointDate(dateFrom);
  const timeFrom = humanizePointTime(dateFrom);
  const timeTo = humanizePointTime(dateTo);
  const duration = calculateDurationInPoint(dateFrom, dateTo);

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const destinationMarkup = destinations.find((el) => el.id === point.destination)?.name;
  const offersByType = (offers.find((offer) => offer.type === point.type)).offers;
  const offersForRender = offersByType.filter(({id}) => pointOffers.includes(id));
  const offersTemplate = createOfferElement(offersForRender);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${he.encode(eventDate)}">${he.encode(eventDate)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(type)}.png" alt="Event ${he.encode(type)} icon">
      </div>
      <h3 class="event__title">${he.encode(type)} ${destinationMarkup}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${he.encode(timeFrom)}">${he.encode(timeFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${he.encode(timeTo)}">${he.encode(timeTo)}</time>
        </p>
        <p class="event__duration">${he.encode(duration)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${he.encode(String(price))}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersTemplate}
      </ul>
      <button class="event__favorite-btn ${favoriteClass}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

export default class RoutPointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleEditBtnClick = null;
  #handleFavoriteClick = null;

  constructor({point, destinations, offers, onEditBtnClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditBtnClick = onEditBtnClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createRoutPointTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditBtnClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
