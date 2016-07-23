var assert = require('assert');
var clientObj = require('./a');

describe('Lease KV', function() {
  var etcdClient = clientObj.client;

  describe('Create Lease', function () {
    it ('Should return the created lease', function (done) {
      etcdClient.lease.leaseGrant({
        ID: 1,
        TTL: 500
      },function (err, res) {
        assert.ifError(err);
        done();
      });
    });
  });

  describe('Create Lease', function () {
    it ('Should return the revoked lease', function (done) {
      etcdClient.lease.leaseRevoke({
        ID: 1
      },function (err, res) {
        assert.ifError(err);
        done();
      });
    });
  });
});