exports.SYSTEM_ERROR = {
  CLIENT: {
    ENDPOINT_TYPE_ERROR: '`endpoint` should be a string',
    ENDPOINT_NOT_SET: '`enpoidnt` should not be empty',
  },

  KV: {
    PUT_TYPE_ERROR: 'Input data type error',
    RANGE_TYPE_ERROR: '`rangeRequest` must be an object',
    DELETE_TYPE_ERROR: '`deleteRequest` must be an object',
    TXN_TYPE_ERROR: '`txnRequest` must be an object'
  }
};