var _ = require('underscore');
var settings = require('../settings');


var LB_METHOD = null;


function roundRobin () {

}

function random () {

}

function none () {
  
}

exports.setMethod = function (method) {
  _.each(settings.loadBalanceMethod, function (value, key) {
    if (value === true) {
      LB_METHOD = key;
    }
  });
}

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