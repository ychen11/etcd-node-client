var assert = require('assert');
var clientObj = require('./a');

describe('Maintenance', function() {
  var etcdClient = clientObj.client,
      leaderId = null;

  describe('Get status', function () {
    it ('Should return the cluster status', function (done) {
      etcdClient.maintenance.getStatus(function (err, res) {
        assert.ifError(err);
        leaderId = res.leader;
        done();
      });
    });

    it ('Should return the leader id', function (done) {
      etcdClient.maintenance.getLeaderId(function (err, res) {
        assert.ifError(err);
        assert.strictEqual(res, leaderId);
        done();
      })
    })
  });
});