import { createElement } from '../render.js';
import { humanizeDate } from '../utils.js';
import { TYPE_POINTS } from '../const.js';
const BLANK_POINT = {
  id: 1,
  type: '',
  destination: '',
  offers: [],
  isFavorite: false,
  dateFrom: '-',
  dateTo: '-',
  price: '000'
};

const createOffersTemplate = (offers, pointOffers) => {
  if (offers?.length === 0) {

    return '';
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offers.map(({ title, price, id }) => {
      const checkedOffer = pointOffers.includes(id) ? 'checked' : '';

      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden"
               id="event-offer-luggage-${id}"
               type="checkbox"
               name="event-offer-luggage" ${checkedOffer}>
          <label class="event__offer-label" for="event-offer-luggage-${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`);}).join('')}
       </div>
      </section>`
  );
};

const createDescriptionTemplate = (destinations, point) => {
  if (destinations?.length === 0) {
    return '';
  }

  return (
    destinations.find((el) => el.id === point.id)
  );
};

const createPicturesTemplate = (destinations) => {
  if (destinations?.length === 0) {
    return '';
  }
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${destinations.map(({pictures: pictureForDescription}) => {
      const [picture] = pictureForDescription;

      return `<img class="event__photo" src="${picture.src}.jpg" alt="Event photo">`;
    }).join('')}
       </div>
      </div>
  `);
};

const getOffersByType = (offers, point) => offers.find((offer) => offer.type === point.type);


const createEditingFormTemplate = (point, destinations, offers) => {
  const {price, type, dateFrom, dateTo, offers: pointOffers} = point;
  const { description} = destinations;
  const editDateStart = humanizeDate(dateFrom);
  const editDateEnd = humanizeDate(dateTo);
  const offersByType = getOffersByType(offers, point).offers;
  const offersTemplate = createOffersTemplate(offersByType, pointOffers);
  const destinationMarkup = createDescriptionTemplate(destinations, point).name;
  const descriptionMarkup = (destinations.find((el) => el.id === point.id)).description;
  const picturesMarkup = createPicturesTemplate(destinations, description, point);


  const createTypeListMarkup = TYPE_POINTS.map((offerType) => `<div class="event__type-item">
    <input id="event-type-${offerType}-1"
       class="event__type-input  visually-hidden"
       type="radio"
       name="event-type"
       value="taxi">
    <label class="event__type-label  event__type-label--${offerType}" for="event-type-taxi-1">${offerType}</label>
  </div>`).join('');


  return (
    `<form class="event event--edit" action="#" method="get">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
        <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${createTypeListMarkup}
        </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type} 
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationMarkup}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${editDateStart}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${editDateEnd}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
         ${offersTemplate}
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${descriptionMarkup}</p>
        
        ${picturesMarkup}
        
      </section>
    </section>
  </form>`
  );
};

export default class EditingFormView {
  #element = null;
  #point = null;
  #destinations = null;
  #offers = null;

  constructor({point = BLANK_POINT, destinations, offers}) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createEditingFormTemplate(this.#point, this.#destinations, this.#offers);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
