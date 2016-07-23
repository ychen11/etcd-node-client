var error = require('./error');
var lb = require('./cluster/lb');


function leaseGrant (leaseGrantRequest, callback) {
  if (typeof leaseGrantRequest !== 'object') {
    callback(error.SYSTEM_ERROR.LEASE.LEASEGRANT_TYPE_ERROR);
    return;
  }

  this.connector.lease[lb.getEndPoint()].leaseGrant(leaseGrantRequest, callback);
}


function leaseRevoke (leaseRevokeRequest, callback) {
  if (typeof leaseRevokeRequest !== 'object') {
    callback(error.SYSTEM_ERROR.LEASE.LEASEREVOKE_TYPE_ERROR);
  }

  this.connector.lease[lb.getEndPoint()].leaseRevoke(leaseRevokeRequest, callback);
}


exports.leaseGrant = leaseGrant;
exports.leaseRevoke = leaseRevoke;