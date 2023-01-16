import {getRandomRoutePoint, availableOffers, destinations} from './../mock/points.js';

const POINTS_COUNT = 5;

export default class PointsModel {
  #points = Array.from({length: POINTS_COUNT}, getRandomRoutePoint);
  #destinations = destinations;
  #offers = availableOffers;

  get points() {
    return this.#points;
  }

  get allDestinations() {
    return this.#destinations;
  }

  get allOffersByType() {
    return this.#offers;
  }
}
