/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const ProductOrderItemResourceAccess = require('../../ProductOrderItem/resourceAccess/ProductOrderItemResourceAccess');
const ProductOrderResourceAccess = require('../../ProductOrder/resourceAccess/ProductOrderResourceAccess');
const ExchangePaymentMappingOrderView = require('../resourceAccess/ExchangePaymentMappingOrderView');
const ExchangeTransactionUserView = require('../resourceAccess/ExchangeTransactionUserView');
const ExchangeTransactionFunction = require('../PaymentExchangeTransactionFunctions');
const AppUserFunctions = require('../../AppUsers/AppUsersFunctions');
const PaymentExchangeFunctions = require('../PaymentExchangeTransactionFunctions');
const UserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const { USER_ERROR } = require('../../AppUsers/AppUserConstant');
const { EXCHANGE_TRX_STATUS, EXCHANGE_ERROR } = require('../PaymentExchangeTransactionConstant');
const Logger = require('../../../utils/logging');
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');
const { ERROR } = require('../../Common/CommonConstant');
const { PRODUCT_ORDER_STATUS } = require('../../ProductOrder/ProductOrderConstant');

async function userExchangeFACHistory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      filter.walletTypeBefore = WALLET_TYPE.FAC;
      filter.walletTypeAfter = WALLET_TYPE.USDT;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      if (req.currentUser.appUserId) {
        filter.appUserId = req.currentUser.appUserId;
      } else {
        console.error(`error User exchange transaction userExchangeFACHistory AppUserId:${req.currentUser.appUserId}`);
        reject('failed');
        return;
      }

      let transactionList = await ExchangeTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await ExchangeTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);
        resolve({
          data: transactionList,
          total: transactionCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
      resolve('success');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}
async function userExchangePOINTHistory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      filter.walletTypeBefore = WALLET_TYPE.POINT;
      filter.walletTypeAfter = WALLET_TYPE.FAC;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      if (req.currentUser.appUserId) {
        filter.appUserId = req.currentUser.appUserId;
      } else {
        console.error(`error User exchange transaction userExchangePOINTHistory AppUserId:${req.currentUser.appUserId}`);
        reject('failed');
        return;
      }

      let transactionList = await ExchangeTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await ExchangeTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);
        resolve({
          data: transactionList,
          total: transactionCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
      resolve('success');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function userReceiveHistory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

      filter.receiveWalletId = req.currentUser.appUserId;
      filter.paymentStatus = EXCHANGE_TRX_STATUS.COMPLETED;

      let transactionList = await ExchangeTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await ExchangeTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);
        resolve({
          data: transactionList,
          total: transactionCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
      resolve('success');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function userViewExchangeRequests(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      if (req.currentUser.appUserId) {
        filter.referId = req.currentUser.appUserId;
      } else {
        console.error(`error User exchange transaction userViewExchangeRequests AppUserId:${req.currentUser.appUserId}`);
        reject('failed');
        return;
      }

      filter.paymentStatus = EXCHANGE_TRX_STATUS.NEW;

      let transactionList = await ExchangeTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await ExchangeTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);
        resolve({
          data: transactionList,
          total: transactionCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
      resolve('success');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function userRequestExchange(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentAmount = req.payload.paymentAmount;
      let walletBalanceUnitId = req.payload.walletBalanceUnitId;

      //if system support for secondary password
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(req.currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} ExchangeTransactionFunction.createExchangeRequest`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }

      let createResult = await ExchangeTransactionFunction.createExchangeRequest(req.currentUser, paymentAmount, walletBalanceUnitId);
      if (createResult) {
        resolve(createResult);
      } else {
        Logger.error(`can not ExchangeTransactionFunction.createExchangeRequest`);
        reject('can not create exchange transaction');
      }
    } catch (e) {
      Logger.error(e);
      if (e === EXCHANGE_ERROR.NOT_ENOUGH_BALANCE) {
        console.error(`error User exchange transaction userRequestExchange: ${EXCHANGE_ERROR.NOT_ENOUGH_BALANCE}`);
        reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      } else {
        reject('failed');
      }
    }
  });
}

async function userAcceptExchangeRequest(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await ExchangeTransactionFunction.userAcceptExchangeRequest(req.payload.id, req.currentUser);
      if (result) {
        let transaction = await ExchangePaymentMappingOrderView.find({
          paymentExchangeTransactionId: req.payload.id,
        });
        transaction = transaction[0];
        // update số lượng đã được chuyển
        let payloadUpdateProductOrderItem = {
          orderItemDeliveredQuantity: transaction.paymentAmount + transaction.orderItemDeliveredQuantity,
        };
        await ProductOrderItemResourceAccess.updateById(transaction.productOrderItemId, payloadUpdateProductOrderItem);
        // nếu đã mua đủ => close
        if (payloadUpdateProductOrderItem.orderItemDeliveredQuantity === transaction.orderItemQuantity) {
          await ProductOrderResourceAccess.updateById(transaction.productOrderId, {
            orderStatus: PRODUCT_ORDER_STATUS.COMPLETED,
          });
        }
        resolve(result);
      } else {
        console.error(`error User exchange transaction userAcceptExchangeRequest  with transactionRequestId ${req.payload.id}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function userDenyExchangeRequest(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await ExchangeTransactionFunction.userRejectExchangeRequest(req.payload.id, req.currentUser);
      if (result) {
        resolve(result);
      } else {
        console.error(`error User exchange transaction userDenyExchangeRequest with transactionRequestId ${req.payload.id}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function userCancelExchangeRequest(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await ExchangeTransactionFunction.userCancelExchangeRequest(req.payload.id, req.currentUser);
      if (result) {
        resolve(result);
      } else {
        console.error(`error User exchange transaction userCancelExchangeRequest with transactionRequestId ${req.payload.id}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}
async function userExchangeFAC(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentAmount = req.payload.paymentAmount;
      let walletType = WALLET_TYPE.FAC;
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(req.currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} ExchangeTransactionFunction.createExchangeRequest`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }
      let createResult = await ExchangeTransactionFunction.requestExchangeFACtoUSDT(req.currentUser, paymentAmount, walletType);
      if (createResult) {
        resolve(createResult);
      } else {
        Logger.error(`can not ExchangeTransactionFunction.createExchangeRequest`);
        reject('can not create exchange transaction');
      }
    } catch (e) {
      Logger.error(e);
      if (e === EXCHANGE_ERROR.NOT_ENOUGH_BALANCE) {
        console.error(`error User exchange transaction userExchangeFAC: ${EXCHANGE_ERROR.NOT_ENOUGH_BALANCE}`);
        reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      } else {
        console.error(`error User exchange transaction userExchangeFAC: ${ERROR}`);
        reject('failed');
      }
    }
  });
}
async function userExchangePOINT(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentAmount = req.payload.paymentAmount;
      let walletType = WALLET_TYPE.POINT;
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(req.currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} ExchangeTransactionFunction.createExchangeRequest`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }
      let createResult = await ExchangeTransactionFunction.requestExchangeBonusToFAC(req.currentUser, paymentAmount, walletType);
      if (createResult) {
        resolve(createResult);
      } else {
        Logger.error(`can not ExchangeTransactionFunction.createExchangeRequest`);
        reject('can not create exchange transaction');
      }
    } catch (e) {
      Logger.error(e);
      if (e === EXCHANGE_ERROR.NOT_ENOUGH_BALANCE) {
        console.error(`error User exchange transaction userExchangePOINT: ${EXCHANGE_ERROR.NOT_ENOUGH_BALANCE}`);
        reject(EXCHANGE_ERROR.NOT_ENOUGH_BALANCE);
      } else {
        console.error(`error User exchange transaction userExchangePOINT: ${ERROR}`);
        reject('failed');
      }
    }
  });
}

async function requestBonusExchangePoint(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.currentUser.appUserId;
      let paymentAmount = req.payload.paymentAmount;
      let walletId = req.payload.walletId;
      if (!appUserId) {
        reject('user is invalid');
        return;
      }

      let user = await UserResource.find({ appUserId: appUserId });
      if (!user || user.length < 1) {
        reject('can not find user');
        return;
      }
      user = user[0];

      let result = await PaymentExchangeFunctions.requestExchangeBonusToPOINT(user, paymentAmount, walletId);
      if (result) {
        resolve(result);
      } else {
        console.error(`error User exchange transaction requestBonusExchangePoint: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

module.exports = {
  userRequestExchange,
  userExchangeFACHistory,
  userReceiveHistory,
  userDenyExchangeRequest,
  userCancelExchangeRequest,
  userAcceptExchangeRequest,
  userViewExchangeRequests,
  userExchangeFAC,
  userExchangePOINT,
  userExchangePOINTHistory,
  requestBonusExchangePoint,
};
