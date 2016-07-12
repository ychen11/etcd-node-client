var error = require('./error');


/**
 * range function, gets the range of keys kv set.
 *
 * @param {Object} rangeRequest the range request defined in proto file
 * @param {Function} callback function called with (err, res)
 */
function range (rangeRequest, callback) {
  if (typeof rangeRequest !== 'object') {
    callback(error.KV.RANGE_TYPE_ERROR);
    return;
  }

  this.connector.kv.range(rangeRequest, callback);
}


/**
 * put function, writes the kv data to etcd server.
 *
 * @param {Object} putRequest the put request defined in proto file
 * @param {Function} the callback function called with (err, res)
 */
function put (putRequest, callback) {
  if (typeof putRequest !== 'object') {
    callback(error.KV.PUT_TYPE_ERROR);
    return;
  }

  this.connector.kv.put(putRequest, callback);
}


/**
 * delteRange, delets the kv sets from etcd server.
 *
 * @param {Object} deleteRequest the delete request defined in proto file
 * @param {Function} the callback function called with (err, res)
 */
function deleteRange (deleteRequest, callback) {
  if (typeof deleteRequest !== 'object') {
    callback(error.KV.DELETE_TYPE_ERROR);
    return;
  }

  this.connector.kv.deleteRange(deleteRequest, callback);
}

/** export the range function */
exports.range = range;

/** export the put function */
exports.put = put;

/** export the deleteRange function */
exports.deleteRange = deleteRange;
