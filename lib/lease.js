var error = require('./error');
var lb = require('./cluster/lb');

function leaseGrant (leaseGrantRequest, callback) {
  if (typeof leaseGrantRequest !== 'object') {
    callback(error.SYSTEM_ERROR.LEASE.LEASEGRANT_TYPE_ERROR);
    return;
  }

  this.connector.lease[lb.getEndPoint()].leaseGrant(leaseGrantRequest, callback);
}

var leaseKeepAliveRequests = {};
var leaseKeepAliveConns = {};

function leaseKeepAlive (leaseKeepAliveRequest, callback)  {
  if (typeof leaseKeepAliveRequest !== 'object') {
    callback(error.SYSTEM_ERROR.LEASE.LEASEKEEPALIVE_TYPE_ERROR, null);
    return;
  }

  this.leaseKeepAliveConn = this.connector.lease[lb.getEndPoint()].leaseKeepAlive();

  leaseKeepAliveConns[leaseKeepAliveRequest.ID] = this.leaseKeepAliveConn;

  this.leaseKeepAliveConn.on('data', function(response) {
    callback(null, response);
  }.bind(this));

  this.leaseKeepAliveConn.on('error', function(err) {
    callback(err, null);
  }.bind(this));

  this.leaseKeepAliveConn.on('status', function (status) {
    //TODO status processor
  }.bind(this));

  leaseKeepAliveRequests[leaseKeepAliveRequest.ID] = setInterval(function() {
    this.leaseKeepAliveConn.write(leaseKeepAliveRequest);
  }.bind(this), 500);
}

function leaseRevoke (leaseRevokeRequest, callback) {
  if (typeof leaseRevokeRequest !== 'object') {
    callback(error.SYSTEM_ERROR.LEASE.LEASEREVOKE_TYPE_ERROR);
  }

  clearInterval(leaseKeepAliveRequests[leaseRevokeRequest.ID]);
  delete leaseKeepAliveRequests[leaseRevokeRequest.ID];
  var keepAliveConn = leaseKeepAliveConns[leaseRevokeRequest.ID];
  if (keepAliveConn) {
    keepAliveConn.end();
  }

  this.connector.lease[lb.getEndPoint()].leaseRevoke(leaseRevokeRequest, callback);
}

exports.leaseGrant = leaseGrant;
exports.leaseKeepAlive = leaseKeepAlive;
exports.leaseRevoke = leaseRevoke;
