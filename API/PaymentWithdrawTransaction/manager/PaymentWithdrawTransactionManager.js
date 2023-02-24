/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const UserResouce = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const WithdrawTransactionResourceAccess = require('../resourceAccess/PaymentWithdrawTransactionResourceAccess');
const WithdrawTransactionUserView = require('../resourceAccess/WithdrawTransactionUserView');
const WithdrawTransactionFunction = require('../PaymentWithdrawTransactionFunctions');
const AppUserFunctions = require('../../AppUsers/AppUsersFunctions');
const { USER_ERROR } = require('../../AppUsers/AppUserConstant');
const { WITHDRAW_TRX_STATUS, INVALID } = require('../PaymentWithdrawTransactionConstant');
const Logger = require('../../../utils/logging');
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');
const { ERROR } = require('../../Common/CommonConstant');
const moment = require('moment');
const CustomerMessageResourceAccess = require('../../CustomerMessage/resourceAccess/CustomerMessageResourceAccess');
const { MESSAGE_CATEGORY, MESSAGE_TOPIC } = require('../../CustomerMessage/CustomerMessageConstant');
const { publishJson } = require('../../../ThirdParty/MQTTBroker/MQTTBroker');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.id;
      let paymentAmount = req.payload.paymentAmount;
      let paymentOwner = req.payload.paymentOwner;
      let paymentOriginSource = req.payload.paymentOriginSource;
      let paymentOriginName = req.payload.paymentOriginName;
      let walletType = req.payload.walletType;
      let staff = req.currentUser;
      let bankInfomation = {
        paymentOwner: paymentOwner,
        paymentOriginSource: paymentOriginSource,
        paymentOriginName: paymentOriginName,
      };

      let targetUser = await UserResouce.find({ appUserId: appUserId }, 0, 1);
      if (targetUser && targetUser.length > 0) {
        let createResult = await WithdrawTransactionFunction.createWithdrawRequest(
          targetUser[0],
          paymentAmount,
          staff,
          INVALID.INVALID_PAYMENTNOTE,
          walletType,
          INVALID.INVALID_WALLET,
          bankInfomation,
        );

        if (createResult) {
          resolve(createResult);
        } else {
          Logger.error(`can not WithdrawTransactionFunction.createWithdrawRequest`);
          reject('can not create withdraw transaction');
        }
      } else {
        Logger.error(`can not WithdrawTransactionFunction.insert invalid user`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error withdraw transaction insert `, e);
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
      let transactionList = await WithdrawTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let transactionCount = await WithdrawTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, searchText, order);

      if (transactionList && transactionCount && transactionList.length > 0) {
        transactionList = await WithdrawTransactionFunction.addStaffNameInTransactionList(transactionList);
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
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let newStatus = req.payload.data.status;
      let result = undefined;
      if (newStatus === WITHDRAW_TRX_STATUS.COMPLETED) {
        result = await WithdrawTransactionFunction.acceptWithdrawRequest(req.payload.id);
      } else {
        result = await WithdrawTransactionFunction.rejectWithdrawRequest(req.payload.id);
      }
      if (result) {
        resolve(result);
      } else {
        console.error(`error withdraw transaction updateById with transactionRequestId ${req.payload.id} : update transaction failed`);
        reject('update transaction failed');
      }
    } catch (e) {
      console.error(`error withdraw transaction updateById`, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionList = await WithdrawTransactionUserView.find({ paymentWithdrawTransactionId: req.payload.id });
      if (transactionList && transactionList.length > 0) {
        transactionList = await WithdrawTransactionFunction.addStaffNameInTransactionList(transactionList);
        resolve(transactionList[0]);
      } else {
        Logger.error(`WithdrawTransactionUserView can not findById ${req.payload.id}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error withdraw transaction findById`, e);
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
      if (req.currentUser.appUserId) {
        filter.appUserId = req.currentUser.appUserId;
      } else {
        console.error(`error withdraw transaction getList: user invalid`);
        reject('failed');
        return;
      }

      let transactionList = await WithdrawTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);
      if (transactionList && transactionList.length > 0) {
        let transactionCount = await WithdrawTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);
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
      console.error(`error withdraw transaction getList`, e);
      reject('failed');
    }
  });
}
async function withdrawHistoryUSDT(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      filter.walletType = WALLET_TYPE.USDT;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      if (req.currentUser.appUserId) {
        filter.appUserId = req.currentUser.appUserId;
      } else {
        console.error(`error withdraw transaction withdrawHistoryUSDT: user invalid`);
        reject('failed');
        return;
      }

      let transactionList = await WithdrawTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await WithdrawTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);
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
      console.error(`error withdraw transaction withdrawHistoryUSDT`, e);
      reject('failed');
    }
  });
}
async function withdrawHistoryPOINT(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      filter.walletType = WALLET_TYPE.POINT;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      if (req.currentUser.appUserId) {
        filter.appUserId = req.currentUser.appUserId;
      } else {
        console.error(`error withdraw transaction withdrawHistoryPOINT: user invalid`);
        reject('failed');
        return;
      }

      let transactionList = await WithdrawTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await WithdrawTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);
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
      console.error(`error withdraw transaction withdrawHistoryPOINT`, e);
      reject('failed');
    }
  });
}
async function withdrawHistoryBTC(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      filter.walletType = WALLET_TYPE.BTC;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      if (req.currentUser.appUserId) {
        filter.appUserId = req.currentUser.appUserId;
      } else {
        console.error(`error withdraw transaction withdrawHistoryBTC: user invalid`);
        reject('failed');
        return;
      }

      let transactionList = await WithdrawTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await WithdrawTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);
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
      console.error(`error withdraw transaction withdrawHistoryBTC`, e);
      reject('failed');
    }
  });
}

async function approveWithdrawTransaction(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await WithdrawTransactionFunction.acceptWithdrawRequest(
        req.payload.id,
        req.payload.paymentNote,
        req.currentUser,
        req.payload.paymentRef,
      );
      if (result) {
        let transaction = await WithdrawTransactionResourceAccess.findById(req.payload.id);

        await CustomerMessageResourceAccess.insert({
          customerMessageContent: `Bạn đã rút thành công ${transaction.paymentAmount} vào lúc ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
          customerMessageCategories: MESSAGE_CATEGORY.FIREBASE_PUSH,
          customerMessageTopic: MESSAGE_TOPIC.USER,
          customerMessageTitle: `Rút tiền thành công`,
          customerId: req.currentUser.appUserId,
        });
        resolve(result);
      } else {
        console.error(`error withdraw transaction approveWithdrawTransaction with transactionRequestId:${req.payload.id}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error withdraw transaction approveWithdrawTransaction`, e);
      reject('failed');
    }
  });
}

async function denyWithdrawTransaction(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await WithdrawTransactionFunction.rejectWithdrawRequest(req.payload.id, req.payload.paymentNote);
      if (result) {
        await CustomerMessageResourceAccess.insert({
          customerMessageContent: `Yêu cầu rút tiền #${req.payload.id} của bạn đã bị từ chối vào lúc ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
          customerMessageCategories: MESSAGE_CATEGORY.FIREBASE_PUSH,
          customerMessageTopic: MESSAGE_TOPIC.USER,
          customerMessageTitle: `Rút tiền thất bại`,
          customerId: req.currentUser.appUserId,
        });
        resolve(result);
      } else {
        console.error(`error withdraw transaction denyWithdrawTransaction with transactionRequestId:${req.payload.id}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error withdraw transaction denyWithdrawTransaction`, e);
      reject('failed');
    }
  });
}

async function summaryUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;
      filter.userId = req.currentUser.userId;

      let result = await WithdrawTransactionResourceAccess.customSum('paymentAmount', filter, undefined, undefined, startDate, endDate);
      if (result) {
        resolve(result[0]);
      } else {
        console.error(`error withdraw transaction summaryUser with sumField paymentAmount: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error withdraw transaction summaryUser`, e);
      reject('failed');
    }
  });
}

async function summaryAll(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;

      let result = await WithdrawTransactionResourceAccess.customSum('paymentAmount', filter, undefined, undefined, startDate, endDate);
      if (result) {
        resolve(result[0]);
      } else {
        console.error(`error withdraw transaction summaryAll with sumField paymentAmount: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error withdraw transaction summaryAll`, e);
      reject('failed');
    }
  });
}

async function requestWithdrawUSDT(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentAmount = req.payload.paymentAmount;
      let walletType = WALLET_TYPE.USDT;

      //if system support for secondary password
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(req.currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} requestWithdraw`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }

      let createResult = await WithdrawTransactionFunction.createWithdrawRequest(
        req.currentUser,
        paymentAmount,
        undefined,
        req.payload.paymentNote,
        walletType,
        undefined,
      );
      if (createResult) {
        resolve(createResult);
      } else {
        Logger.error(`can not WithdrawTransactionFunction.createWithdrawRequest`);
        reject('can not create withdraw transaction');
      }
    } catch (e) {
      console.error(`error withdraw transaction requestWithdrawUSDT`, e);
      reject('failed');
    }
  });
}

async function requestWithdraw(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentAmount = req.payload.paymentAmount;
      let walletId = req.payload.walletId;
      let paymentFeeAmount = req.payload.paymentFeeAmount;
      let bankInfomation = {
        paymentOwner: req.payload.paymentOwner,
        paymentOriginSource: req.payload.paymentOriginSource,
        paymentOriginName: req.payload.paymentOriginName,
      };
      //if system support for secondary password
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(req.currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} requestWithdraw`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }

      let createResult = await WithdrawTransactionFunction.createWithdrawRequest(
        req.currentUser,
        paymentAmount,
        undefined,
        req.payload.paymentNote,
        undefined,
        walletId,
        bankInfomation,
        paymentFeeAmount,
      );
      if (createResult) {
        let transaction = await WithdrawTransactionResourceAccess.findById(createResult[0]);
        await publishJson('STAFF_GENERAL', transaction);
        resolve(createResult);
      } else {
        Logger.error(`can not WithdrawTransactionFunction.createWithdrawRequest`);
        reject('can not create withdraw transaction');
      }
    } catch (e) {
      console.error(`error withdraw transaction requestWithdraw`, e);
      reject('failed');
    }
  });
}
async function requestWithdrawBTC(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentAmount = req.payload.paymentAmount;
      let walletType = WALLET_TYPE.BTC;

      //if system support for secondary password
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(req.currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} requestWithdraw`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }

      let createResult = await WithdrawTransactionFunction.createWithdrawRequest(
        req.currentUser,
        paymentAmount,
        undefined,
        req.payload.paymentNote,
        walletType,
        undefined,
        undefined,
      );
      if (createResult) {
        resolve(createResult);
      } else {
        Logger.error(`can not WithdrawTransactionFunction.createWithdrawRequest`);
        reject('can not create withdraw transaction');
      }
    } catch (e) {
      console.error(`error withdraw transaction requestWithdrawBTC`, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  requestWithdrawUSDT,
  getList,
  denyWithdrawTransaction,
  approveWithdrawTransaction,
  summaryAll,
  summaryUser,
  withdrawHistoryUSDT,
  requestWithdrawBTC,
  withdrawHistoryBTC,
  requestWithdraw,
  withdrawHistoryPOINT,
};
