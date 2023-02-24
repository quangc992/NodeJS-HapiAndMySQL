/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const moment = require('moment');

const PaymentServicePackageResourceAccess = require('../resourceAccess/PaymentServicePackageResourceAccess');
const UserBonusPackageResource = require('../resourceAccess/UserBonusPackageResourceAccess');
const UserPackageResource = require('../resourceAccess/PaymentServicePackageUserResourceAccess');
const PackageUnitView = require('../resourceAccess/PackageUnitView');
const UserBonusPackageView = require('../resourceAccess/UserBonusPackageView');
const { CLAIMABLE_STATUS, PACKAGE_CATEGORY, PACKAGE_STATUS } = require('../PaymentServicePackageConstant');
const Logger = require('../../../utils/logging');
const WalletResource = require('../../Wallet/resourceAccess/WalletResourceAccess');
const { ERROR } = require('../../Common/CommonConstant');
async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      let result = await PaymentServicePackageResourceAccess.insert(data);
      if (result) {
        resolve(result);
      }
      console.error(`error payment service bonus package insert:${ERROR}`);
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
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
      let searchText = req.payload.searchText;

      let paymentServices = await UserBonusPackageView.customSearch(filter, skip, limit, undefined, undefined, searchText, order);

      if (paymentServices && paymentServices.length > 0) {
        let paymentServiceCount = await UserBonusPackageView.customCount(filter, undefined, undefined, undefined, undefined, searchText, order);
        resolve({ data: paymentServices, total: paymentServiceCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function _checkBonusClaimableForPackages(packageList, bonusPackageList) {
  if (!packageList || packageList.length <= 0) {
    return;
  }

  if (!bonusPackageList || bonusPackageList.length <= 0) {
    return;
  }

  for (let i = 0; i < packageList.length; i++) {
    const _userPackage = packageList[i];
    for (let j = 0; j < bonusPackageList.length; j++) {
      const _userBonusPackage = bonusPackageList[j];
      if (_userPackage.paymentServicePackageId === _userBonusPackage.bonusPackageId) {
        packageList[i].bonusPackageClaimable = _userBonusPackage.bonusPackageClaimable;
        packageList[i].userBonusPackageId = _userBonusPackage.userBonusPackageId;
      }
    }
  }
}

async function userGetListPaymentBonusPackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;

      if (!filter) {
        filter = {};
        filter.packageCategory = PACKAGE_CATEGORY.BONUS_NORMAL;
      }

      let paymentServices = await PackageUnitView.customSearch(filter, skip, limit, undefined, undefined, searchText, order);

      if (paymentServices && paymentServices.length > 0) {
        let paymentServiceCount = await PackageUnitView.customCount(filter, undefined, undefined, undefined, undefined, searchText, order);

        //set all bonus package to DISABLE first
        for (let i = 0; i < paymentServices.length; i++) {
          //_checkBonusAvailbilityForUser
          paymentServices[i].bonusPackageClaimable = CLAIMABLE_STATUS.DISABLE;
          paymentServices[i].userBonusPackageId = 0;
        }

        if (req.currentUser) {
          //check if user already bought any package,
          //IF NOT, then keep disabling all bonus package
          let _userBonusPackagesCount = await UserBonusPackageResource.count({});
          if (_userBonusPackagesCount && _userBonusPackagesCount.length > 0) {
            //if user already buy some packages, then we must check for bonus
            if (_userBonusPackagesCount[0].count > 0) {
              let _userBonusPackages = await UserBonusPackageResource.find({
                appUserId: req.currentUser.appUserId,
              });
              if (_userBonusPackages && _userBonusPackages.length > 0) {
                await _checkBonusClaimableForPackages(paymentServices, _userBonusPackages);
              }
            }
          }
        }

        resolve({ data: paymentServices, total: paymentServiceCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
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

      let result = await PaymentServicePackageResourceAccess.updateById(id, data);
      if (result) {
        resolve(result);
      }
      console.error(`error payment service bonus package updateById ${id}:${ERROR}`);
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await PaymentServicePackageResourceAccess.deleteById(id);
      if (result) {
        resolve(result);
      }
      console.error(`error payment service bonus package deleteById ${id}:${ERROR}`);
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await PaymentServicePackageResourceAccess.findById(id);
      if (result) {
        resolve(result);
      } else {
        console.error(`error payment service bonus package findById ${id}: failed to get item`);
        reject('failed to get item');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userClaimBonusPackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userBonusPackageId = req.payload.userBonusPackageId;

      //fetch package info
      let _bonusPackage = await UserBonusPackageResource.findById(userBonusPackageId);
      if (!_bonusPackage) {
        Logger.error(`can not UserBonusPackageResource.findById ${userBonusPackageId}`);
        reject('claim failed');
        return;
      }

      if (_bonusPackage.bonusPackageClaimable !== CLAIMABLE_STATUS.ENABLE) {
        Logger.error(`already process _bonusPackage.bonusPackageClaimable ${_bonusPackage.bonusPackageClaimable}`);
        reject('already claimed');
        return;
      }

      let claimResult = await UserBonusPackageResource.updateById(userBonusPackageId, {
        bonusPackageClaimable: CLAIMABLE_STATUS.CLAIMED,
        bonusPackageClaimedDate: new Date(),
      });

      if (claimResult) {
        //retrive info of reward package
        let _rewardedPackage = await PaymentServicePackageResourceAccess.findById(_bonusPackage.bonusPackageId);
        if (!_rewardedPackage) {
          Logger.error(`can not PaymentServicePackageResourceAccess.findById ${userBonusPackageId}`);
          reject('claim failed');
          return;
        }

        //create new wallet follow balance unit if wallet is not existed
        let newUnitWallet = await WalletResource.find({
          appUserId: req.currentUser.appUserId,
          walletType: WALLET_TYPE.CRYPTO,
          walletBalanceUnitId: _rewardedPackage.packageUnitId,
        });
        if (newUnitWallet && newUnitWallet.length > 0) {
          //if wallet existed, then do nothing
        } else {
          let createNewUnitWallet = await WalletResource.insert({
            appUserId: req.currentUser.appUserId,
            walletType: WALLET_TYPE.CRYPTO,
            walletBalanceUnitId: _rewardedPackage.packageUnitId,
          });
          if (createNewUnitWallet === undefined) {
            Logger.error(
              `userBuyServicePackage can not create new wallet crypto user ${req.currentUser.appUserId} - unitId ${_rewardedPackage.packageUnitId}`,
            );
          }
        }

        //store working package
        let _newUserPackageData = {
          appUserId: req.currentUser.appUserId,
          paymentServicePackageId: _rewardedPackage.paymentServicePackageId,
          packageExpireDate: moment().add(365, 'days').toDate(),
          profitEstimate: _rewardedPackage.packagePerformance * _rewardedPackage.packageDuration,
          packagePrice: _rewardedPackage.packagePrice,
          packageDiscountPrice: _rewardedPackage.packageDiscountPrice,
          packagePaymentAmount: 0,
          packageLastActiveDate: new Date(),
        };
        let newPackageResult = await UserPackageResource.insert(_newUserPackageData);
        if (newPackageResult) {
          resolve(newPackageResult);
        } else {
          Logger.error(`can not servicePackageUser.insert(_newUserPackageData)`);
          reject('claim failed to register new package');
          return;
        }
      } else {
        console.error(`error payment service bonus package userClaimBonusPackage: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function staffSendBonusPackage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentServicePackageId = req.payload.paymentServicePackageId;
      let bonusPackageDescription = req.payload.bonusPackageDescription;
      let appUserId = req.payload.appUserId;

      //fetch package info
      let _bonusPackage = await PaymentServicePackageResourceAccess.findById(paymentServicePackageId);
      if (!_bonusPackage) {
        Logger.error(`can not UserBonusPackageResource.findById ${paymentServicePackageId}`);
        reject('failed');
        return;
      }

      // check xem co phai type bonus ko
      if (_bonusPackage.packageCategory !== PACKAGE_CATEGORY.BONUS_NORMAL) {
        Logger.error(`not for bonus ${_bonusPackage.packageCategory}`);
        reject('failed');
        return;
      }

      // check xem da gui cho ng khac chua
      if (_bonusPackage.packageStatus === PACKAGE_STATUS.SOLD) {
        Logger.error(`sended for another user ${_bonusPackage.packageCategory}`);
        reject('failed');
        return;
      }

      let result = await UserBonusPackageResource.insert({
        bonusPackageId: _bonusPackage.paymentServicePackageId,
        bonusPackageExpireDate: moment().add(10, 'days').toDate(), // 10 ngay de nhan khong thi tu mat
        bonusPackageClaimable: CLAIMABLE_STATUS.ENABLE,
        bonusPackageDescription: bonusPackageDescription,
        appUserId: appUserId,
      });
      if (result) {
        // update package da gui
        await PaymentServicePackageResourceAccess.updateById(paymentServicePackageId, {
          packageStatus: PACKAGE_STATUS.SOLD,
        });
        resolve(result);
      } else {
        console.error(`error payment service bonus package staffSendBonusPackage: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  deleteById,
  findById,
  userGetListPaymentBonusPackage,
  userClaimBonusPackage,
  staffSendBonusPackage,
};
