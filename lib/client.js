var grpc = require('grpc');
var _ = require('underscore');
var kv = require('./kv');
var error = require('./error');
var settings = require('./settings');
var lb = require('./cluster/lb');


var PROTO_PATH = __dirname + '/../proto/rpc.proto';


/**
 * @Constructor
 * Init the etcd node client.
 *
 * @param {String} the endpoint of one etcd server, endpoint format 
 *                 must be like '127.0.0.1:2379'.
 */
function Client(endpoints, lbAlgo) {
  var etcd = grpc.load(PROTO_PATH).etcdserverpb,
      self = this;

  if (!endpoints instanceof Array) {
    throw Error (error.SYSTEM_ERROR.CLIENT.ENDPOINTS_TYPE_ERROR);
  }

  if (endpoints.length === 0) {
    throw Error (error.SYSTEM_ERROR.CLIENT.ENDPOINTS_NOT_SET);
  }

  lb.init(endpoints, lbAlgo);
  
  this.connector = {};
  this.connector.kv = [];

  _.each(settings.endPoints, function (value) {
    var kvConnection = new etcd.KV(value, grpc.credentials.createInsecure());
    self.connector.kv.push(kvConnection);
  });

  // bind all methods to the kv service 
  this.kv = {
    range: kv.range.bind(self),
    put: kv.put.bind(self),
    deleteRange: kv.deleteRange.bind(self),
    txn: kv.txn.bind(self),
    compact: kv.compact.bind(self)
  }
}

exports.Client = Client;
