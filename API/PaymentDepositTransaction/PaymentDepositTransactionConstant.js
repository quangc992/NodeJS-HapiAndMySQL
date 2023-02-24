/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

module.exports = {
  DEPOSIT_TRX_STATUS: {
    NEW: 'New',
    WAITING: 'Waiting',
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    DELETED: 'Deleted',
    CANCELED: 'Canceled',
  },
  DEPOSIT_TRX_CATEGORY: {
    BANK: 'ATM/BANK',
    FROM_BONUS: 'FROM_BONUS',
    BLOCKCHAIN: 'BLOCKCHAIN',
  },
  DEPOSIT_TRX_UNIT: {
    VND: 'VND',
    USDT: 'USDT',
  },
  DEPOSIT_TRX_TYPE: {
    USER_DEPOSIT: 'USER_DEPOSIT',
    ADMIN_DEPOSIT: 'ADMIN_DEPOSIT',
    AUTO_DEPOSIT: 'AUTO_DEPOSIT',
  },
  DEPOSIT_ERROR: {
    NO_BANK_ACCOUNT_INFORMATION: 'No bank account information',
  },
  IS_USER_DEPOSIT: {
    COMPLETED: 1,
    CANCEL: 0,
  },
};
