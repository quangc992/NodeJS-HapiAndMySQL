/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

module.exports = {
  PAYMENT_TYPE: {
    ATM_BANK: 0,
    CREDIT_DEBIT: 1,
    ONLINE: 2,
    CRYPTO: 3,
  },
  PLACE_ORDER_ERROR: {
    INVALID_WALLET: 'INVALID_WALLET',
    NOT_ENOUGHT_MONEY: 'NOT_ENOUGHT_MONEY',
    SOMETHING_NOT_RIGHT: 'SOMETHING_NOT_RIGHT',
  },
  PRODUCT_STATUS: {
    NEW: 'New',
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    CANCELED: 'Canceled',
  },
  PRODUCT_TOKEN_TYPE: {
    ERC721: 'ERC721',
    ERC1155: 'ERC1155',
  },
};
