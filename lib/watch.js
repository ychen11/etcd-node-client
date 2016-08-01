var util = require('util');
var Emitter = require('events').EventEmitter;
var error = require('./error');
var lb = require('./cluster/lb');



/** 
 * watcher is the watch class
 * @param {Object} client is the watch service connection client.
 */
var watcher = function (client) {
  
  var self = this;

  self.watchConn = client.connector.watch[lb.getEndPoint()].watch();

  this.create = function (watchRequest) {
    self.watchConn.write(watchRequest);
  };

  this.cancel = function (watchId) {
    var cancelRequest = {
      watch_id: watchId
    };

    self.watchConn.write(cancelRequest);
  }

  this.watchConn.on('data', function(response) {
    if (response.created === true) {
      self.emit('created', response.watch_id);
      return;
    }

    if (response.canceled === true) {
      self.emit('canceled', response.watch_id);
      return;
    }

    if (response.events.length !== 0) {
      self.emit('events', response.events);
      return;
    }
  });

  this.close = function (message) {
    self.watchConn.end(message);
  };
};


util.inherits(watcher, Emitter);

/** export the watcher class */
exports.Watcher = watcher;
