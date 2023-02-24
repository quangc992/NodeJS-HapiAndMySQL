/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moment = require('moment');

const BonusTransactionResource = require('../resourceAccess/PaymentBonusTransactionResourceAccess');
const BonusTransactionUserView = require('../resourceAccess/PaymentBonusTransactionUserView');
const UserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const PaymentBonusFunction = require('../PaymentBonusTransactionFunctions');
const PaymentDepositTransactionFunctions = require('../../PaymentDepositTransaction/PaymentDepositTransactionFunctions');
const UserWallet = require('../../Wallet/resourceAccess/WalletResourceAccess');
const AppUserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');

const Logger = require('../../../utils/logging');
const { INVALID_REFER_USER } = require('../PaymentBonusTransactionConstant');
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');
const INVALID_BANKINFOMATION = undefined;
const INVALID_STAFF = undefined;
const { PAYMENT_TYPE } = require('../../PaymentMethod/PaymentMethodConstant');
const { ERROR } = require('../../Common/CommonConstant');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.appUserId;
      let paymentAmount = req.payload.paymentAmount;
      let staff = req.currentUser;

      if (!appUserId) {
        console.error(`bonus transaction insert: user is invalid`);
        reject('user is invalid');
        return;
      }

      let user = await UserResource.find({ appUserId: appUserId });
      if (!user || user.length < 1) {
        console.error(`bonus transaction insert: can not find user`);
        reject('can not find user');
        return;
      }
      user = user[0];

      let result = await PaymentBonusFunction.createBonusTransactionByUserId(
        appUserId,
        paymentAmount,
        INVALID_REFER_USER,
        INVALID_BANKINFOMATION,
        staff,
      );
      if (result) {
        resolve(result);
      } else {
        console.error(`error createBonusTransactionByUserId:${appUserId} ${ERROR}`);
        reject('failed');
      }
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
      if (filter === undefined) {
        filter = {};
      }

      let transactionList = await BonusTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await BonusTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);

        //hien thi companyName la ten cua nguoi tham chieu, khong phai ten nguoi nhan
        for (let i = 0; i < transactionList.length; i++) {
          transactionList[i].companyName = '';
          let _referUser = await UserResource.findById(transactionList[i].referUserId);
          if (_referUser) {
            transactionList[i].companyName = _referUser.companyName;
            transactionList[i].memberReferIdF1 = _referUser.memberReferIdF1;
            transactionList[i].memberReferIdF2 = _referUser.memberReferIdF2;
            transactionList[i].memberReferIdF3 = _referUser.memberReferIdF3;
          }
        }
        transactionList = await PaymentBonusFunction.addStaffNameInTransactionList(transactionList);
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
      Logger.error(e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let updateResult = await BonusTransactionResource.updateById(req.payload.id, req.payload.data);
      if (updateResult) {
        resolve(updateResult);
      } else {
        resolve({});
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
      let transactionList = await BonusTransactionUserView.find({ paymentBonusTransactionId: req.payload.id });

      if (transactionList) {
        transactionList = await PaymentBonusFunction.addStaffNameInTransactionList(transactionList);
        resolve(transactionList[0]);
      } else {
        resolve({});
      }
      resolve('success');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await BonusTransactionResource.deleteById(id);
      if (result) {
        resolve(result);
      } else {
        console.error(`error bonusTransaction deleteById:${id} ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetBonusHistory(req) {
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
        console.error(`error paymentBonus userGetBonusHistory: ${ERROR}`);
        reject('failed');
        return;
      }

      let transactionList = await BonusTransactionUserView.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await BonusTransactionUserView.customCount(filter, undefined, undefined, startDate, endDate, undefined, order);

        //hien thi companyName la ten cua nguoi tham chieu, khong phai ten nguoi nhan
        for (let i = 0; i < transactionList.length; i++) {
          transactionList[i].companyName = '';
          let _referUser = await UserResource.findById(transactionList[i].referUserId);
          if (_referUser) {
            transactionList[i].companyName = _referUser.companyName;
            transactionList[i].memberReferIdF1 = _referUser.memberReferIdF1;
            transactionList[i].memberReferIdF2 = _referUser.memberReferIdF2;
            transactionList[i].memberReferIdF3 = _referUser.memberReferIdF3;
          }
        }
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
      Logger.error(e);
      reject('failed');
    }
  });
}

async function userSummaryBonusByStatus(req) {
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
        console.error(`error paymentBonus userSummaryBonusByStatus: ${ERROR}`);
        reject('failed');
        return;
      }

      let transactionList = await BonusTransactionUserView.sumAmountDistinctByStatus(filter, skip, limit, startDate, endDate, order);

      if (transactionList && transactionList.length > 0) {
        resolve({
          data: transactionList,
          total: transactionList.length,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function denyBonusTransaction(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      let denyResult = await PaymentBonusFunction.denyBonusTransaction(req.payload.id, req.currentUser, req.payload.paymentNote);
      if (denyResult) {
        resolve('success');
      } else {
        Logger.error('deposit transaction was not denied');
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function approveBonusTransaction(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      let approveResult = await PaymentBonusFunction.approveBonusTransaction(
        req.payload.id,
        req.currentUser,
        req.payload.paymentNote,
        req.payload.paymentRef,
      );
      if (approveResult) {
        //cap nhat trang thai sau khi da tra hoa hong
        let transaction = await BonusTransactionResource.find(
          {
            paymentBonusTransactionId: req.payload.id,
          },
          0,
          1,
        );

        if (!transaction || transaction.length < 1) {
          Logger.error('transaction is invalid');
          return undefined;
        }
        transaction = transaction[0];
        resolve(transaction);
      } else {
        Logger.error('deposit transaction was not approved');
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
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
      filter.appUserId = req.currentUser.appUserId;

      let result = await BonusTransactionResource.sumaryPointAmount(startDate, endDate, filter);
      if (result) {
        resolve(result[0]);
      } else {
        console.error(`error paymentBonus summaryUser: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
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

      let result = await BonusTransactionResource.sumaryPointAmount(startDate, endDate, filter);
      if (result) {
        resolve(result[0]);
      } else {
        console.error(`error paymentBonus summaryAll: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function exportHistoryOfUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.id;
      let history = await BonusTransactionResource.find({ appUserId: appUserId });
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
      let data = await BonusTransactionResource.customSearch(startDate, endDate);
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

async function userRequestWithdrawBonus(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.currentUser.appUserId;
      let paymentAmount = req.payload.paymentAmount;
      let bankInfomation = {
        paymentOwner: req.payload.paymentOwner,
        paymentOriginSource: req.payload.paymentOriginSource,
        paymentOriginName: req.payload.paymentOriginName,
      };
      if (!appUserId) {
        console.error(`payment Bonus userRequestWithdrawBonus: user is invalid`);
        reject('user is invalid');
        return;
      }

      let user = await UserResource.find({ appUserId: appUserId });
      if (!user || user.length < 1) {
        console.error(`payment Bonus userRequestWithdrawBonus: can not find user ${appUserId}`);
        reject('can not find user');
        return;
      }
      user = user[0];

      let result = await PaymentBonusFunction.createBonusTransactionByUserId(appUserId, paymentAmount, INVALID_REFER_USER, bankInfomation);

      if (result) {
        resolve(result);
      } else {
        console.error(`error payment Bonus userRequestWithdrawBonus AppuserId:${appUserId} ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function userRequestExchangePoint(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.currentUser.appUserId;
      let paymentAmount = req.payload.paymentAmount;
      let walletId = req.payload.walletId;
      if (!appUserId) {
        console.error(`payment Bonus userRequestExchangePoint: user is invalid`);
        reject('user is invalid');
        return;
      }

      let user = await UserResource.find({ appUserId: appUserId });
      if (!user || user.length < 1) {
        console.error(`payment Bonus userRequestExchangePoint: can not find user ${appUserId}`);
        reject('can not find user');
        return;
      }
      user = user[0];

      const PaymentExchangeFunctions = require('../../PaymentExchangeTransaction/PaymentExchangeTransactionFunctions');
      let result = await PaymentExchangeFunctions.requestExchangeBonusToPOINT(user, paymentAmount, walletId);
      if (result) {
        resolve(result);
      } else {
        console.error(`error payment Bonus userRequestExchangePoint AppUserId:${appUserId} ${ERROR}`);
        reject('failed');
      }
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
  deleteById,
  summaryAll,
  summaryUser,
  denyBonusTransaction,
  approveBonusTransaction,
  exportHistoryOfUser,
  exportSalesToExcel,
  userGetBonusHistory,
  userSummaryBonusByStatus,
  userRequestWithdrawBonus,
  userRequestExchangePoint,
};
