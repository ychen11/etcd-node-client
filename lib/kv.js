var error = require('./error');
var lb = require('./cluster/lb');


/**
 * range function, gets the range of keys kv set.
 *
 * @param {Object} rangeRequest the range request defined in proto file
 * @param {Function} callback function called with (err, res)
 */
function range (rangeRequest, callback) {
  if (typeof rangeRequest !== 'object') {
    callback(error.SYSTEM_ERROR.KV.RANGE_TYPE_ERROR);
    return;
  }

  this.connector.kv[lb.getEndPoint()].range(rangeRequest, callback);
}


/**
 * put function, writes the kv data to etcd server.
 *
 * @param {Object} putRequest the put request defined in proto file
 * @param {Function} the callback function called with (err, res)
 */
function put (putRequest, callback) {
  if (typeof putRequest !== 'object') {
    callback(error.SYSTEM_ERROR.KV.PUT_TYPE_ERROR);
    return;
  }
  
  this.connector.kv[lb.getEndPoint()].put(putRequest, callback);
}


/**
 * delteRange, delets the kv sets from etcd server.
 *
 * @param {Object} deleteRequest the delete request defined in proto file
 * @param {Function} the callback function called with (err, res)
 */
function deleteRange (deleteRequest, callback) {
  if (typeof deleteRequest !== 'object') {
    callback(error.SYSTEM_ERROR.KV.DELETE_TYPE_ERROR);
    return;
  }

  this.connector.kv[lb.getEndPoint()].deleteRange(deleteRequest, callback);
}


/**
 * transaction ops, make a transaction (include put, range and delete range).
 *
 * @param {Object} txnRequest the transaction request defined in proto file
 * @param {Function} the callback function called with (err, res)
 */
function transaction (txnRequest, callback) {
  if (typeof txnRequest !== 'object') {
    callback(error.SYSTEM_ERROR.KV.TXN_TYPE_ERROR);
    return;
  }

  this.connector.kv[lb.getEndPoint()].txn(txnRequest, callback);
}


function compact (compactionRequest, callback) {
  if (typeof compactionRequest !== 'object') {
    callback(error.SYSTEM_ERROR.KV.COMPACT_TYPE_ERROR);
    return;
  }

  this.connector.kv[lb.getEndPoint()].compact(compactionRequest, callback);
}

/** export the range function */
exports.range = range;

/** export the put function */
exports.put = put;

/** export the deleteRange function */
exports.deleteRange = deleteRange;

/** export the transaction function */
exports.txn = transaction;

/*8 export the compact function */
exports.compact = compact;
