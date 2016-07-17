exports.SYSTEM_ERROR = {
  CLIENT: {
    ENDPOINTS_TYPE_ERROR: '`endpoints` should be an array',
    ENDPOINTS_NOT_SET: '`enpoidnts` should not be empty'
  },

  KV: {
    PUT_TYPE_ERROR: 'Input data type error',
    RANGE_TYPE_ERROR: '`rangeRequest` must be an object',
    DELETE_TYPE_ERROR: '`deleteRequest` must be an object',
    TXN_TYPE_ERROR: '`txnRequest` must be an object'
  }
};