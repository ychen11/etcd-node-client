var grpc = require('grpc');

var PROTO_PATH = __dirname + '/../proto/rpc.proto';

function Client(endpoint) {
  var etcd = grpc.load(PROTO_PATH).etcdserverpb;

  if (typeof endpoint !== 'string') {
    throw Error ('`endpoint` should be a string');
  }

  if (endpoint === '') {
    throw Error ('`endpoint` should not be empty');
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
    callback('Input data type error');
    return;
  }

  data.key = new Buffer(key);
  data.value = new Buffer(value);
  data.lease = lease;

  this.connector.kv.put(data, callback);
}


Client.prototype.range = function(rangeRequest, callback) {
  if (typeof rangeRequest !== 'object') {
    throw Error ('`rangeRequest` must be an object');
  }

  this.connector.kv.range(rangeRequest, callback);
}


exports.Client = Client;
