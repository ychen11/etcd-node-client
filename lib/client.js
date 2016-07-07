var gprc = require('grpc');

var PROTO_PATH = __dirname + '/../proto/rpc.proto';

function Client(endpoints) {
  var etcd = grpc.load(PROTO_PATH).etcdserverpb;

  this.endpoints = endpoints | [];
  this.connector = {
    kv: new etcd.KV('127.0.0.1:2379', grpc.credentials.createInsecure());
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


exports.Client = Client;