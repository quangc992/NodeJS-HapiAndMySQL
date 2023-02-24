/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const ExchangeTransactionResource = require('./resourceAccess/PaymentExchangeTransactionResourceAccess');
const WalletResourceAccess = require('../Wallet/resourceAccess/WalletResourceAccess');
const WalletBalanceUnitView = require('../Wallet/resourceAccess/WalletBalanceUnitView');
const WalletRecordFunction = require('../WalletRecord/WalletRecordFunction');
const WithdrawTransactionResource = require('../PaymentWithdrawTransaction/resourceAccess/PaymentWithdrawTransactionResourceAccess');
const CustomerMessageFunctions = require('../CustomerMessage/CustomerMessageFunctions');
const moment = require('moment');
const ExchangePaymentMappingOrderResourceAccess = require('./resourceAccess/ExchangePaymentMappingOrderResourceAccess');
const PaymentDepositTransactionFunctions = require('../PaymentDepositTransaction/PaymentDepositTransactionFunctions');
const { WALLET_TYPE } = require('../Wallet/WalletConstant');
const { EXCHANGE_ERROR, EXCHANGE_TRX_STATUS } = require('./PaymentExchangeTransactionConstant');
const { WITHDRAW_TRX_CATEGORY, WITHDRAW_TRX_STATUS } = require('../PaymentWithdrawTransaction/PaymentWithdrawTransactionConstant');
const Logger = require('../../utils/logging');
const { WALLET_RECORD_TYPE } = require('../WalletRecord/WalletRecordConstant');

async function _acceptExchangeRequest(transaction, staff, receiveWallet) {
  let updatedTransactionData = {
    paymentStatus: EXCHANGE_TRX_STATUS.COMPLETED,
  };

  //update transaction paymentStatus
  if (staff) {
    updatedTransactionData.paymentApproveDate = new Date();
    updatedTransactionData.paymentPICId = staff.staffId;
  }

  //if there is receiving user (wallet), then store their balance
  if (receiveWallet) {
    updatedTransactionData.receiveWalletBalanceBefore = receiveWallet.balance;
    updatedTransactionData.receiveWalletBalanceAfter = receiveWallet.balance * 1 - transaction.receiveAmount * 1;
  }

  let updateResult = await ExchangeTransactionResource.updateById(transaction.paymentExchangeTransactionId, updatedTransactionData);

  if (updateResult !== undefined) {
    //find wallet of requester
    let _receiveExchangeResult = await WalletRecordFunction.receiveExchangeFromOther(transaction.receiveWalletId, transaction.receiveAmount);
    if (_receiveExchangeResult === undefined) {
      Logger.error(`receiveExchangeFromOther failed ${requesterWallet.walletId} amount ${transaction.receiveAmount}`);
      return undefined;
    }

    let _senderReceiveWallet = await WalletResourceAccess.find({
      appUserId: transaction.appUserId,
      walletType: WALLET_TYPE.REWARD,
    });

    _senderReceiveWallet = _senderReceiveWallet[0];
    let _senderReceiveExchangeResult = await WalletRecordFunction.receiveExchangeFromOther(
      _senderReceiveWallet.walletId,
      transaction.receiveAmount * transaction.exchangeRate,
    );
    if (_senderReceiveExchangeResult === undefined) {
      Logger.error(`receiveExchangeFromOther failed ${_senderReceiveWallet.walletId} amount ${transaction.receiveAmount}`);
      return undefined;
    }
    return updateResult;
  } else {
    return undefined;
  }
}

async function _denyExchangeRequest(transaction, staff) {
  let transactionRequestId = transaction.paymentExchangeTransactionId;
  if (transaction === undefined) {
    Logger.error(`Can not _denyExchangeRequest ${transactionRequestId}`);
    return undefined;
  }

  if (
    transaction.paymentStatus === EXCHANGE_TRX_STATUS.COMPLETED ||
    transaction.paymentStatus === EXCHANGE_TRX_STATUS.CANCELED ||
    transaction.paymentStatus === EXCHANGE_TRX_STATUS.DELETED
  ) {
    Logger.error(`already _denyExchangeRequest ${transactionRequestId}`);
    return undefined;
  }

  //rollback balance for wallet
  await WalletRecordFunction.refundExchange(transaction.sendWalletId, transaction.paymentAmount);

  //update transaction paymentStatus
  let updatedTransactionData = {
    paymentStatus: EXCHANGE_TRX_STATUS.CANCELED,
  };
  //update transaction paymentStatus
  if (staff) {
    updatedTransactionData.paymentApproveDate = new Date();
    updatedTransactionData.paymentPICId = staff.staffId;
  }
  let updateResult = await ExchangeTransactionResource.updateById(transactionRequestId, updatedTransactionData);
  if (updateResult) {
    return updateResult;
  } else {
    return undefined;
  }
}

async function _cancelExchangeRequest(transaction, staff) {
  let transactionRequestId = transaction.paymentExchangeTransactionId;
  if (transaction === undefined) {
    Logger.error(`Can not _cancelExchangeRequest ${transactionRequestId}`);
    return undefined;
  }

  if (
    transaction.paymentStatus === EXCHANGE_TRX_STATUS.COMPLETED ||
    transaction.paymentStatus === EXCHANGE_TRX_STATUS.CANCELED ||
    transaction.paymentStatus === EXCHANGE_TRX_STATUS.DELETED
  ) {
    Logger.error(`already _cancelExchangeRequest ${transactionRequestId}`);
    return undefined;
  }

  //find sender wallet to rollback balance
  let wallet = await WalletResourceAccess.find({
    walletId: transaction.sendWalletId,
  });

  if (wallet === undefined || wallet.length < 1) {
    Logger.error(`Can not find wallet ${transaction.sendWalletId} for transaction ${transactionRequestId}`);
    return undefined;
  }
  wallet = wallet[0];

  //rollback balance for wallet
  await WalletResourceAccess.incrementBalance(wallet.walletId, transaction.paymentAmount);

  //update transaction paymentStatus
  let updatedTransactionData = {
    paymentStatus: EXCHANGE_TRX_STATUS.CANCELED,
  };
  //update transaction paymentStatus
  if (staff) {
    updatedTransactionData.paymentApproveDate = new Date();
    updatedTransactionData.paymentPICId = staff.staffId;
  }
  let updateResult = await ExchangeTransactionResource.updateById(transactionRequestId, updatedTransactionData);
  if (updateResult) {
    return updateResult;
  } else {
    return undefined;
  }
}

async function staffAcceptExchangeRequest(transactionRequestId, staff) {
  let transaction = await ExchangeTransactionResource.find({
    paymentExchangeTransactionId: transactionRequestId,
    paymentStatus: EXCHANGE_TRX_STATUS.NEW,
  });
  if (transaction === undefined || transaction.length < 1) {
    Logger.error(`Can not staffAcceptExchangeRequest ${transactionRequestId}`);
    return undefined;
  }
  transaction = transaction[0];

  if (transaction.receiveWalletId && transaction.receiveWalletId !== '' && transaction.receiveWalletId !== null) {
    return await _acceptExchangeRequest(transaction, staff);
  } else {
    Logger.error(`transaction.receiveWalletId ${transaction.receiveWalletId} is invalid`);
    return;
  }
}

async function userAcceptExchangeRequest(transactionRequestId, user) {
  return new Promise(async (resolve, reject) => {
    let transaction = await ExchangeTransactionResource.find({
      paymentExchangeTransactionId: transactionRequestId,
      paymentStatus: EXCHANGE_TRX_STATUS.NEW,
    });
    if (transaction === undefined || transaction.length < 1) {
      Logger.error(`Can not userAcceptExchangeRequest ${transactionRequestId}`);
      resolve(undefined);
      return;
    }
    transaction = transaction[0];

    if (transaction.receiveWalletId && transaction.receiveWalletId !== '' && transaction.receiveWalletId !== null) {
      //find wallet of receiver, to make sure they have enough money to pay for exchanging amount
      let receiverWallet = await WalletBalanceUnitView.find({
        walletId: transaction.receiveWalletId,
        walletType: WALLET_TYPE.POINT,
      });
      if (receiverWallet && receiverWallet.length > 0) {
        receiverWallet = receiverWallet[0];

        //do not allow other user to accept transaction from another user (even staff can not do this)
        //only receiver can accept their transaction
        if (user.appUserId === undefined || user.appUserId !== receiverWallet.appUserId) {
          Logger.error(`receiverWallet ${receiverWallet.walletId} do not have authorized`);
          resolve(undefined);
          return;
        }
        let acceptResult = await _acceptExchangeRequest(transaction, undefined, receiverWallet);
        resolve(acceptResult);
      } else {
        Logger.error(`transaction.transactionRequestId ${transactionRequestId} do not have receiver`);
        resolve(undefined);
        return;
      }
    } else {
      Logger.error(`transaction.receiveWalletId ${transaction.receiveWalletId} is invalid`);
      resolve(undefined);
      return;
    }
  });
}

async function staffRejectExchangeRequest(transactionRequestId, staff) {
  let transaction = await ExchangeTransactionResource.find({
    paymentExchangeTransactionId: transactionRequestId,
    paymentStatus: EXCHANGE_TRX_STATUS.NEW,
  });
  if (transaction === undefined || transaction.length < 1) {
    Logger.error(`Can not staffRejectExchangeRequest ${transactionRequestId}`);
    return undefined;
  }
  transaction = transaction[0];

  return await _denyExchangeRequest(transaction, staff);
}

async function userRejectExchangeRequest(transactionRequestId) {
  return new Promise(async (resolve, reject) => {
    let transaction = await ExchangeTransactionResource.find({ paymentExchangeTransactionId: transactionRequestId });
    if (transaction === undefined || transaction.length < 1) {
      Logger.error(`Can not userRejectExchangeRequest ${transactionRequestId}`);
      resolve(undefined);
      return;
    }
    transaction = transaction[0];

    if (transaction.paymentStatus !== EXCHANGE_TRX_STATUS.NEW) {
      Logger.error(`userRejectExchangeRequest ${transactionRequestId} already processed`);
      resolve(undefined);
    }

    let denyResult = await _denyExchangeRequest(transaction);
    resolve(denyResult);
    return;
  });
}

/**
 *
 * @param {*} user: người bán
 * @param {*} sellerWalletId: id ví người bán
 * @param {*} requesterWalletId: id ví người đặt lệnh
 * @param {*} productOrderItem: dữ liệu lệnh đặt
 * @param {*} exchangeAmount số lượng bán
 * @returns [exchangeId]
 */
async function createExchangeP2PRequest(user, senderWalletId, receiverWalletId, exchangeAmount, receiveAmount, exchangeRate, paymentRef) {
  return new Promise(async (resolve, reject) => {
    const MIN_PERSIST_AMOUNT = process.env.MIN_PERSIST_AMOUNT || 0;

    //validate if wallet have enough balance
    let senderWallet = await WalletBalanceUnitView.findById(senderWalletId);
    let receiverWallet = await WalletBalanceUnitView.findById(receiverWalletId);

    if (!senderWallet || !receiverWallet) {
      Logger.error(`invalid senderWalletId ${senderWalletId} or receiverWalletId ${receiverWalletId}`);
      //notify to front-end this error
      reject(EXCHANGE_ERROR.INVALID_EXCHANGE_WALLET);
      return;
    }

    if (senderWallet.balance < 0 || senderWallet.balance - exchangeAmount - MIN_PERSIST_AMOUNT < 0) {
      Logger.error(`createExchangeP2PRequest wallet ${senderWalletId} do not have enough amount`);
      //notify to front-end this error
      reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      return;
    }

    let transactionData = {
      appUserId: user.appUserId,
      sendWalletId: senderWalletId,
      sendWalletBalanceBefore: senderWallet.balance,
      sendWalletBalanceAfter: senderWallet.balance - exchangeAmount,
      receiveAmount: receiveAmount,
      paymentAmount: exchangeAmount,
      paymentRewardAmount: 0,
      exchangeRate: exchangeRate,
      paymentUnit: `${senderWallet.walletBalanceUnitCode}-USD`,
      sendPaymentUnitId: senderWallet.walletBalanceUnitId,
      receivePaymentUnitId: 1, // hien tai dang mac dinh luon luon la 1 - don vi la USD
      paymentRef: paymentRef,
      receiveWalletId: receiverWalletId,
    };
    let result = await ExchangeTransactionResource.insert(transactionData);

    if (result) {
      resolve(result);
      return;
    } else {
      Logger.error('insert exchange usdt error');
      resolve(undefined);
      return;
    }
  });
}

async function userCancelExchangeRequest(transactionRequestId) {
  return new Promise(async (resolve, reject) => {
    let transaction = await ExchangeTransactionResource.find({ paymentExchangeTransactionId: transactionRequestId });
    if (transaction === undefined || transaction.length < 1) {
      Logger.error(`Can not userRejectExchangeRequest ${transactionRequestId}`);
      resolve(undefined);
      return;
    }
    transaction = transaction[0];

    if (transaction.paymentStatus !== EXCHANGE_TRX_STATUS.NEW) {
      Logger.error(`userRejectExchangeRequest ${transactionRequestId} already processed`);
      resolve(undefined);
    }

    let cancelResult = await _cancelExchangeRequest(transaction);
    resolve(cancelResult);
    return;
  });
}

async function requestExchangeFACtoUSDT(user, paymentAmount, walletType) {
  return new Promise(async (resolve, reject) => {
    if (user.appUserId === undefined) {
      Logger.error(`createExchangeRequest invalid user`);
      resolve(undefined);
      return;
    }
    //validate if wallet have enough balance
    let originWallet = await WalletBalanceUnitView.find({
      appUserId: user.appUserId,
      walletType: walletType,
    });

    if (!originWallet || originWallet.length < 1) {
      Logger.error(`user ${user.appUserId} crypto (originWallet) do not have balance for unitId ${balanceUnitId}`);
      //notify to front-end this error
      reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      return;
    }
    originWallet = originWallet[0];
    if (originWallet.balance < 0 || originWallet.balance - paymentAmount < 0) {
      Logger.error('wallet do not have enough amount');
      //notify to front-end this error
      reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      return;
    }
    //find receiver wallet id
    let receiverWallet = await WalletBalanceUnitView.find({
      appUserId: user.appUserId,
      walletType: WALLET_TYPE.USDT,
    });
    if (!receiverWallet || receiverWallet.length < 1) {
      Logger.error(`user crypto ${user.referUserId} receiverWallet is invalid`);
      resolve(undefined);
      return;
    }
    receiverWallet = receiverWallet[0];
    let transactionData = {
      appUserId: user.appUserId,
      sendWalletId: originWallet.walletId,
      sendWalletBalanceBefore: originWallet.balance,
      sendWalletBalanceAfter: originWallet.balance - paymentAmount,
      paymentAmount: paymentAmount,
      receiveWalletId: receiverWallet.walletId,
    };
    let result = await ExchangeTransactionResource.insert(transactionData);

    if (result) {
      const SystemConfigurationsFunction = require('../SystemConfigurations/SystemConfigurationsFunction');
      let exchangeRate = await SystemConfigurationsFunction.getExchangeRate();
      let receiveAmount = paymentAmount * exchangeRate;
      let updatedTransactionData = {};
      updatedTransactionData.receiveAmount = receiveAmount;
      updatedTransactionData.exchangeRate = exchangeRate;
      updatedTransactionData.receiveWalletBalanceBefore = receiverWallet.balance;
      updatedTransactionData.receiveWalletBalanceAfter = receiverWallet.balance + receiveAmount;

      let updateResult = await ExchangeTransactionResource.updateById(result[0], updatedTransactionData);
      if (updateResult) {
        let resultDecrement = await WalletResourceAccess.decrementBalance(originWallet.walletId, paymentAmount);
        if (!resultDecrement) {
          Logger.error(`failse to decrement`);
          resolve(undefined);
          return;
        }
        let resultIncre = await WalletResourceAccess.incrementBalance(receiverWallet.walletId, receiveAmount);
        if (!resultIncre) {
          Logger.error(`failse to increment`);
          resolve(undefined);
          return;
        }
        resolve(result);
      }
      return;
    } else {
      Logger.error('insert exchange trx error');
      resolve(undefined);
      return;
    }
  });
}

async function requestExchangeBonusToPOINT(user, paymentAmount, walletId) {
  return new Promise(async (resolve, reject) => {
    if (user.appUserId === undefined) {
      Logger.error(`createExchangeRequest invalid user`);
      resolve(undefined);
      return;
    }
    //validate if wallet have enough balance
    let originWallet = await WalletResourceAccess.find({
      appUserId: user.appUserId,
      walletId: walletId,
    });

    if (!originWallet || originWallet.length < 1) {
      Logger.error(`user ${user.appUserId} crypto (originWallet) do not have balance for unitId ${balanceUnitId}`);
      //notify to front-end this error
      reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      return;
    }
    originWallet = originWallet[0];
    if (originWallet.balance < 0 || originWallet.balance - paymentAmount < 0) {
      Logger.error('wallet do not have enough amount');
      //notify to front-end this error
      reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      return;
    }
    //find receiver wallet id
    let receiverWallet = await WalletResourceAccess.find({
      appUserId: user.appUserId,
      walletType: WALLET_TYPE.POINT,
    });

    if (!receiverWallet || receiverWallet.length < 1) {
      Logger.error(`user crypto ${user.referUserId} receiverWallet is invalid`);
      resolve(undefined);
      return;
    }
    receiverWallet = receiverWallet[0];
    let receiveWalletBalanceAfter = receiverWallet.balance + paymentAmount;
    let transactionData = {
      appUserId: user.appUserId,
      sendWalletId: originWallet.walletId,
      sendWalletBalanceBefore: originWallet.balance,
      sendWalletBalanceAfter: originWallet.balance - paymentAmount,
      paymentAmount: paymentAmount,
      receiveWalletId: receiverWallet.walletId,
      paymentStatus: EXCHANGE_TRX_STATUS.COMPLETED,
      paymentApproveDate: new Date(),
      receiveWalletBalanceAfter: receiveWalletBalanceAfter,
      receiveWalletBalanceBefore: receiverWallet.balance,
      receiveAmount: paymentAmount,
    };
    let transactionDataWithdraw = {
      appUserId: user.appUserId,
      walletId: originWallet.walletId,
      paymentAmount: paymentAmount,
      balanceBefore: originWallet.balance,
      balanceAfter: originWallet.balance - paymentAmount,
      paymentCategory: WITHDRAW_TRX_CATEGORY.DIRECT_REWARD,
      paymentStatus: WITHDRAW_TRX_STATUS.COMPLETED,
    };
    // luu lich su chuyen tien
    let result = await ExchangeTransactionResource.insert(transactionData);
    // luu lich su rut tien
    let resultWithdraw = await WithdrawTransactionResource.insert(transactionDataWithdraw);

    if (result && resultWithdraw) {
      let resultDecrement = await WalletResourceAccess.decrementBalance(originWallet.walletId, paymentAmount);
      if (!resultDecrement) {
        Logger.error(`failse to decrement`);
        resolve(undefined);
        return;
      }
      let paymentNote = 'user deposit bonusWallet to pointWallet';
      let createDeposit = await PaymentDepositTransactionFunctions.createDepositTransaction(user, paymentAmount, undefined, receiverWallet.walletId);
      if (!createDeposit) {
        Logger.error(`failse to createDeposit`);
        resolve(undefined);
        return;
      }
      let approveDeposit = await PaymentDepositTransactionFunctions.approveDepositTransaction(createDeposit[0], undefined, paymentNote);
      if (!approveDeposit) {
        Logger.error(`failse to approveDeposit`);
        resolve(undefined);
        return;
      }
      paymentAmount = paymentAmount * -1;
      let idTransactionWithdraw = resultWithdraw[0];
      let resultWalletRecord = await WalletRecordFunction.exchangeBonusToPointWalletBalance(
        user.appUserId,
        paymentAmount,
        WALLET_TYPE.BONUS,
        undefined,
        idTransactionWithdraw,
      );
      if (resultWalletRecord) {
        let notifyTitle = 'Rút tiền hoa hồng vào ví chính';
        let approveDate = moment(transactionData.paymentApproveDate).format('YYYY-MM-DD HH:mm:ss');
        let notifyContent = `Bạn đã rút ${paymentAmount * -1} đồng từ ví hoa hồng sang ví chính thành công vào lúc ${approveDate}`;
        await CustomerMessageFunctions.sendNotificationUser(user.appUserId, notifyTitle, notifyContent);
        resolve(resultWalletRecord);
        return;
      }
    } else {
      Logger.error('insert exchange trx error');
      resolve(undefined);
      return;
    }
  });
}

async function requestExchangeBonusToFAC(user, paymentAmount, walletType) {
  return new Promise(async (resolve, reject) => {
    if (user.appUserId === undefined) {
      Logger.error(`createExchangeRequest invalid user`);
      resolve(undefined);
      return;
    }
    //validate if wallet have enough balance
    let originWallet = await WalletBalanceUnitView.find({
      appUserId: user.appUserId,
      walletType: walletType,
    });

    if (!originWallet || originWallet.length < 1) {
      Logger.error(`user ${user.appUserId} crypto (originWallet) do not have balance for unitId ${balanceUnitId}`);
      //notify to front-end this error
      reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      return;
    }
    originWallet = originWallet[0];
    if (originWallet.balance < 0 || originWallet.balance - paymentAmount < 0) {
      Logger.error('wallet do not have enough amount');
      //notify to front-end this error
      reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      return;
    }
    //find receiver wallet id
    let receiverWallet = await WalletBalanceUnitView.find({
      appUserId: user.appUserId,
      walletType: WALLET_TYPE.FAC,
    });
    if (!receiverWallet || receiverWallet.length < 1) {
      Logger.error(`user crypto ${user.referUserId} receiverWallet is invalid`);
      resolve(undefined);
      return;
    }
    receiverWallet = receiverWallet[0];
    let transactionData = {
      appUserId: user.appUserId,
      sendWalletId: originWallet.walletId,
      sendWalletBalanceBefore: originWallet.balance,
      sendWalletBalanceAfter: originWallet.balance - paymentAmount,
      paymentAmount: paymentAmount,
      receiveWalletId: receiverWallet.walletId,
    };
    let result = await ExchangeTransactionResource.insert(transactionData);

    if (result) {
      let updatedTransactionData = {};
      updatedTransactionData.receiveWalletBalanceBefore = receiverWallet.balance;
      updatedTransactionData.receiveWalletBalanceAfter = receiverWallet.balance + paymentAmount;
      let updateResult = await ExchangeTransactionResource.updateById(result[0], updatedTransactionData);
      if (updateResult) {
        let resultDecrement = await WalletResourceAccess.decrementBalance(originWallet.walletId, paymentAmount);
        if (!resultDecrement) {
          Logger.error(`failse to decrement`);
          resolve(undefined);
          return;
        }
        let resultIncre = await WalletResourceAccess.incrementBalance(receiverWallet.walletId, paymentAmount);
        if (!resultIncre) {
          Logger.error(`failse to increment`);
          resolve(undefined);
          return;
        }
        resolve(result);
      }
      return;
    } else {
      Logger.error('insert exchange trx error');
      resolve(undefined);
      return;
    }
  });
}

module.exports = {
  staffAcceptExchangeRequest,
  userAcceptExchangeRequest,
  staffRejectExchangeRequest,
  userRejectExchangeRequest,
  userCancelExchangeRequest,
  createExchangeP2PRequest,
  requestExchangeFACtoUSDT,
  requestExchangeBonusToFAC,
  requestExchangeBonusToPOINT,
};
