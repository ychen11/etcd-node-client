var assert = require('assert');
var client = require('../');

describe('Base', function() {

  var etcdClient = new client.Client('127.0.0.1:2379');

  describe('Insert simple data', function () {
    it('Should insert correctly', function (done) {
      etcdClient.put('name', 'mario', 0, function (err, res) {
        assert.ifError(err);
        done();
      });
    });
  });

  describe('Get simple data', function () {
    it ('Should returns data correctly', function (done) {
      etcdClient.range({
        key: new Buffer('name'),
        limit: 1,
        revision: 0,
        sort_order: 'NONE',
        sort_target: 'KEY',
        serializable: true,
        keys_only: false,
        count_only: false
      }, function (err, res) {
        assert.ifError(err);
        assert.strictEqual(res.kvs[0].value.toString(), 'mario');
        done();
      })
    });
  })
});