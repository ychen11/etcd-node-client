# etcd-node-client
A gRPC based etcd client which supports etcd V3 api, written in node.js

### Prerequisites:
* etcd version supported: > 3.0.0
* node.js version supported: > 0.12 (grpc only works on node 0.12 or above)

### About this client:
* Currently it supports some but not all v3.0 APIs (Adding). Please check out [this](https://github.com/coreos/etcd/blob/master/Documentation/dev-guide/api_reference_v3.md) for more about etcd official API. 
* Proto files are directly copied from etcd repo, if there is something wrong, please check create an issue here and follow the etcd official proto files.

### How to install
```
npm install etcd-node-client
```

### etcd V3.0 APIs supported (Updating):
* KV service:
  - put
  - range
  - deleteRange
  - txn
  - compact

* Lease service:
  - leaseGrant
  - leaseRevoke
* Watch service:
  Watch service is a streaming api, please check [this](#watch) out
* [Maintenance](#maintenance):
  - status (same as official api)
  - getLeaderId

### How to use (Take the KV service as an example):
* Create a client:
```javascript
var etcd = require('etcd-node-client');

var endpoints = ['127.0.0.1:2379', '127.0.0.1:22379', '127.0.0.1:32379'];
var lbAlgorithm = 'RoundRobin';

var client = new etcd.Client(endpoints, lbAlgorithm);
```

* Put a kv value:
```javascript
client.kv.put({
  key: new Buffer('name'),
  value: new Buffer('mario'),
  lease: 0
},function (err, res) {
  if (err) {
    console.log(err);
  }
});
```

* get a kv value:
```javascript
client.kv.range({
  key: new Buffer('name'),
  limit: 1,
  revision: 0,
  sort_order: 'NONE',
  sort_target: 'KEY',
  serializable: true,
  keys_only: false,
  count_only: false
}, function (err, res) {
  console.log(res.kvs[0].value.toString()); //This will print 'mario'
});
```

* Delete a kv value:
```javascript
client.kv.deleteRange({
  key: new Buffer('name')
}, function (err, res) {
  if (err) {
    console.dir(err);
  }
});
```

* Transaction ops:
```javascript
client.kv.txn({
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
        lease: 0}
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
  if (err) {
    console.dir(err);
  }
});
```

### Watch:
Watch is a bit different from the official v3 api, this is how we use watch:

* Create a watcher on a key:
```javascript
client.watcher.create({create_request: new Buffer('uid')});
```
* A watcher created:
```javascript
client.watcher.on('created', function (request, id) {
  console.log(request.key + ''); //request is the watch reqeust body, it contains watched key and other info.
  console.log(id); //id is the watch_id when a key watcher created successfully.
});
```

* Cancel/delete a watcher:
```javascript
client.watcher.cancel('0'); //'0' is the watcher id which associated to the watched key.
```
* A watcher canceled/deleted:
```javascript
client.watcher.on('canceled', function (id) {
  console.log(id); //id is the watcher id.
});
```

* Events happened on a watcher:
```javascript
client.watcher.on('events', function (res) {
  console.dir(res);
  /***********
  res has two fields: 'id' and 'events'
  id is the watcher id
  events is an array which contains all events happened:
  {id: '1'
   events: [ { type: 'PUT',
    kv:
     { key: [Object],
       create_revision: '449',
       mod_revision: '449',
       version: '1',
       value: [Object],
       lease: '0' },
    prev_kv: null } ]}
  **************/
});
```

* Close the watch stream:
```javascript
client.watcher.close(message); //message is optional
```

### Maintenance:

* status
```javascript
client.maintenance.status(function(err, res) {
  console.dir(res); //res is the response object
});
```

* getLeaderId
```javascript
client.maintenance.getLeaderId(function (err, res) {
  console.log(res); //res should be the leader id, like '10501334649042878790'
});
```

### License
* MIT.
