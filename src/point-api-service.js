import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(point) {
    const adaptedPoints = {
      ...point,
      'is_favorite': point.isFavorite,
      'base_price': point.price,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoints.dateTo;
    delete adaptedPoints.dateFrom;
    delete adaptedPoints.price;
    delete adaptedPoints.isFavorite;

    return adaptedPoints;
  }
}