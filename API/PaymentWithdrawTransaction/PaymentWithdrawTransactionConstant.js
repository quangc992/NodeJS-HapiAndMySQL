/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

module.exports = {
  WITHDRAW_TRX_STATUS: {
    NEW: 'New',
    WAITING: 'Waiting',
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    DELETED: 'Deleted',
    CANCELED: 'Canceled',
  },
  WITHDRAW_TRX_CATEGORY: {
    BANK: 'ATM/BANK',
    DIRECT_REWARD: 'DIRECT_REWARD', // cong tien truc tiep
  },
  WITHDRAW_TRX_UNIT: {
    VND: 'VND',
    USDT: 'USDT',
  },
  WITHDRAW_TRX_TYPE: {
    USER_WITHDRAW: 'USER_WITHDRAW',
    ADMIN_WITHDRAW: 'ADMIN_WITHDRAW',
    AUTO_WITHDRAW: 'AUTO_WITHDRAW',
  },
  INVALID: {
    INVALID_PAYMENTNOTE: undefined,
    INVALID_WALLET: undefined,
    INVALID_BANKINFOMATION: undefined,
  },
};
