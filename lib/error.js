exports.SYSTEM_ERROR = {
  CLIENT: {
    ENDPOINTS_TYPE_ERROR: '`endpoints` should be an array',
    ENDPOINTS_NOT_SET: '`enpoidnts` should not be empty'
  },

  KV: {
    PUT_TYPE_ERROR: 'Input data type error',
    RANGE_TYPE_ERROR: '`rangeRequest` must be an object',
    DELETE_TYPE_ERROR: '`deleteRequest` must be an object',
    TXN_TYPE_ERROR: '`txnRequest` must be an object',
    COMPACT_TYPE_ERROR: '`compactionRequest` must be an object'
  },

  LEASE: {
    LEASEGRANT_TYPE_ERROR: '`leaseGrantRequest` must be an object',
    LEASEREVOKE_TYPE_ERROR: '`leaseRevokeRequest` must be an object'
  },

  WATCH: {
    CREATEREQ_TYPE_ERROR: '`watchRequest` must be an object',
    CANCEL_TYPE_ERROR: '`watchId` must be a string'
  }
};