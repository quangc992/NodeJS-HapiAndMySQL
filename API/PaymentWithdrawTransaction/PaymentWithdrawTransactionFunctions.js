/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const WithdrawTransactionResource = require('./resourceAccess/PaymentWithdrawTransactionResourceAccess');
const WalletResourceAccess = require('../Wallet/resourceAccess/WalletResourceAccess');
const { WALLET_TYPE } = require('../Wallet/WalletConstant');
const { WITHDRAW_TRX_STATUS, WITHDRAW_TRX_TYPE, WITHDRAW_TRX_CATEGORY } = require('./PaymentWithdrawTransactionConstant');
const Logger = require('../../utils/logging');
const WalletRecordFunction = require('../WalletRecord/WalletRecordFunction');
const StaffResourceAccess = require('../Staff/resourceAccess/StaffResourceAccess');

async function acceptWithdrawRequest(transactionRequestId, paymentNote, staff, paymentRef) {
  let transaction = await WithdrawTransactionResource.find({ paymentWithdrawTransactionId: transactionRequestId });
  if (transaction === undefined || transaction.length < 1) {
    Logger.error(`Can not acceptWithdrawRequest ${transactionRequestId}`);
    return undefined;
  }
  transaction = transaction[0];
  if (
    transaction.paymentStatus === WITHDRAW_TRX_STATUS.COMPLETED ||
    transaction.paymentStatus === WITHDRAW_TRX_STATUS.CANCELED ||
    transaction.paymentStatus === WITHDRAW_TRX_STATUS.DELETED
  ) {
    Logger.error(`already acceptWithdrawRequest ${transactionRequestId}`);
    return undefined;
  }
  //update transaction paymentStatus
  transaction.paymentStatus = WITHDRAW_TRX_STATUS.COMPLETED;
  if (staff) {
    transaction.paymentPICId = staff.staffId;
  }
  if (paymentNote) {
    transaction.paymentNote = paymentNote;
  }

  if (paymentRef) {
    transaction.paymentRef = paymentRef;
  }

  let updateResult = await WithdrawTransactionResource.updateById(transactionRequestId, transaction);
  if (updateResult) {
    return updateResult;
  } else {
    return undefined;
  }
}

async function rejectWithdrawRequest(transactionRequestId, paymentNote) {
  let transaction = await WithdrawTransactionResource.find({ paymentWithdrawTransactionId: transactionRequestId });
  if (transaction === undefined || transaction.length < 1) {
    Logger.error(`Can not rejectWithdrawRequest ${transactionRequestId}`);
    return undefined;
  }
  transaction = transaction[0];

  if (
    transaction.paymentStatus === WITHDRAW_TRX_STATUS.COMPLETED ||
    transaction.paymentStatus === WITHDRAW_TRX_STATUS.CANCELED ||
    transaction.paymentStatus === WITHDRAW_TRX_STATUS.DELETED
  ) {
    Logger.error(`already rejectWithdrawRequest ${transactionRequestId}`);
    return undefined;
  }
  let wallet = await WalletResourceAccess.find({ walletId: transaction.walletId });
  if (wallet === undefined || wallet.length < 1) {
    Logger.error(`Can not find wallet ${transaction.walletId} for transaction ${transactionRequestId}`);
    return undefined;
  }
  wallet = wallet[0];

  let amount = transaction.paymentAmount + transaction.paymentFeeAmount;
  await WalletResourceAccess.incrementBalance(wallet.walletId, amount);

  //update transaction paymentStatus
  transaction.paymentStatus = WITHDRAW_TRX_STATUS.CANCELED;

  if (paymentNote) {
    transaction.paymentNote = paymentNote;
  }
  let updateResult = await WithdrawTransactionResource.updateById(transactionRequestId, transaction);
  if (updateResult) {
    return updateResult;
  } else {
    return undefined;
  }
}

async function createWithdrawRequest(user, amount, staff, paymentNote, walletType, walletId, bankInfomation, paymentFeeAmount) {
  const MIN_PERSIST_AMOUNT = process.env.MIN_PERSIST_AMOUNT || 0;
  if (user.appUserId === undefined) {
    Logger.error(`createWithdrawRequest invalid user`);
    return undefined;
  }
  let filter = {};

  if (walletId) {
    filter = {
      appUserId: user.appUserId,
      walletId: walletId,
    };
  } else {
    filter = {
      appUserId: user.appUserId,
      walletType: walletType,
    };
  }

  let wallet = await WalletResourceAccess.find(filter);
  walletType = wallet.walletType;

  if (!wallet || wallet.length < 1) {
    Logger.error('user wallet is invalid');
    return undefined;
  }
  wallet = wallet[0];

  if (wallet.balance < 0 || wallet.balance - amount - MIN_PERSIST_AMOUNT < 0) {
    Logger.error('wallet do not have enough amount');
    return undefined;
  }

  let transactionData = {
    appUserId: user.appUserId,
    walletId: wallet.walletId,
    paymentAmount: amount,
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance - amount,
    paymentRefAmount: amount,
  };

  if (paymentFeeAmount) {
    transactionData.paymentFeeAmount = paymentFeeAmount;
    amount = amount + paymentFeeAmount;
    transactionData.balanceAfter = wallet.balance - amount;
  }

  if (bankInfomation) {
    // user rut tien/ hoa hong truc tiep
    transactionData.paymentOwner = bankInfomation.paymentOwner;
    transactionData.paymentOriginSource = bankInfomation.paymentOriginSource;
    transactionData.paymentOriginName = bankInfomation.paymentOriginName;
  }

  if (staff) {
    transactionData.paymentApproveDate = new Date();
    transactionData.paymentPICId = staff.staffId;
    transactionData.paymentStatus = WITHDRAW_TRX_STATUS.COMPLETED;
    transactionData.paymentType = WITHDRAW_TRX_TYPE.ADMIN_WITHDRAW;
  }

  if (paymentNote) {
    transactionData.paymentNote = paymentNote;
  }

  if (user.referUserId) {
    transactionData.referId = user.referUserId;
  }

  if (walletType === WALLET_TYPE.USDT && user.diachiviUSDT) {
    transactionData.paymentRef = user.diachiviUSDT;
  } else if (walletType === WALLET_TYPE.BTC && user.diachiviBTC) {
    transactionData.paymentRef = user.diachiviBTC;
  }

  let result = await WithdrawTransactionResource.insert(transactionData);

  if (result) {
    //luu tru lai lich su bien dong so du cua Vi
    let paymentAmount = amount * -1;
    let updateWalletResult = await WalletRecordFunction.withdrawWalletBalance(user.appUserId, paymentAmount, wallet.walletType, staff, result[0]);

    if (!updateWalletResult) {
      Logger.error('Save wallet record  error');
      return undefined;
    }
    return result;
  } else {
    Logger.error('insert withdraw trx error');
    return undefined;
  }
}

async function addStaffNameInTransactionList(transactionList, storeStaffName = {}) {
  for (let transaction of transactionList) {
    if (transaction.paymentPICId) {
      let staffId = transaction.paymentPICId;
      let staffName = '';
      if (storeStaffName && storeStaffName.hasOwnProperty(staffId)) {
        staffName = storeStaffName[staffId]; // get staffName
        transaction.staffName = staffName;
      } else {
        let staff = await StaffResourceAccess.findById(staffId);
        staffName = `${staff.lastName} ${staff.firstName}`;
        storeStaffName[staffId] = staffName; // set stationName với key là stationId
        transaction.staffName = staffName;
      }
    }
  }
  return transactionList;
}

module.exports = {
  acceptWithdrawRequest,
  rejectWithdrawRequest,
  createWithdrawRequest,
  addStaffNameInTransactionList,
};
