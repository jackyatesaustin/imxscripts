function random() {
  const min = 1;
  const max = 1000000000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  random: random
};