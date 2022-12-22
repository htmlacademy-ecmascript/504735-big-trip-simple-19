import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

//Генератор числа в диапазоне.
const getRandomNumber = (from, to) => Math.floor(Math.random() * (to - from + 1)) + from;

const getRandomDate = () => new Date();

const isLongerDate = (date, minuteRange = 60, hourRange = 12) => {
  const newDate = new Date(date);
  newDate.setHours(date.getHours() + getRandomNumber(1, hourRange));
  newDate.setMinutes(date.getMinutes() + getRandomNumber(0, minuteRange));
  return newDate;
};

//Функции форматирования дат:
const humanizeDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');
const humanizePointDate = (date) => dayjs(date).format('MMM D');
const humanizePointTime = (date) => dayjs(date).format('HH:mm');

// Функция подсчёта времени пребывания в точке
const calculateDurationInPoint = (startDate, endDate) => {
  const dateFrom = dayjs(startDate);
  const dateTo = dayjs(endDate);
  const differenceInMinutes = dateTo.diff(dateFrom, 'minute');

  switch (true) {
    case (dateTo.diff(dateFrom, 'days') >= 1):
      return dayjs.duration(differenceInMinutes, 'minute').format('DD[D] HH[H] mm[M]');
    case (dateTo.diff(dateFrom, 'hours') >= 1):
      return dayjs.duration(differenceInMinutes, 'minute').format('HH[H] mm[M]');
    default:
      return dayjs.duration(differenceInMinutes, 'minute').format('mm[M]');
  }
};


export {getRandomArrayElement, getRandomNumber, isLongerDate, getRandomDate, humanizePointDate, humanizeDate, humanizePointTime, calculateDurationInPoint};
