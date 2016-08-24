var _ = require('underscore');
var settings = require('../settings');
var lb = require('./lb');


var clients = null;


function startUpdating () {
  if (clients === null) {
    return;
  }

  setInterval(function() {
    var ep = lb.getEndPoint(),
        idx = 0;

    clients[ep].status({}, function(err, res) {
      if (err && err.code == 14) {
        idx = settings.endPoints.indexOf(ep);
        settings.endPoints.splice(idx, 1);
        lb.update();
      }
    });
  }, 500);
}


function refresh (maintenanceConnectors) {
  clients = maintenanceConnectors;

  startUpdating();
}


exports.refresh = refresh;

