var grpc = require('grpc');
var _ = require('underscore');
var kv = require('./kv');
var lease = require('./lease');
var watch = require('./watch');
var maintenance = require('./maintenance');
var error = require('./error');
var settings = require('./settings');
var failover = require('./cluster/failover');
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
  var etcd = grpc.load(PROTO_PATH).etcdserverpb;

  if (!endpoints instanceof Array) {
    throw Error (error.SYSTEM_ERROR.CLIENT.ENDPOINTS_TYPE_ERROR);
  }

  if (endpoints.length === 0) {
    throw Error (error.SYSTEM_ERROR.CLIENT.ENDPOINTS_NOT_SET);
  }

  lb.init(endpoints, lbAlgo);

  this.connector = {};
  this.connector.kv = [];
  this.connector.lease = [];
  this.connector.watch = [];
  this.connector.maintenance = [];

  _.each(settings.endPoints, function (value) {
    var kvConnection = new etcd.KV(value, grpc.credentials.createInsecure()),
        leaseConnection = new etcd.Lease(value, grpc.credentials.createInsecure()),
        watchConnection = new etcd.Watch(value, grpc.credentials.createInsecure()),
        maintenanceConnection = new etcd.Maintenance(value, grpc.credentials.createInsecure());

    this.connector.kv.push(kvConnection);
    this.connector.lease.push(leaseConnection);
    this.connector.watch.push(watchConnection);
    this.connector.maintenance.push(maintenanceConnection);
  }.bind(this));

  // bind all methods to the kv service
  this.kv = {
    range: kv.range.bind(this),
    put: kv.put.bind(this),
    deleteRange: kv.deleteRange.bind(this),
    txn: kv.txn.bind(this),
    compact: kv.compact.bind(this)
  };

  // bind all lease service methods
  this.lease = {
    leaseGrant: lease.leaseGrant.bind(this),
    leaseKeepAlive: lease.leaseKeepAlive.bind(this),
    leaseRevoke: lease.leaseRevoke.bind(this)
  };

  this.watcher = new watch.Watcher(this);

  this.maintenance = {
    getStatus: maintenance.status.bind(this),
    getLeaderId: maintenance.getLeaderId.bind(this)
  };


  failover.refresh(this.connector.maintenance);
}

exports.Client = Client;
