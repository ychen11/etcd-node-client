# etcd-node-client
A gRPC based etcd client written in node.js

### Prerequisites:
* etcd version supported: > 3.0.0
* node.js version supported: > 0.12 (grpc only works on node 0.12 or above)

### About this client:
* It is still in progress, currently it supports some but not all v3.0 APIs (Adding). Please check out [this](https://github.com/coreos/etcd/blob/master/Documentation/dev-guide/api_reference_v3.md) for more about etcd official API. 
* Proto files are directly copied from etcd repo, if there is something wrong, please check create an issue here and follow the etcd official proto files.

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

### License
* MIT.
