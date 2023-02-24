/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

module.exports = {
  PLACE_ORDER_ERROR: {
    INVALID_WALLET: 'INVALID_WALLET',
    NOT_ENOUGHT_MONEY: 'NOT_ENOUGHT_MONEY',
    SOMETHING_NOT_RIGHT: 'SOMETHING_NOT_RIGHT',
    EXCEED_LIMIT_ORDER_QUANTITY: 'EXCEED_LIMIT_ORDER_QUANTITY',
    MUST_UNIQUE_TICKET_ID: 'MUST_UNIQUE_TICKET_ID',
    FAILED: 'failed',
    PRODUCT_OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK',
  },
  PRODUCT_ORDER_STATUS: {
    NEW: 'New',
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    CANCELED: 'Canceled',
  },
  PRODUCT_ORDER_TYPE: {
    SINGLE: 'SINGLE',
    BATCH: 'BATCH',
    BUY: 'BUY',
    SELL: 'SELL',
  },
};
