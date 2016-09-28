var assert = require('assert');
var clientObj = require('./a');


describe('Watch ops', function() {
  var etcdClient = clientObj.client,
      count = 0;

  describe('Created kv', function () {
    it ('Added new kv pair', function(done) {
      etcdClient.kv.put({
        key: new Buffer('id'),
        value: new Buffer('koopa'),
        lease: 0
      }, function (err, res) {
        assert.ifError(err);
        done();
      });
    });
  });

  describe('Create two watchers', function () {
    it ('Should return the created watch id', function (done) {
      var reqs = [];

      etcdClient.watcher.on('created', function (request, id) {
        assert.ok(id);
        reqs.push(request);
        count++;
        if (count === 2) {
          assert.strictEqual('name', reqs[0].key.toString());
          assert.strictEqual('id', reqs[1].key.toString());
          done();
        }
      });

      etcdClient.watcher.create({
        create_request: {
          key: new Buffer('name')
        }
      });

      etcdClient.watcher.create({
        create_request: {
            key: new Buffer('id')
        }
      });
    });
  });

  describe('Events', function () {
    it ('Should return the actual event', function (done) {
      etcdClient.watcher.on('events', function (res) {
        assert.ok(res);
        assert.strictEqual(res.events[0].kv.key.toString(), 'id');
        assert.strictEqual(res.events[0].kv.value.toString(), 'luigi');
        done();
      });

      etcdClient.kv.put({
        key: new Buffer('id'),
        value: new Buffer('luigi'),
        lease: 0
      }, function (err, res) {
        assert.ifError(err);
      });
    })
  });

  describe('Cancel', function() {
    it ('Should return the created watch id', function (done) {
      etcdClient.watcher.on('canceled', function (id) {
        assert.ok(id);
        etcdClient.watcher.close();
        done();
      });

      etcdClient.watcher.cancel('0');
    });
  });
});

