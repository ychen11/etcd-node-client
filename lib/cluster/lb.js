var _ = require('underscore');
var settings = require('../settings');


var LB_METHOD = null;
var EP_LENGTH = 0;
var RR_INDEX = 0;


/**
 * Simple Round-Robin
 *
 * @return {Number} the seleceted index of endpoints array.
 */
function roundRobin () {
  var idx = 0;

  if (RR_INDEX === EP_LENGTH) {
    RR_INDEX = 0;
  }

  idx = RR_INDEX;
  RR_INDEX++;

  return idx;
}


/**
 * Random
 *
 * @return {Number} the seleceted index of endpoints array.
 */
function random () {
  return Math.floor(Math.random() * EP_LENGTH);
}


/**
 * None LB algorithm means always returns the first endpoint.
 *
 * @return {Number} index 0 is the first elementof endpoints array
 */
function none () {
  return 0;
}


/**
 * Choose the LB algorithm.
 * 
 * @param {String} algorithm name.
 */
function setAlgo(algorithm) {

  if (algorithm) {
    settings.loadBalanceMethod[algorithm] = true;
  } else {
    settings.loadBalanceMethod['None'] = true;
  }

  _.each(settings.loadBalanceMethod, function (value, key) {
    if (value === true) {
      LB_METHOD = key;
    }
  });
}


exports.init = function (endpoints, algo) {
  settings.endPoints = endpoints;
  setAlgo(algo);

  EP_LENGTH = settings.endPoints.length;
}


exports.update = function () {
  EP_LENGTH = settings.endPoints.length;
}

/**
 * get End point.
 * 
 * @return {Number} the endpoint index.
 */
exports.getEndPoint = function () {
  if (settings.endPoints.length === 0) {
    return null;
  }

  switch (LB_METHOD) {
    case 'RoundRobin':
      return roundRobin();
      break;
    case 'Random':
      return random();
      break;
    case 'None':
      return none();
      break;
    default:
      return null;
  }
};