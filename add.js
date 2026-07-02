/* // tek exportsa
module.exports = function topla(a, b) {
  return a + b;
};

// çoklu exportsa
module.exports.topla = function topla(a, b) {
  return a + b;
};

module.exports.cikar = function cikar(a, b) {
  return a - b;
}; */

function topla(a, b) {
  return a + b;
}

function cikar(a, b) {
  return a - b;
}

module.exports = { topla, cikar };
