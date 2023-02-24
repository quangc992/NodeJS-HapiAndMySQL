/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const ServicePackageWalletViews = require('../resourceAccess/ServicePackageWalletViews');
const ServicePackageUserViews = require('../resourceAccess/ServicePackageUserViews');
const SummaryPaymentServicePackageUserView = require('../resourceAccess/SummaryPaymentServicePackageUserView');
const UserServicePackageFunctions = require('../UserServicePackageFunctions');
const AppUserFunctions = require('../../AppUsers/AppUsersFunctions');
const { USER_ERROR } = require('../../AppUsers/AppUserConstant');
const Logger = require('../../../utils/logging');
const MINING_DURATION = require('../PaymentServicePackageConstant').MINING_DURATION;
const ServicePackageUser = require('../resourceAccess/PaymentServicePackageUserResourceAccess');
const { ACTIVITY_STATUS, PACKAGE_CATEGORY, PACKAGE_TYPE } = require('../PaymentServicePackageConstant');
const BetRecordsFunctions = require('../../BetRecords/BetRecordsFunctions');
const PaymentServicePackageFunctions = require('../PaymentServicePackageFunctions');
const { ERROR } = require('../../Common/CommonConstant');
async function getListUserBuyPackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let searchText = req.payload.searchText;
      if (filter === undefined) {
        filter = {};
      }
      filter.appUserId = req.currentUser.appUserId;
      let packages = await ServicePackageUserViews.customGetListUserBuyPackage(filter, skip, limit, startDate, endDate, searchText, order);
      if (packages && packages.length > 0) {
        let packagesCount = await ServicePackageUserViews.customCount(filter, skip, undefined, startDate, endDate, searchText, order);

        //cap nhat loai package phai dung voi ten package
        for (let i = 0; i < packages.length; i++) {
          let _packageTypeTemp = packages[i].packageType.split('');
          _packageTypeTemp[0] = packages[i].packageName.slice(0, 1);
          packages[i].packageType = _packageTypeTemp.join('');
        }

        resolve({ data: packages, total: packagesCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findUserBuyPackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let searchText = req.payload.searchText;

      if (filter === undefined) {
        filter = {};
      }

      let packages = await ServicePackageUserViews.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (packages && packages.length > 0) {
        let packagesCount = await ServicePackageUserViews.customCount(filter, undefined, undefined, startDate, endDate, searchText);

        //cap nhat loai package phai dung voi ten package
        for (let i = 0; i < packages.length; i++) {
          let _packageTypeTemp = packages[i].packageType.split('');
          _packageTypeTemp[0] = packages[i].packageName.slice(0, 1);
          packages[i].packageType = _packageTypeTemp.join('');
        }

        resolve({ data: packages, total: packagesCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function historyServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let searchText = req.payload.searchText;

      if (filter === undefined) {
        filter = {};
      }

      filter.appUserId = req.currentUser.appUserId;
      filter.packageCategory = PACKAGE_CATEGORY.NORMAL;

      let packages = await ServicePackageUserViews.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (packages && packages.length > 0) {
        for (let i = 0; i < packages.length; i++) {
          const _package = packages[i];

          //get time diff in milisecond
          let _timeDiff = new Date() - 1 - (new Date(_package.packageLastActiveDate) - 1);
          packages[i].processing = parseInt((_timeDiff / (MINING_DURATION * 60 * 60 * 1000)) * 100);

          //maximum 100% processing
          packages[i].processing = Math.min(packages[i].processing, 100);
        }

        //cap nhat loai package phai dung voi ten package
        for (let i = 0; i < packages.length; i++) {
          let _packageTypeTemp = packages[i].packageType.split('');
          _packageTypeTemp[0] = packages[i].packageName.slice(0, 1);
          packages[i].packageType = _packageTypeTemp.join('');
        }

        let packagesCount = await ServicePackageUserViews.customCount(filter, undefined, undefined, startDate, endDate, searchText);
        resolve({ data: packages, total: packagesCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getUserServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      if (filter === undefined) {
        filter = {};
      }
      filter.appUserId = req.currentUser.appUserId;

      let distinctFields = [
        `walletBalanceUnitId`,
        `walletBalanceUnitDisplayName`,
        `walletBalanceUnitCode`,
        `walletBalanceUnitAvatar`,
        `userSellPrice`,
        `agencySellPrice`,
        `balance`,
      ];
      let packages = await ServicePackageWalletViews.customSumCountDistinct(distinctFields, filter, startDate, endDate);

      if (packages && packages.length > 0) {
        for (let packagesCounter = 0; packagesCounter < packages.length; packagesCounter++) {
          const userPackage = packages[packagesCounter];
          packages[packagesCounter].packagePerformance = userPackage.totalSum;
        }
        resolve({ data: packages, total: packages.length });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function buyServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentServicePackageId = req.payload.paymentServicePackageId;
      let currentUser = req.currentUser;

      //if system support for secondary password
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(req.currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} requestWithdraw`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }

      let result = await UserServicePackageFunctions.userBuyServicePackage(currentUser, paymentServicePackageId);
      if (result) {
        //luon luon khoi tao 10 package khi he thong khoi dong
        //he thong luon ton tai 10 package cho moi loai package type de san cho user mua
        await PaymentServicePackageFunctions.generatePresalePackages(PACKAGE_TYPE.A100FAC.type, 20);
        await PaymentServicePackageFunctions.generatePresalePackages(PACKAGE_TYPE.A500FAC.type, 20);
        await PaymentServicePackageFunctions.generatePresalePackages(PACKAGE_TYPE.A1000FAC.type, 20);

        resolve(result);
      } else {
        console.error(`error User payment service package buyServicePackage with paymentServicePackageId ${paymentServicePackageId}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      if (e === 'NOT_ENOUGH_BALANCE') {
        console.error(`error User payment service package buyServicePackage NOT_ENOUGH_BALANCE`);
        reject('NOT_ENOUGH_BALANCE');
      } else {
        console.error(`error User payment service package buyServicePackage: ${ERROR}`);
        reject('failed');
      }
    }
  });
}

async function userGetBalanceByUnitId(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let packages = await ServicePackageWalletViews.find(filter, skip, limit, order);

      if (packages && packages.length > 0) {
        let paymentServiceCount = await ServicePackageWalletViews.count(filter, order);
        resolve({ data: packages, total: paymentServiceCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userActivateServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentServicePackageUserId = req.payload.paymentServicePackageUserId;
      let currentUser = req.currentUser;

      let result = await UserServicePackageFunctions.userActivateServicePackage(currentUser, paymentServicePackageUserId);
      if (result) {
        resolve(result);
      } else {
        console.error(
          `error User payment service package userActivateServicePackage with paymentServicePackageUserId ${paymentServicePackageUserId}: ${ERROR}`,
        );
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userCollectServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentServicePackageUserId = req.payload.paymentServicePackageUserId;
      let currentUser = req.currentUser;

      let collectedAmount = await UserServicePackageFunctions.userCollectServicePackage(currentUser, paymentServicePackageUserId);
      if (collectedAmount !== undefined) {
        if (collectedAmount.profitBonus && collectedAmount.profitBonus > 0.0000000001) {
          //tang BTC va luu lai lich su
          const WalletRecordFunction = require('../../WalletRecord/WalletRecordFunction');
          const WALLET_TYPE = require('../../Wallet/WalletConstant').WALLET_TYPE;

          let _currentPackage = await ServicePackageUserViews.findById(paymentServicePackageUserId);
          if (_currentPackage) {
            await WalletRecordFunction.adminRewardForUser(
              _currentPackage.appUserId,
              collectedAmount.profitBonus,
              WALLET_TYPE.BTC,
              undefined,
              _currentPackage.packageName,
            );
          }
        }

        resolve(collectedAmount);
      } else {
        console.error(
          `error User payment service package userCollectServicePackage with paymentServicePackageUserId ${paymentServicePackageUserId}: ${ERROR}`,
        );
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userRequestCompletedServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentServicePackageUserId = req.payload.paymentServicePackageUserId;
      let currentUser = req.currentUser;
      //if system support for secondary password
      if (req.payload.secondaryPassword) {
        let verifyResult = await AppUserFunctions.verifyUserSecondaryPassword(currentUser.username, req.payload.secondaryPassword);
        if (verifyResult === undefined) {
          Logger.error(`${USER_ERROR.NOT_AUTHORIZED} requestWithdraw`);
          reject(USER_ERROR.NOT_AUTHORIZED);
          return;
        }
      }
      let result = await UserServicePackageFunctions.userCompleteUserServicePackage(paymentServicePackageUserId, currentUser);
      if (result) {
        resolve(result);
      } else {
        console.error(
          `error User payment service package userRequestCompletedServicePackage with paymentServicePackageUserId ${paymentServicePackageUserId}: ${ERROR}`,
        );
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function adminCompletePackagesById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentServicePackageUserId = req.payload.id;
      let currentUser = req.currentUser;

      let result = await UserServicePackageFunctions.adminCompleteUserServicePackage(paymentServicePackageUserId, currentUser);
      if (result) {
        resolve(result);
      } else {
        console.error(
          `error User payment service package adminCompletePackagesById with paymentServicePackageUserId ${paymentServicePackageUserId}: ${ERROR}`,
        );
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function historyCompleteServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      if (filter === undefined) {
        filter = {};
      }

      filter.appUserId = req.currentUser.appUserId;
      filter.packageActivityStatus = ACTIVITY_STATUS.COMPLETED;
      filter.packageCategory = PACKAGE_CATEGORY.NORMAL;

      let packages = await ServicePackageUserViews.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (packages && packages.length > 0) {
        let resultCount = await ServicePackageUserViews.customCount(filter, undefined, undefined, startDate, endDate);

        //cap nhat loai package phai dung voi ten package
        for (let i = 0; i < packages.length; i++) {
          let _packageTypeTemp = packages[i].packageType.split('');
          _packageTypeTemp[0] = packages[i].packageName.slice(0, 1);
          packages[i].packageType = _packageTypeTemp.join('');
        }

        resolve({
          data: packages,
          total: resultCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function adminHistoryCompleteServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let searchText = req.payload.searchText;

      if (filter === undefined) {
        filter = {};
      }

      filter.packageActivityStatus = ACTIVITY_STATUS.COMPLETED;

      let packages = await ServicePackageUserViews.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (packages && packages.length > 0) {
        //cap nhat loai package phai dung voi ten package
        for (let i = 0; i < packages.length; i++) {
          let _packageTypeTemp = packages[i].packageType.split('');
          _packageTypeTemp[0] = packages[i].packageName.slice(0, 1);
          packages[i].packageType = _packageTypeTemp.join('');
        }

        let resultCount = await ServicePackageUserViews.customCount(filter, undefined, undefined, startDate, endDate, searchText);

        resolve({
          data: packages,
          total: resultCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function historyCancelServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;

      if (filter === undefined) {
        filter = {};
      }

      filter.appUserId = req.currentUser.appUserId;
      filter.packageActivityStatus = ACTIVITY_STATUS.CANCELED;
      let packages = await ServicePackageUserViews.customSearch(filter, skip, limit, startDate, endDate, undefined, order);

      if (packages && packages.length > 0) {
        //cap nhat loai package phai dung voi ten package
        for (let i = 0; i < packages.length; i++) {
          let _packageTypeTemp = packages[i].packageType.split('');
          _packageTypeTemp[0] = packages[i].packageName.slice(0, 1);
          packages[i].packageType = _packageTypeTemp.join('');
        }

        let resultCount = await ServicePackageUserViews.customCount(filter, undefined, undefined, startDate, endDate);
        resolve({
          data: packages,
          total: resultCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function adminHistoryCancelServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let searchText = req.payload.searchText;

      if (filter === undefined) {
        filter = {};
      }
      filter.packageActivityStatus = ACTIVITY_STATUS.CANCELED;
      let packages = await ServicePackageUserViews.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (packages && packages.length > 0) {
        let resultCount = await ServicePackageUserViews.customCount(filter, undefined, undefined, startDate, endDate, searchText);

        //cap nhat loai package phai dung voi ten package
        for (let i = 0; i < packages.length; i++) {
          let _packageTypeTemp = packages[i].packageType.split('');
          _packageTypeTemp[0] = packages[i].packageName.slice(0, 1);
          packages[i].packageType = _packageTypeTemp.join('');
        }

        resolve({
          data: packages,
          total: resultCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function historyBonusServicePackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      if (filter === undefined) {
        filter = {};
      }
      filter.appUserId = req.currentUser.appUserId;

      filter.packageCategory = [PACKAGE_CATEGORY.BONUS_NORMAL, PACKAGE_CATEGORY.BONUS_KYC, PACKAGE_CATEGORY.BONUS_RANK];

      let packages = await ServicePackageUserViews.customSearchAllByPackageCategory(filter, skip, limit, undefined, startDate, endDate, order);
      if (packages && packages.length > 0) {
        let resultCount = await ServicePackageUserViews.customCountAllByPackageCategory(filter, undefined, startDate, endDate);

        //cap nhat loai package phai dung voi ten package
        for (let i = 0; i < packages.length; i++) {
          let _packageTypeTemp = packages[i].packageType.split('');
          _packageTypeTemp[0] = packages[i].packageName.slice(0, 1);
          packages[i].packageType = _packageTypeTemp.join('');
        }

        if (resultCount) {
          resolve({
            data: packages,
            total: resultCount[0].count,
          });
        } else {
          resolve({
            data: result,
            total: 0,
          });
        }
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function countAllUserPackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      if (filter === undefined) {
        filter = {};
      }
      let resultCount = await ServicePackageUserViews.countDistinct('appUserId', filter, undefined, undefined, limit, skip);
      if (resultCount && resultCount.length > 0) {
        resolve(resultCount);
      } else {
        resolve([]);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let data = req.payload.data;

      let result = await ServicePackageUser.updateById(id, data);
      if (result && result.length > 0) {
        resolve(result);
      } else {
        console.error(`error User payment service package updateById with id ${id}: ${ERROR}`);
        resolve('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function _summaryReferralByUserId(appUserId, filter, searchText, skip, limit) {
  let resultOutput = {
    data: [],
    total: 0,
    totalServicePackagePaymentAmount: 0,
    totalReferredServicePackagePaymentAmount: 0,
    totalCountVerifiedReferredUser: 0,
  };

  //tinh tong tai san ca nhan, khong tinh cac phan da thanh ly
  let _totalServicePackagePaymentAmount_STANDBY = await ServicePackageUserViews.customSum('packagePaymentAmount', {
    appUserId: appUserId,
    packageActivityStatus: ACTIVITY_STATUS.STANDBY,
  });
  let _totalServicePackagePaymentAmount_WORKING = await ServicePackageUserViews.customSum('packagePaymentAmount', {
    appUserId: appUserId,
    packageActivityStatus: ACTIVITY_STATUS.WORKING,
  });

  resultOutput.totalServicePackagePaymentAmount =
    _totalServicePackagePaymentAmount_STANDBY[0].sumResult + _totalServicePackagePaymentAmount_WORKING[0].sumResult;

  let referredUserList = await SummaryPaymentServicePackageUserView.findReferedUserByUserId(
    {
      appUserId: appUserId,
    },
    skip,
    limit,
    searchText,
  );

  if (referredUserList && referredUserList.length > 0) {
    const BetRecordResource = require('../../BetRecords/resourceAccess/BetRecordsResourceAccess');
    const moment = require('moment');
    let thisWeekStart = moment().startOf('week').endOf('day').format();
    console.info(thisWeekStart);
    let thisWeekEnd = moment().endOf('week').add(1, 'day').format();
    console.info(thisWeekEnd);

    for (let i = 0; i < referredUserList.length; i++) {
      const _referredUser = referredUserList[i];
      let _totalBetRecordWin = await BetRecordResource.sumaryWinLoseAmount(thisWeekStart, thisWeekEnd, {
        appUserId: _referredUser.appUserId,
      });
      if (_totalBetRecordWin && _totalBetRecordWin.length > 0) {
        referredUserList[i].totalBetRecordWin = _totalBetRecordWin[0].sumResult;
      } else {
        referredUserList[i].totalBetRecordWin = 0;
      }

      //tinh tong tai san ca nhan, khong tinh cac phan da thanh ly
      let ___totalServicePackagePaymentAmount_STANDBY = await ServicePackageUserViews.customSum('packagePaymentAmount', {
        appUserId: referredUserList[i].appUserId,
        packageActivityStatus: ACTIVITY_STATUS.STANDBY,
      });
      let ___totalServicePackagePaymentAmount_WORKING = await ServicePackageUserViews.customSum('packagePaymentAmount', {
        appUserId: referredUserList[i].appUserId,
        packageActivityStatus: ACTIVITY_STATUS.WORKING,
      });

      referredUserList[i].totalpackagePaymentAmount =
        ___totalServicePackagePaymentAmount_STANDBY[0].sumResult + ___totalServicePackagePaymentAmount_WORKING[0].sumResult;
    }
    resultOutput.data = referredUserList;

    //count all refer user
    let totalCount = await SummaryPaymentServicePackageUserView.countReferedUserByUserId({
      appUserId: appUserId,
    });
    resultOutput.total = totalCount[0].count;

    //count all refer F1 user
    let totalCountF1 = await SummaryPaymentServicePackageUserView.countReferedUserByUserId({
      memberReferIdF1: appUserId,
    });
    resultOutput.totalCountF1 = totalCountF1[0].count;

    //tinh tong tai san ca nhan, khong tinh cac phan da thanh ly
    let _totalReferredServicePackagePaymentAmount_STANDBY = await ServicePackageUserViews.customSum('packagePaymentAmount', {
      memberReferIdF1: appUserId,
      packageActivityStatus: ACTIVITY_STATUS.STANDBY,
    });
    let _totalReferredServicePackagePaymentAmount_WORKING = await ServicePackageUserViews.customSum('packagePaymentAmount', {
      memberReferIdF1: appUserId,
      packageActivityStatus: ACTIVITY_STATUS.WORKING,
    });

    resultOutput.totalReferredServicePackagePaymentAmount =
      _totalReferredServicePackagePaymentAmount_WORKING[0].sumResult + _totalReferredServicePackagePaymentAmount_STANDBY[0].sumResult;

    let _totalCountVerifiedReferredUser = await SummaryPaymentServicePackageUserView.countReferedUserByUserId({
      memberReferIdF1: appUserId,
      isVerified: 1,
    });
    resultOutput.totalCountVerifiedReferredUser = _totalCountVerifiedReferredUser[0].count;
  }
  return resultOutput;
}

async function getListReferralByUserId(req) {
  let filter = req.payload.filter;
  let searchText = req.payload.searchText;
  let skip = req.payload.skip;
  let limit = req.payload.limit;
  if (filter === undefined) {
    filter = {};
  }

  let appUserId = filter.appUserId * 1;
  filter.memberReferIdF1 = filter.appUserId * 1;
  delete filter.appUserId;

  return new Promise(async (resolve, reject) => {
    try {
      let result = await _summaryReferralByUserId(appUserId, filter, searchText, skip, limit);
      resolve(result);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function summaryReferedUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let searchText = req.payload.searchText;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      if (filter === undefined) {
        filter = {};
      }

      filter.memberReferIdF1 = req.currentUser.appUserId;
      let resultOutput = await _summaryReferralByUserId(req.currentUser.appUserId, filter, searchText, skip, limit);
      resolve(resultOutput);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  historyServicePackage,
  buyServicePackage,
  userGetBalanceByUnitId,
  getUserServicePackage,
  userCollectServicePackage,
  userActivateServicePackage,
  getListUserBuyPackage,
  userRequestCompletedServicePackage,
  historyCompleteServicePackage,
  historyCancelServicePackage,
  historyBonusServicePackage,
  countAllUserPackage,
  adminCompletePackagesById,
  adminHistoryCancelServicePackage,
  adminHistoryCompleteServicePackage,
  updateById,
  summaryReferedUser,
  getListReferralByUserId,
  findUserBuyPackage,
};
