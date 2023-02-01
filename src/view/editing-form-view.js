import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeDate, getCheckedDestination} from '../utils/points.js';
import {TYPE_POINTS} from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  type: TYPE_POINTS[0],
  destination: null,
  offers: [],
  isFavorite: false,
  price: ''
};

const createOffersTemplate = (offers, pointOffers, pointId) => {
  if (!offers?.length) {

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
               id="event-offer-${he.encode(String(pointId))}-${he.encode(String(offerId))}"
               type="checkbox"
               data-offer-id="${he.encode(String(offerId))}"
               name="event-offer-${he.encode(String(pointId))}" ${checkedOffer}>
          <label class="event__offer-label" for="event-offer-${he.encode(String(pointId))}-${he.encode(String(offerId))}">
            <span class="event__offer-title">${he.encode(title)}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${he.encode(String(price))}</span>
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

  return options.map((option) => `<option value="${he.encode(option.name)}"></option>`).join('');
};

const createDestinationTemplate = (destinations, description, pictures, name) => {
  if (!destinations?.length || !description) {
    return '';
  }

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(description)}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures?.map(({ src }) => `<img class="event__photo" src="${he.encode(src)}" alt="Photo of ${he.encode(name)}">`).join('')}
        </div>
      </div>
    </section>
  `);
};

const getOffersByType = (offers, point) => offers.find((offer) => offer.type === point.type);

const createTypeListTemplate = (point, types) => types.map((type) => {
  const pointType = `${type[0].toUpperCase()}${type.slice(1)}`;
  const isChecked = Boolean(point.type === type);

  return (`
    <div class="event__type-item">
      <input 
        id="event-type-${type}-1" 
        class="event__type-input  
        visually-hidden" 
        type="radio" 
        name="event-type" 
        value="${type}" 
        ${isChecked ? 'checked' : ''}
      >
      <label 
        class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${he.encode(pointType)}</label>
    </div>
  `);
}).join('');


const createEditingFormTemplate = (point, destinations, offers, isPointEdit) => {
  const {id, price, type, dateFrom, dateTo, offers: pointOffers, isDisabled, isSaving, isDeleting} = point;
  const resetButtonText = isPointEdit ? `${isDeleting ? 'Deleting...' : 'Delete'}` : 'Cancel';
  const editPointElementClass = isPointEdit ? 'event--edit-form' : 'event--edit-new';

  const editDateStart = humanizeDate(dateFrom);
  const editDateEnd = humanizeDate(dateTo);

  const offersByType = getOffersByType(offers, point)?.offers;
  const offersTemplate = createOffersTemplate(offersByType, pointOffers, id);

  const destination = getCheckedDestination(point, destinations);

  const destinationsTemplate = createDestinationTemplate(destinations, destination?.description, destination?.pictures, destination?.name);
  const isSubmitDisabled = price === '' || price === 0 || destination?.name === null || destination?.name === '' || destination?.name === undefined;

  const createCloseFormButton = () => {
    if (!isPointEdit) {
      return '';
    }
    return (
      `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`
    );
  };

  return (
    `<li class="trip-events__item">
    <form class="event event--edit ${editPointElementClass}" action="#" method="get">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${he.encode(String(id))}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(type)}.png" alt="Event ${he.encode(type)} icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${he.encode(String(id))}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
              ${createTypeListTemplate(point, TYPE_POINTS)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${he.encode(String(id))}">
        ${he.encode(type)} 
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${he.encode(String(id))}" type="text" name="event-destination" value="${he.encode(destination?.name || '')}"
         list="destination-list-${he.encode(String(id))}">
        <datalist id="destination-list-${he.encode(String(id))}">
          ${createDestinationOptionsTemplate(destinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${he.encode(editDateStart)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${he.encode(editDateEnd)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" required value="${he.encode(String(price))}">
      </div>

      <button class="event__save-btn  btn  btn--blue" 
          ${isSubmitDisabled || isDisabled ? 'disabled' : ''}
          type="submit">
          ${isSaving ? 'Saving...' : 'Save'}
      </button>

      <button class="event__reset-btn" 
      type="reset" 
      ${isDisabled ? 'disabled' : ''}>${resetButtonText}</button>
      ${createCloseFormButton()}
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        ${offersTemplate}
      <section class="event__section  event__section--destination">
        ${destinationsTemplate}
      </section>
    </section>
  </form>
  </li>`
  );
};

export default class EditingFormView extends AbstractStatefulView{
  #destinations = null;
  #offers = null;

  #handleDeleteClick = null;
  #handleFormSubmit = null;
  #handleCloseEditClick = null;
  #isPointEdit = null;
  #handleEditPointNewSubmit = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point = {
    ...BLANK_POINT,
    dateFrom: new Date(),
    dateTo: new Date(),
  }, destinations, offers, onFormSubmit, onFormNewPointSubmit, onCloseEditBtn, onDeleteClick, isPointEdit}) {
    super();
    this._setState(EditingFormView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditPointNewSubmit = onFormNewPointSubmit;
    this.#handleCloseEditClick = onCloseEditBtn;
    this.#handleDeleteClick = onDeleteClick;
    this.#isPointEdit = isPointEdit;
    this._restoreHandlers();
  }

  get template() {
    return createEditingFormTemplate(this._state, this.#destinations, this.#offers, this.#isPointEdit);
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
    this.element.querySelector('form.event--edit.event--edit-new')?.addEventListener('submit', this.#formNewSubmitHandler);
    this.element.querySelector('form.event--edit')?.addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#closeEditBtnClickHandle);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);

    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#descriptionInputHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.#setDatepickerDateFrom();
    this.#setDatepickerDateTo();
  }

  #submitFormHandler = (evt) => {
    evt.preventDefault();

    if (this._state.price === '') {
      return;
    }

    this.#handleFormSubmit?.(EditingFormView.parseStateToPoint(this._state));
  };

  #formNewSubmitHandler = (evt) => {
    evt.preventDefault();

    if (this._state.destination === null || this._state.price === '') {
      return;
    }

    this.#handleEditPointNewSubmit?.(EditingFormView.parseStateToPoint(this._state));
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

  #priceChangeHandler = (evt) => {
    this.updateElement({
      price: Number(evt.target.value),
    });
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

      this._state.offers.splice(index, 1);
      this._setState(this._state);
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
        defaultDate: this._state.dateTo,
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

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick?.(EditingFormView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isDeleting: false,
      isSaving: false};
  }

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isDeleting;
    delete point.isSaving;

    return point;
  };
}
