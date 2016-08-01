var assert = require('assert');
var clientObj = require('./a');


describe('Watch ops', function() {
  var etcdClient = clientObj.client;

  describe('Create', function () {
    it ('Should return the created watch id', function (done) {
      etcdClient.watcher.on('created', function (id) {
        assert.ok(id);
        done();
      });

      etcdClient.watcher.create({
        create_request: {
          key: new Buffer('name')
        }
      });
    });
  });

  describe('Events', function () {
    it ('Should return the actual event', function (done) {
      etcdClient.watcher.on('events', function (events) {
        assert.ok(events);
        assert.strictEqual(events[0].kv.key.toString(), 'name');
        assert.strictEqual(events[0].kv.value.toString(), 'luigi');
        done();
      });

      etcdClient.kv.put({
        key: new Buffer('name'),
        value: new Buffer('luigi'),
        lease: 0
      },function (err, res) {
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