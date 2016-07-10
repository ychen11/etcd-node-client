var grpc = require('grpc');
var error = require('./error');

var PROTO_PATH = __dirname + '/../proto/rpc.proto';

function Client(endpoint) {
  var etcd = grpc.load(PROTO_PATH).etcdserverpb;

  if (typeof endpoint !== 'string') {
    throw Error (error.CLIENT.ENDPOINT_TYPE_ERROR);
  }

  if (endpoint === '') {
    throw Error (error.CLIENT.ENDPOINT_NOT_SET);
  }

  this.connector = {
    kv: new etcd.KV(endpoint, grpc.credentials.createInsecure())
  }
} 


Client.prototype.put = function(key, value, lease, callback) {
  var data = {
    key: null,
    value: null,
    lease: 0
  };

  if (typeof key !== 'string' || 
      typeof value !== 'string' ||
      typeof lease !== 'number') {
    callback(error.KV.PUT_TYPE_ERROR);
    return;
  }

  data.key = new Buffer(key);
  data.value = new Buffer(value);
  data.lease = lease;

  this.connector.kv.put(data, callback);
}


Client.prototype.range = function(rangeRequest, callback) {
  if (typeof rangeRequest !== 'object') {
    callback(error.KV.RANGE_TYPE_ERROR);
    return;
  }

  this.connector.kv.range(rangeRequest, callback);
}


exports.Client = Client;
