var grpc = require('grpc');
var kv = require('./kv');
var error = require('./error');


var PROTO_PATH = __dirname + '/../proto/rpc.proto';


/**
 * @Constructor
 * Init the etcd node client.
 *
 * @param {String} the endpoint of one etcd server, endpoint format 
 *                 must be like '127.0.0.1:2379'.
 */
function Client(endpoint) {
  var etcd = grpc.load(PROTO_PATH).etcdserverpb,
      self = this;

  if (typeof endpoint !== 'string') {
    throw Error (error.CLIENT.ENDPOINT_TYPE_ERROR);
  }

  if (endpoint === '') {
    throw Error (error.CLIENT.ENDPOINT_NOT_SET);
  }

  this.connector = {
    kv: new etcd.KV(endpoint, grpc.credentials.createInsecure())
  }

  // bind all methods to the kv service 
  this.kv = {
    range: kv.range.bind(self),
    put: kv.put.bind(self),
    deleteRange: kv.deleteRange.bind(self),
    txn: kv.txn.bind(self)
  }
}

exports.Client = Client;
