// function getRandomArrayElement(items) {
//   return items[Math.floor(Math.random() * items.length)];
// }

//Генератор числа в диапазоне.
const getRandomNumber = (from, to) => Math.floor(Math.random() * (to - from + 1)) + from;


export { getRandomNumber};
