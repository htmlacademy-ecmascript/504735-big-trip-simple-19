import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate, getCheckedDestination } from '../utils/points.js';
import { TYPE_POINTS } from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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

const createOffersTemplate = (offers, pointOffers, pointId) => {
  if (offers?.length === 0) {

    return '';
  }
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offers.map(({ title, price, id: offerId }) => {
      const checkedOffer = pointOffers.includes(offerId) ? 'checked' : '';
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden"
               id="event-offer-${pointId}-${offerId}"
               type="checkbox"
               data-offer-id="${offerId}"
               name="event-offer-${pointId}" ${checkedOffer}>
          <label class="event__offer-label" for="event-offer-${pointId}-${offerId}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`);}).join('')}
       </div>
      </section>`
  );
};

const createDestinationOptionsTemplate = (options) => {
  if (!options?.length) {
    return '';
  }

  return options.map((option) => `<option value=${option.name}></option>`).join('');
};


const createDescriptionTemplate = (destinations, point) => {
  if (destinations?.length === 0) {
    return '';
  }

  return (
    destinations.find((el) => el.id === point.destination)
  );
};

const createPicturesTemplate = (destinations, pictures, name) => {
  if (destinations?.length === 0) {
    return '';
  }
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map(({ src }) => `<img class="event__photo" src="${src}.jpg" alt="Photo of ${name}">`).join('')}
      </div>
      </div>
  `);
};

const getOffersByType = (offers, point) => offers.find((offer) => offer.type === point.type);


const createEditingFormTemplate = (point, destinations, offers) => {
  const {id, price, type, dateFrom, dateTo, offers: pointOffers} = point;
  // const { description} = destinations;
  const editDateStart = humanizeDate(dateFrom);
  const editDateEnd = humanizeDate(dateTo);
  const offersByType = getOffersByType(offers, point).offers;
  const offersTemplate = createOffersTemplate(offersByType, pointOffers, id);

  const {name, pictures } = getCheckedDestination(point, destinations);

  const destinationMarkup = createDescriptionTemplate(destinations, point).name;
  const descriptionMarkup = (destinations.find((el) => el.id === point.destination)).description;
  const picturesMarkup = createPicturesTemplate(destinations, pictures, name);


  const createTypeListMarkup = TYPE_POINTS.map((offerType) => `<div class="event__type-item">
    <input id="event-type-${offerType}-1"
       class="event__type-input  visually-hidden"
       type="radio"
       name="event-type"
       value="${offerType}">
    <label class="event__type-label  event__type-label--${offerType}" for="event-type-${offerType}-1">${offerType}</label>
  </div>`).join('');


  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="get">
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
        ${createDestinationOptionsTemplate(destinations)}
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
  </form>
  </li>`
  );
};

export default class EditingFormView extends AbstractStatefulView{
  #point = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleCloseEditClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point = BLANK_POINT, destinations, offers, onFormSubmit, onCloseEditBtn}) {
    super();
    this._setState(EditingFormView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseEditClick = onCloseEditBtn;
    this._restoreHandlers();
  }

  get template() {
    return createEditingFormTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form.event--edit').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditBtnClickHandle);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);

    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#descriptionInputHandler);
    this.#setDatepickerDateFrom();
    this.#setDatepickerDateTo();
  }

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditingFormView.parsePointToState(this._state, this.#destinations, this.#offers));
  };

  #closeEditBtnClickHandle = () => {
    this.#handleCloseEditClick();
  };

  // Обработчик смены точки маршрута
  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
        offers: []
      });
    }
  };

  // Обработчик изменения пункта назначения
  #offerChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.dataset.offerId) {
      const currentOfferId = Number(evt.target.dataset.offerId);
      const index = this._state.offers.indexOf(currentOfferId);

      if (index === -1) {
        this._setState(this._state.offers.push(currentOfferId));

        return;
      }

      this._setState(this._state.offers.splice(index, 1));
    }
  };

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    const cities = this.#destinations.map((destination) => destination.name);

    if (!evt.target.value || evt.target.value === '' || cities.indexOf(evt.target.value) === -1) {
      return;
    }

    const selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);

    this.updateElement({
      destination: selectedDestination.id
    });
  };

  // Обработчик изменения пункта назначения
  // #destinationChangeHandler = (evt) => {
  //   evt.preventDefault();

  //   const selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);

  //   if (!selectedDestination) {
  //     evt.target.value = '';

  //     return;
  //   }

  //   this.updateElement({ destination: selectedDestination.id });
  // };

  #dateFromChageHandler = ([userDateFrom]) => {
    this.updateElement({
      dateFrom: userDateFrom});
  };

  #dateToChageHandler = ([userDateTo]) => {
    this.updateElement({
      dateTo: userDateTo});
  };

  #setDatepickerDateFrom() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        datepickerFrom: this._state.dateFrom,
        onChange: this.#dateFromChageHandler,
        time24hr: true
      },
    );
  }

  #setDatepickerDateTo() {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        datepickerTo: this._state.dateTo,
        onChange: this.#dateToChageHandler,
        time24hr: true
      },
    );
  }

  reset(point) {
    this.updateElement(
      EditingFormView.parsePointToState(point),
    );
  }

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint = (state) => {
    const point = {...state};

    return point;
  };
}
