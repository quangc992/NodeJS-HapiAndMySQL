/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const { WALLET_TYPE } = require('../Wallet/WalletConstant');
const WalletRecordResourAccess = require('./resourceAccess/WalletRecordResoureAccess');
const WithdrawTransactionResource = require('../PaymentWithdrawTransaction/resourceAccess/PaymentWithdrawTransactionResourceAccess');
const { WALLET_RECORD_TYPE, PAYMENT_AMOUNT } = require('./WalletRecordConstant');
const WalletRecordView = require('./resourceAccess/WalletRecordView');

async function _storeWalletRecordByWalletId(walletId, amount, recordType, staff, walletRecordRef) {
  const UserWallet = require('../Wallet/resourceAccess/WalletResourceAccess');
  let wallet = await UserWallet.findById(walletId);

  if (!wallet || wallet.length < 1) {
    console.error('user wallet is invalid');
    return undefined;
  }

  let historyData = {};
  let resultIncrement;
  historyData = {
    appUserId: wallet.appUserId,
    walletId: wallet.walletId,
    paymentAmount: amount,
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance + amount,
    WalletRecordType: recordType,
    WalletRecordRef: walletRecordRef,
  };

  if (amount > 0) {
    historyData.paymentAmountIn = amount;
    historyData.paymentAmountInOut = 10; //CREDIT
  } else {
    historyData.paymentAmountOut = amount;
    historyData.paymentAmountInOut = 0; //DEBIT
  }
  resultIncrement = UserWallet.incrementBalance(wallet.walletId, amount);

  if (staff) {
    historyData.staffId = staff.staffId;
  }
  if (resultIncrement) {
    let result = await WalletRecordResourAccess.insert(historyData);
    if (result) {
      return result;
    } else {
      console.error('insert deposit transaction error');
      return undefined;
    }
  } else {
    console.error('increment error');
    return undefined;
  }
}

async function _storeWalletRecord(appUserId, amount, walletType, recordType, staff, walletRecordRef) {
  const UserWallet = require('../Wallet/resourceAccess/WalletResourceAccess');
  let wallet = await UserWallet.find(
    {
      appUserId: appUserId,
      walletType: walletType,
    },
    0,
    1,
  );

  if (!wallet || wallet.length < 1) {
    console.error('user wallet is invalid');
    return undefined;
  }

  wallet = wallet[0];
  return _storeWalletRecordByWalletId(wallet.walletId, amount, recordType, staff, walletRecordRef);
}

async function adminRewardForUser(appUserId, amount, walletType, staff, walletRecordRef) {
  return _storeWalletRecord(appUserId, amount, walletType, WALLET_RECORD_TYPE.ADMIN_BONUS, staff, walletRecordRef);
}

async function adminAdjustBalance(appUserId, amount, walletType, staff) {
  return _storeWalletRecord(appUserId, amount, walletType, WALLET_RECORD_TYPE.ADMIN_ADJUST, staff);
}

async function addReferralBonus(appUserId, amount) {
  const WALLET_TYPE = require('../Wallet/WalletConstant').WALLET_TYPE;
  return _storeWalletRecord(appUserId, amount, WALLET_TYPE.BONUS, WALLET_RECORD_TYPE.REFER_BONUS);
}

async function addEventBonus(appUserId, amount) {
  const WALLET_TYPE = require('../Wallet/WalletConstant').WALLET_TYPE;
  return _storeWalletRecord(appUserId, amount, WALLET_TYPE.USDT, WALLET_RECORD_TYPE.EVENT_BONUS);
}

//dieu chinh (them / bot) tien trong vi diem cho user
async function increasePointBalance(appUserId, amount, staff, walletRecordRef) {
  const WALLET_TYPE = require('../Wallet/WalletConstant').WALLET_TYPE;
  return _storeWalletRecord(appUserId, amount, WALLET_TYPE.POINT, WALLET_RECORD_TYPE.EARNED, staff, walletRecordRef);
}

async function depositPointWalletBalance(appUserId, amount, staff) {
  return _storeWalletRecord(appUserId, amount, WALLET_TYPE.POINT, WALLET_RECORD_TYPE.DEPOSIT_POINTWALLET, staff);
}

async function exchangePointFromBonus(appUserId, amount, staff) {
  return _storeWalletRecord(appUserId, amount, WALLET_TYPE.POINT, WALLET_RECORD_TYPE.DEPOSIT_POINTWALLET_FROM_BONUS, staff);
}

async function withdrawWalletBalance(appUserId, amount, walletType, staff, walletRecordRef) {
  let walletRecordType;
  switch (walletType) {
    case WALLET_TYPE.POINT:
      walletRecordType = WALLET_RECORD_TYPE.WITHDRAW_POINTWALLET;
      break;
    case WALLET_TYPE.BONUS:
      walletRecordType = WALLET_RECORD_TYPE.WITHDRAW_BONUSWALLET;
      break;
    case WALLET_TYPE.REWARD:
      walletRecordType = WALLET_RECORD_TYPE.WITHDRAW_REWARDWALLET;
      break;
    case WALLET_TYPE.WIN:
      walletRecordType = WALLET_RECORD_TYPE.WITHDRAW_WINWALLET;
      break;
  }
  return _storeWalletRecord(appUserId, amount, walletType, walletRecordType, staff, walletRecordRef);
}

async function exchangeBonusToPointWalletBalance(appUserId, amount, walletType, staff, walletRecordRef) {
  return _storeWalletRecord(appUserId, amount, walletType, WALLET_RECORD_TYPE.BONUS_EXCHANGE_POINT, staff, walletRecordRef);
}

//dieu chinh (them / bot) tien trong vi diem cho user
async function increaseBalance(appUserId, walletType, walletRecordType, amount, staff, walletRecordRef) {
  return _storeWalletRecord(appUserId, amount, walletType, walletRecordType, staff, walletRecordRef);
}

//dieu chinh (them / bot) tien trong vi diem cho user
async function decreaseBalance(appUserId, walletType, walletRecordType, amount, staff, walletRecordRef) {
  if (amount > 0.0000001) {
    return _storeWalletRecord(appUserId, amount * -1, walletType, walletRecordType, staff, walletRecordRef);
  }
}

async function checkSumWalletById(walletId, appUserId) {
  let walletRecordSumPaymentAmountIn = await WalletRecordResourAccess.customSum('PaymentAmountIn', {
    walletId: walletId,
    appUserId: appUserId,
  });
  let walletRecordSumPaymentAmountOut = await WalletRecordResourAccess.customSum('PaymentAmountOut', {
    walletId: walletId,
    appUserId: appUserId,
  });
  if (walletRecordSumPaymentAmountOut && walletRecordSumPaymentAmountOut.length > 0) {
    walletRecordSumPaymentAmountOut = walletRecordSumPaymentAmountOut[0].sumResult;
  } else {
    walletRecordSumPaymentAmountOut = 0;
  }

  if (walletRecordSumPaymentAmountIn && walletRecordSumPaymentAmountIn.length > 0) {
    walletRecordSumPaymentAmountIn = walletRecordSumPaymentAmountIn[0].sumResult;
  } else {
    walletRecordSumPaymentAmountIn = 0;
  }

  return walletRecordSumPaymentAmountOut + walletRecordSumPaymentAmountIn;
}

async function summaryUserWalletRecord(appUserId, walletType, startDate, endDate) {
  let resultCount = await WalletRecordView.customSum('paymentAmount', { appUserId: appUserId, WalletRecordType: walletType }, startDate, endDate);

  if (resultCount && resultCount.length > 0 && resultCount[0].sumResult !== null) {
    return resultCount[0].sumResult;
  } else {
    return 0;
  }
}

async function exchangeToOtherUser(appUserId, amount) {
  return _storeWalletRecord(appUserId, amount * -1, WALLET_TYPE.POINT, WALLET_RECORD_TYPE.PAYMENT_EXCHANGE_SEND);
}

async function receiveExchangeFromOther(walletId, amount) {
  return _storeWalletRecordByWalletId(walletId, amount, WALLET_RECORD_TYPE.PAYMENT_EXCHANGE_RECEIVE);
}

async function refundExchange(walletId, amount) {
  return _storeWalletRecordByWalletId(walletId, amount, WALLET_RECORD_TYPE.PAYMENT_EXCHANGE_REFUND);
}
module.exports = {
  adminRewardForUser,
  addReferralBonus,
  adminAdjustBalance,
  addEventBonus,
  increasePointBalance,
  depositPointWalletBalance,
  increaseBalance,
  decreaseBalance,
  withdrawWalletBalance,
  exchangeBonusToPointWalletBalance,
  checkSumWalletById,
  exchangePointFromBonus,
  summaryUserWalletRecord,
  exchangeToOtherUser,
  receiveExchangeFromOther,
  refundExchange,
};
