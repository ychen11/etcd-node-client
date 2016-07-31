var assert = require('assert');
var clientObj = require('./a');


describe('Watch ops', function() {
  var etcdClient = clientObj.client;

  describe('Create', function () {
    it ('Should return the created watch id', function (done) {
      etcdClient.watcher.on('created', function (id) {
        assert.ok(id);
        etcdClient.watcher.close();
        done();
      });

      etcdClient.watcher.create({
        create_request: {
          key: new Buffer('name')
        }
      });
    });
  });
});