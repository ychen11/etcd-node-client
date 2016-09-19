var assert = require('assert');
var client = require('../');

exports.client = new client.Client(['127.0.0.1:2379', '127.0.0.1:22379', '127.0.0.1:32379'], 'None');

describe('Init', function () {
  it ('Init the client', function () {
    assert.ok(exports.client);
  });
});
