/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const ExchangeTransactionUserView = require('../resourceAccess/ExchangeTransactionUserView');
const ExchangeTransactionFunction = require('../PaymentExchangeTransactionFunctions');
const { EXCHANGE_TRX_STATUS } = require('../PaymentExchangeTransactionConstant');
const { ERROR } = require('../../Common/CommonConstant');
const Logger = require('../../../utils/logging');
const ExchangePaymentMappingOrderView = require('../resourceAccess/ExchangePaymentMappingOrderView');
const ProductOrderItemResourceAccess = require('../../ProductOrderItem/resourceAccess/ProductOrderItemResourceAccess');
const { PRODUCT_ORDER_STATUS } = require('../../ProductOrder/ProductOrderConstant');
const ProductOrderResourceAccess = require('../../ProductOrder/resourceAccess/ProductOrderResourceAccess');
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');
const { receiveExchangeFromOther } = require('../../WalletRecord/WalletRecordFunction');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      console.error(`error can not create exchange transaction`);
      reject('can not create exchange transaction');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let transactionList = await ExchangeTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let transactionCount = await ExchangeTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, searchText, order);

      if (transactionList && transactionCount && transactionList.length > 0) {
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
      console.error(`error exchange transaction find: ${ERROR}`);
      reject('failed');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let newStatus = req.payload.data.status;
      let result = undefined;
      if (newStatus === EXCHANGE_TRX_STATUS.COMPLETED) {
        result = await ExchangeTransactionFunction.staffAcceptExchangeRequest(req.payload.id);
      } else {
        result = await ExchangeTransactionFunction.staffRejectExchangeRequest(req.payload.id);
      }

      if (result) {
        resolve(result);
      } else {
        console.error(`error exchange transaction update transaction failed`);
        reject('update transaction failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionList = await ExchangeTransactionUserView.find({ paymentExchangeTransactionId: req.payload.id });
      if (transactionList && transactionList.length > 0) {
        resolve(transactionList[0]);
      } else {
        Logger.error(`ExchangeTransactionUserView can not findById ${req.payload.id}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function exchangeHistory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

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

async function receiveHistory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

      filter.receiveWalletId = null;
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

async function viewExchangeRequests(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

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

async function approveExchangeTransaction(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let currentStaff = req.currentUser;
      let result = await ExchangeTransactionFunction.staffAcceptExchangeRequest(req.payload.id, currentStaff);
      if (result) {
        let transaction = await ExchangePaymentMappingOrderView.find({
          paymentExchangeTransactionId: req.payload.id,
        });
        transaction = transaction[0];
        // update số lượng đã được chuyển
        let payloadUpdateProductOrderItem = {
          orderItemDeliveredQuantity: transaction.paymentAmount + transaction.orderItemDeliveredQuantity,
        };
        let updateExchangeResult = await ProductOrderItemResourceAccess.updateById(transaction.productOrderItemId, payloadUpdateProductOrderItem);
        if (!updateExchangeResult) {
          console.error(`UPDATE_EXCHANGE_FAILED transaction.productOrderItemId ${transaction.productOrderItemId}`);
          return reject('UPDATE_EXCHANGE_FAILED');
        }

        // nếu đã mua đủ => close
        // if (payloadUpdateProductOrderItem.orderItemDeliveredQuantity === transaction.orderItemQuantity) {
        //   await ProductOrderResourceAccess.updateById(transaction.productOrderId, {
        //     orderStatus: PRODUCT_ORDER_STATUS.COMPLETED,
        //   });
        // }

        resolve(result);
      } else {
        console.error(`exchange transaction: approveExchangeTransaction failed ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function denyExchangeTransaction(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let currentStaff = req.currentUser;
      let result = await ExchangeTransactionFunction.staffRejectExchangeRequest(req.payload.id, currentStaff);
      if (result) {
        resolve(result);
      } else {
        console.error(`exchange transaction: denyExchangeTransaction failed ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function getList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let transactionList = await ExchangeTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      filter.appUserId = req.currentUser.appUserId;
      let transactionCount = await ExchangeTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, searchText, order);

      if (transactionList && transactionCount && transactionList.length > 0) {
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
      console.error(`error exchange transaction find: ${ERROR}`);
      reject('failed');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  exchangeHistory,
  receiveHistory,
  denyExchangeTransaction,
  approveExchangeTransaction,
  viewExchangeRequests,
  getList,
};
