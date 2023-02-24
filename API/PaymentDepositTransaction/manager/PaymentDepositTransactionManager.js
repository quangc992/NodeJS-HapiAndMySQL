/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moment = require('moment');

const DepositTransactionAccess = require('../resourceAccess/PaymentDepositTransactionResourceAccess');
const PaymentDepositTransactionUserView = require('../resourceAccess/PaymentDepositTransactionUserView');
const DepositTransactionMethodView = require('../resourceAccess/PaymentDepositMethodView');
const UserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const DepositFunction = require('../PaymentDepositTransactionFunctions');
const Logger = require('../../../utils/logging');
const StaffResourceAccess = require('../../Staff/resourceAccess/StaffResourceAccess');
const PaymentMethodResourceAccess = require('../../PaymentMethod/resourceAccess/PaymentMethodResourceAccess');
const { DEPOSIT_TRX_STATUS, DEPOSIT_TRX_TYPE, DEPOSIT_ERROR } = require('../PaymentDepositTransactionConstant');
// const ExcelFunction = require('../../../ThirdParty/Excel/ExcelFunction');
const INVALID_WALLET = undefined;
const INVALID_PAYMENT_REF = undefined;
const INVALID_BANKINFOMATION = undefined;

const { ERROR } = require('../../Common/CommonConstant');
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');
const { publishJson } = require('../../../ThirdParty/MQTTBroker/MQTTBroker');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.appUserId;
      let staff = req.currentUser;
      let paymentAmount = req.payload.paymentAmount;
      if (!appUserId) {
        console.error(`error payment deposit insert user is invalid`);
        reject('user is invalid');
        return;
      }

      let user = await UserResource.find({ appUserId: appUserId });
      if (!user || user.length < 1) {
        console.error(`error payment deposit insert can not find user AppUserId:${appUserId}`);
        reject('can not find user');
        return;
      }
      user = user[0];

      let result = await DepositFunction.createDepositTransaction(
        user,
        paymentAmount,
        INVALID_PAYMENT_REF,
        INVALID_WALLET,
        INVALID_BANKINFOMATION,
        staff,
      );
      if (result) {
        resolve(result);
      } else {
        console.error(`error payment deposit insert AppUserId:${appUserId} ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error payment deposit insert AppUserId:${appUserId} ${ERROR}`);
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

      if (filter === undefined) {
        filter = {};
      }

      let transactionList = await DepositTransactionMethodView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let transactionCount = await DepositTransactionMethodView.customCount(filter, undefined, undefined, startDate, endDate, searchText, order);

      if (transactionList && transactionCount && transactionList.length > 0) {
        transactionList = await getDetailTransactionDeposit(transactionList);
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
      console.error(`error payment deposit find: ${ERROR}`);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let updateResult = await DepositTransactionAccess.updateById(req.payload.id, req.payload.data);
      if (updateResult) {
        resolve(updateResult);
      } else {
        resolve({});
      }
    } catch (e) {
      console.error(`error payment deposit updateById ${req.payload.id}: ${ERROR}`);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionList = await DepositTransactionMethodView.find({ paymentDepositTransactionId: req.payload.id });
      if (transactionList) {
        transactionList = await getDetailTransactionDeposit(transactionList);
        resolve(transactionList[0]);
      } else {
        resolve({});
      }
    } catch (e) {
      console.error(`error payment deposit findById with paymentDepositTransactionId:${req.payload.id}`, e);
      reject('failed');
    }
  });
}

async function depositHistory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

      if (filter === undefined) {
        filter = {};
      }

      if (req.currentUser.appUserId) {
        filter.appUserId = req.currentUser.appUserId;
      } else {
        console.error(`error payment deposit depositHistory: ${ERROR}`);
        reject('failed');
        return;
      }

      let transactionList = await PaymentDepositTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);
      let transactionCount = await PaymentDepositTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);

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
    } catch (e) {
      console.error(`error payment deposit depositHistory:`, e);
      reject('failed');
    }
  });
}

async function denyDepositTransaction(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      let denyResult = await DepositFunction.denyDepositTransaction(req.payload.id, req.currentUser, req.payload.paymentNote);
      if (denyResult) {
        resolve('success');
      } else {
        console.error('deposit transaction was not denied');
        reject('failed');
      }
    } catch (e) {
      console.error(`error`, e);
      reject('failed');
    }
  });
}

async function approveDepositTransaction(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      let approveResult = await DepositFunction.approveDepositTransaction(
        req.payload.id,
        req.currentUser,
        req.payload.paymentNote,
        req.payload.paymentMethodId,
        req.payload.paymentRef,
      );
      if (approveResult) {
        resolve('success');
      } else {
        console.error('deposit transaction was not approved');
        reject('failed');
      }
    } catch (e) {
      console.error(e);
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

      let result = await DepositTransactionAccess.sumaryPointAmount(startDate, endDate, filter);
      if (result) {
        resolve(result[0]);
      } else {
        console.error(`error deposit transaction summaryUser: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error deposit transaction summaryUser`, e);
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

      let result = await DepositTransactionAccess.sumaryPointAmount(startDate, endDate, filter);
      if (result) {
        resolve(result[0]);
      } else {
        console.error(`error deposit transaction summaryAll: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function addPointForUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let rewardResult = await DepositFunction.addPointForUser(req.payload.id, req.payload.amount, req.currentUser, req.payload.paymentNote);
      if (rewardResult) {
        resolve('success');
      } else {
        console.error('fail to add reward point for user');
        reject('failed');
      }
    } catch (e) {
      console.error(`error deposit transaction addPointForUser:`, e);
      reject('failed');
    }
  });
}

async function exportHistoryOfUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userId = req.payload.id;
      let history = await DepositTransactionAccess.find({ appUserId: userId });
      if (history && history.length > 0) {
        const fileName = 'userRewardHistory' + (new Date() - 1).toString();
        let filePath = await ExcelFunction.renderExcelFile(fileName, history, 'User Reward History');
        let url = `https://${process.env.HOST_NAME}/${filePath}`;
        resolve(url);
      } else {
        resolve('Not have data');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function exportSalesToExcel(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = moment(req.payload.startDate).startOf('month').format('YYYY-MM-DD');
      let endDate = moment(req.payload.endDate).endOf('month').format('YYYY-MM-DD');
      let data = await DepositTransactionAccess.customSearch(startDate, endDate);
      if (data && data.length > 0) {
        const fileName = 'SalesHistory' + (new Date() - 1).toString();
        let filePath = await ExcelFunction.renderExcelFile(fileName, data, 'Sales History');
        let url = `https://${process.env.HOST_NAME}/${filePath}`;
        resolve(url);
      } else {
        resolve('Not have data');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userRequestDeposit(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.currentUser.appUserId;
      let paymentAmount = req.payload.paymentAmount;
      let paymentMethodId = req.payload.paymentMethodId;
      let paymentRef = req.payload.paymentRef;
      let walletId = req.payload.walletId;
      let bankInfomation = {};

      if (!appUserId) {
        console.error(`deposit transaction userRequestDeposit user is invalid`);
        reject('user is invalid');
        return;
      }
      let user = await UserResource.find({ appUserId: appUserId });
      if (!user || user.length < 1) {
        console.error(`deposit transaction userRequestDeposit can not find user:${appUserId}`);
        reject('can not find user');
        return;
      }
      user = user[0];

      //  let paymentOwner = req.payload.paymentOwner ? req.payload.paymentOwner : user.tentaikhoan;
      //  let paymentOriginSource = req.payload.paymentOriginSource ? req.payload.paymentOriginSource : user.tennganhang;
      //  let paymentOriginName = req.payload.paymentOriginName ? req.payload.paymentOriginName : user.sotaikhoan;

      // if (paymentOwner && paymentOriginSource && paymentOriginName) {
      //   bankInfomation = {
      //     paymentOwner: paymentOwner,
      //     paymentOriginSource: paymentOriginSource,
      //     paymentOriginName: paymentOriginName,
      //   };
      // } else {
      //   let paymentMethods = await PaymentMethodResourceAccess.find({ paymentMethodId: paymentMethodId });
      //   if (paymentMethods) {
      //     bankInfomation = {
      //       paymentOwner: paymentMethods[0].paymentMethodName, //USDT
      //       paymentOriginSource: paymentMethods[0].paymentMethodType, // CRYPTO
      //       paymentOriginName: paymentMethods[0].paymentMethodReceiverName, // dia chi vi
      //     };
      //   } else {
      //     console.error(`error deposit transaction userRequestDeposit: ${DEPOSIT_ERROR.NO_BANK_ACCOUNT_INFORMATION}`);
      //     reject(DEPOSIT_ERROR.NO_BANK_ACCOUNT_INFORMATION);
      //     return;
      //   }
      // }

      let result = await DepositFunction.createDepositTransaction(
        user,
        paymentAmount,
        paymentRef,
        walletId,
        bankInfomation,
        undefined,
        req.payload.paymentSecondaryRef,
      );
      if (result) {
        let transaction = await DepositTransactionAccess.findById(result[0]);
        await publishJson('STAFF_GENERAL', transaction);
        resolve(result);
      } else {
        console.error(`error deposit transaction userRequestDeposit: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error deposit transaction userRequestDeposit`, e);
      if (e === 'DUPLICATE_TRANSACTION_ID') {
        console.error(`error deposit transaction userRequestDeposit: DUPLICATE_TRANSACTION_ID`);
        reject('DUPLICATE_TRANSACTION_ID');
      } else {
        console.error(`error deposit transaction userRequestDeposit: ${ERROR}`);
        reject('failed');
      }
    }
  });
}
async function _addStaffNameInTransactionList(transactionList, storeStaffName = {}) {
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

function _transactionsSetPaymentMethodTypeName(transactionList) {
  const PaymentMethodFunctions = require('../../PaymentMethod/PaymentMethodFunctions');
  for (let transaction of transactionList) {
    if (transaction.paymentMethodId) {
      transaction.paymentMethodType = PaymentMethodFunctions.getPaymentMethodTypeName(transaction.paymentMethodType);
    }
  }
  return transactionList;
}

async function getDetailTransactionDeposit(transactionList) {
  let transactionListWithStaffName = await _addStaffNameInTransactionList(transactionList);
  let result = _transactionsSetPaymentMethodTypeName(transactionListWithStaffName);
  return result;
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  approveDepositTransaction,
  summaryAll,
  summaryUser,
  denyDepositTransaction,
  userRequestDeposit,
  depositHistory,
  addPointForUser,
  exportHistoryOfUser,
  exportSalesToExcel,
};
