var assert = require('assert');
var clientObj = require('./a');

describe('KV Base', function() {

  var etcdClient = clientObj.client;

  describe('Insert simple data', function () {
    it('Should insert correctly', function (done) {
      etcdClient.kv.put({
        key: new Buffer('name'),
        value: new Buffer('mario'),
        lease: 0
      },function (err, res) {
        assert.ifError(err);
        done();
      });
    });
  });

  describe('Get simple data', function () {
    it ('Should return data correctly', function (done) {
      etcdClient.kv.range({
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
      });
    });
  });

  describe('Delete simple data', function () {
    it ('Should return correct response', function (done) {
      etcdClient.kv.deleteRange({
        key: new Buffer('name')
      }, function (err, res) {
        assert.ifError(err);
        done();
      });
    });
  });

  describe('Re-get deleted data', function () {
    it ('Should return empty result', function (done) {
      etcdClient.kv.range({
        key: new Buffer('name'),
        limit: 1,
        revision: 0,
        sort_order: 'NONE',
        sort_target: 'KEY',
        serializable: false,
        keys_only: false,
        count_only: false
      }, function (err, res) {
        assert.ifError(err);
        assert.strictEqual(res.kvs.length, 0);
        done();
      });
    });
  });

  describe('Transaction ops', function () {
    it ('Should return correct response', function (done) {
      etcdClient.kv.txn({
        compare: [
          {
            result: 'EQUAL',
            target: 'CREATE',
            key: new Buffer('name'),
            version: 1
          }
          ],
        success: [
          {
            request_put: {
              key: new Buffer('id'),
              value: new Buffer('123'),
              lease: 0
            }
          },
          {
            request_put: {
              key: new Buffer('uid'),
              value: new Buffer('yoyoyo'),
              lease: 0
            }
          }
          ],
        failure: []
      }, function (err, res) {
        done();
      });
    });
  });

  describe('Compact ops', function () {
    it ('Should return correct response', function (done) {
      etcdClient.kv.compact({
        revision: 5,
        physical: false
      }, function (err, res) {
        assert.ifError(err);
        done();
      });
    });
  });
});

