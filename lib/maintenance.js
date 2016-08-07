var util = require('util');
var Emitter = require('events').EventEmitter;
var error = require('./error');
var lb = require('./cluster/lb');


/**
 * status function will retrieve the cluster
 * status.
 * 
 * @param {Object} statusRequest should be an empty object {}
 * @param {Function} callback function called with (err, res)
 */
function status(callback) {
  this.connector.maintenance[lb.getEndPoint()].status({}, callback);
}


/**
 * getLeaderId will return the leader node id.
 *
 * @param {Function} callback function called with (err, res), res is the id
 */
function getLeaderId(callback) {
  this.connector.maintenance[lb.getEndPoint()].status({}, function(err, res) {
    if (err) {
      callback(err);
      return;
    }

    callback(null, res.leader);
  });
}

/** export the status function */
exports.status = status;

/** export the getLeaderId function */
exports.getLeaderId = getLeaderId;
