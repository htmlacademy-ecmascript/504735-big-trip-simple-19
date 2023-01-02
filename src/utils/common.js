function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

//Генератор числа в диапазоне.
const getRandomNumber = (from, to) => Math.floor(Math.random() * (to - from + 1)) + from;

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {getRandomArrayElement, getRandomNumber, updateItem};
