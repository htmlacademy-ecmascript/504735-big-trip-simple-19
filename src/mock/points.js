import { getRandomArrayElement, getRandomNumber, getRandomDate, isLongerDate } from '../utils';
import { TYPE_POINTS, DESTINATIONS, DESCRIPTIONS} from '../const.js';

const date = getRandomDate();

const availableOffers = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': 1,
        'title': 'Order Uber',
        'price': 20
      },
      {
        'id': 2,
        'title': 'Choose the radio station',
        'price': 5
      },
      {
        'id': 3,
        'title': 'Choose comfort class',
        'price': 10
      }
    ]
  },
  {
    'type': 'bus',
    'offers': [
      {
        'id': 1,
        'title': 'С кондиционером!',
        'price': 20
      },
      {
        'id': 2,
        'title': 'С остановками каждые 30 минут',
        'price': 5
      },
      {
        'id': 3,
        'title': 'Choose comfort class',
        'price': 10
      }
    ]
  },
  {
    'type': 'check-in',
    'offers': [
      {
        'id': 1,
        'title': 'Выбрать время заезда',
        'price': 11
      },
      {
        'id': 2,
        'title': 'Выбрать время выезда',
        'price': 77
      },
      {
        'id': 3,
        'title': 'Add breacfasts',
        'price': 10
      },
      {
        'id': 4,
        'title': 'Заказать еду из ресторана',
        'price': 100
      }
    ]
  },
  {
    'type': 'train',
    'offers': [
      {
        'id': 1,
        'title': 'Add luggage',
        'price': 50
      },
      {
        'id': 2,
        'title': 'Switch to comfort',
        'price': 80
      },
      {
        'id': 3,
        'title': 'Add meal',
        'price': 15
      },
      {
        'id': 4,
        'title': 'Choose seats',
        'price': 5
      },
      {
        'id': 5,
        'title': 'Travel by train',
        'price': 40
      },
    ]
  },
  {
    'type': 'drive',
    'offers': [
      {
        'id': 1,
        'title': 'Rent car',
        'price': 500
      },
      {
        'id': 2,
        'title': 'Buy car',
        'price': 8000
      },
      {
        'id': 3,
        'title': 'Choose class of car',
        'price': 20
      },
      {
        'id': 4,
        'title': 'Travel by train',
        'price': 40
      },
    ]
  },
  {
    'type': 'flight',
    'offers': [
      {
        'id': 1,
        'title': 'Add luggage',
        'price': 50
      },
      {
        'id': 2,
        'title': 'Switch to comfort',
        'price': 80
      },
      {
        'id': 3,
        'title': 'Add meal',
        'price': 15
      },
      {
        'id': 4,
        'title': 'Choose seats',
        'price': 5
      },
      {
        'id': 5,
        'title': 'Travel by train',
        'price': 40
      },
    ]
  },
  {
    'type': 'ship',
    'offers': [
      {
        'id': 1,
        'title': 'Add luggage',
        'price': 50
      },
      {
        'id': 2,
        'title': 'Switch to comfort',
        'price': 80
      },
      {
        'id': 3,
        'title': 'Add meal',
        'price': 15
      },
      {
        'id': 4,
        'title': 'Choose deck',
        'price': 5
      },
      {
        'id': 5,
        'title': 'Travel by train',
        'price': 40
      },
      {
        'id': 6,
        'title': 'Choose express',
        'price': 500
      },
    ]
  },
  {
    'type': 'sightseeing',
    'offers': [
    ]
  },
  {
    'type': 'restaurant',
    'offers': [
      {
        'id': 1,
        'title': 'Order time',
        'price': 4
      },
      {
        'id': 2,
        'title': 'Lunch in city',
        'price': 3
      }
    ]
  }
];

const destinations = [
  {
    'id': 1,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': getRandomArrayElement(DESTINATIONS),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomNumber(1, 100)}`,
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 2,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': getRandomArrayElement(DESTINATIONS),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomNumber(1, 100)}`,
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 3,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': getRandomArrayElement(DESTINATIONS),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomNumber(1, 100)}`,
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 4,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': getRandomArrayElement(DESTINATIONS),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomNumber(1, 100)}`,
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 5,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': getRandomArrayElement(DESTINATIONS),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomNumber(1, 100)}`,
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 6,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': getRandomArrayElement(DESTINATIONS),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomNumber(1, 100)}`,
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 7,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': getRandomArrayElement(DESTINATIONS),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${getRandomNumber(1, 100)}`,
        'description': 'Chamonix parliament building'
      }
    ]
  }
];


const routePoints = [
  {
    id: 1,
    type: getRandomArrayElement(TYPE_POINTS),
    destination: getRandomNumber(1, 10),
    isFavorite: Math.random() < 0.5,
    offers: [1, 2, 3],
    dateFrom: date,
    dateTo: isLongerDate(date),
    price: getRandomNumber(10, 3000)
  },
  {
    id: 2,
    type: getRandomArrayElement(TYPE_POINTS),
    destination: getRandomNumber(1, 10),
    isFavorite: Math.random() < 0.5,
    offers: [ 1, 2, 4, 5],
    dateFrom: date,
    dateTo: isLongerDate(date),
    price: getRandomNumber(1000, 3000)
  },
  {
    id: 3,
    type: getRandomArrayElement(TYPE_POINTS),
    destination: getRandomNumber(1, 10),
    isFavorite: Math.random() < 0.5,
    offers: [1],
    dateFrom: date,
    dateTo: isLongerDate(date),
    price: getRandomNumber(500, 900)
  },
  {
    id: 4,
    type: getRandomArrayElement(TYPE_POINTS),
    destination: getRandomNumber(1, 10),
    isFavorite: Math.random() < 0.5,
    offers: [1, 2, 3, 4, 5, 6],
    dateFrom: date,
    dateTo: isLongerDate(date),
    price: getRandomNumber(100, 3000)
  },
  {
    id: 5,
    type: getRandomArrayElement(TYPE_POINTS),
    destination: getRandomNumber(1, 10),
    isFavorite: Math.random() < 0.5,
    offers: [1, 4, 5, 6],
    dateFrom: date,
    dateTo: isLongerDate(date),
    price: getRandomNumber(10, 100)
  },
];

const getRandomRoutePoint = () => getRandomArrayElement(routePoints);

export {getRandomRoutePoint, availableOffers, destinations};
