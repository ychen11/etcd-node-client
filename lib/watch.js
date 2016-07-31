var util = require('util');
var Emitter = require('events').EventEmitter;
var error = require('./error');
var lb = require('./cluster/lb');


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
    }

    if (response.canceled === true) {
      self.emit('canceled', response.watch_id);
    }
  });

  this.close = function (message) {
    self.watchConn.end(message);
  };
};


util.inherits(watcher, Emitter);

exports.Watcher = watcher;
