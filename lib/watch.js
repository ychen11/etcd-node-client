var util = require('util');
var Emitter = require('events').EventEmitter;
var error = require('./error');
var lb = require('./cluster/lb');


var queue = [];


/**
 * Use queue to cache and re-order the incoming create watch request.
 * This will keep tracking the watch requests correctly.
 */
function enqueue (item) {
  queue.push(item);
}

function top () {
  if (queue.length === 0) {
    return null;
  }

  return queue[0];
}

function dequeue () {
  if (queue.length === 0) {
    return null;
  }

  return queue.shift();
}


/**
 * watcher is the watch class
 * @param {Object} client is the watch service connection client.
 */
var watcher = function (client) {

  this.watchConn = client.connector.watch[lb.getEndPoint()].watch();

  this.create = function (watchRequest) {
    if (typeof watchRequest !== 'object') {
      return;
    }

    enqueue(watchRequest);
    this.watchConn.write(watchRequest);
  }.bind(this);

  this.cancel = function (watchId) {
    var cancelRequest = {};

    if (typeof watchId !== 'string') {
      return;
    }

    cancelRequest.watch_id = watchId;

    this.watchConn.write({cancel_request: cancelRequest});
  }.bind(this);

  this.watchConn.on('data', function(response) {
    if (response.created === true) {
      this.emit('created', top().create_request, response.watch_id);
      dequeue();
      return;
    }

    if (response.canceled === true) {
      this.emit('canceled', response.watch_id);
      return;
    }

    if (response.events.length !== 0) {
      var res = {
        id: response.watch_id,
        events: response.events
      };

      this.emit('events', res);
      return;
    }
  }.bind(this));

  this.watchConn.on('error', function(err) {
    this.emit('error', err)
  }.bind(this));

  this.watchConn.on('status', function (status) {
    this.emit('status', status);
    //TODO status processor
  }.bind(this));

  this.close = function (message) {
    this.watchConn.end(message);
  }.bind(this);
};


util.inherits(watcher, Emitter);

/** export the watcher class */
exports.Watcher = watcher;
