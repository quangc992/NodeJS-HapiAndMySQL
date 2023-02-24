/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const PaymentServicePackageResourceAccess = require('../resourceAccess/PaymentServicePackageResourceAccess');
const ServicePackageUserResourceAccess = require('../resourceAccess/PaymentServicePackageUserResourceAccess');
const PackageUnitView = require('../resourceAccess/PackageUnitView');

const { PACKAGE_CATEGORY, PACKAGE_STATUS } = require('../PaymentServicePackageConstant');
const { ERROR } = require('../../Common/CommonConstant');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      let result = await PaymentServicePackageResourceAccess.insert(data);
      if (result) {
        resolve(result);
      }
      console.error(`error service package insert: ${ERROR}`);
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

      if (!filter) {
        filter = {};
      }

      if (!filter.packageStatus) {
        filter.packageStatus = PACKAGE_STATUS.NEW;
      }

      if (!filter.packageCategory) {
        filter.packageCategory = PACKAGE_CATEGORY.NORMAL;
      }

      let paymentServices = await PackageUnitView.customSearch(filter, skip, limit, undefined, undefined, searchText, order);

      if (paymentServices && paymentServices.length > 0) {
        let paymentServiceCount = await PackageUnitView.customCount(filter, undefined, undefined, undefined, undefined, searchText, order);
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

      if (data.packageDiscountPrice !== undefined) {
        if (data.packageDiscountPrice.trim() === '') {
          data.packageDiscountPrice = null;
        } else {
          data.packageDiscountPrice = data.packageDiscountPrice * 1;
        }
      }

      if (data.packageDiscountPrice !== null && data.packageDiscountPrice < 1) {
        Logger.error(`invalid packageDiscountPrice`);
        reject('INVALID_DISCOUNT_PRICE');
        return;
      }

      let result = await PaymentServicePackageResourceAccess.updateById(id, data);
      if (result) {
        resolve(result);
      }
      console.error(`error service package updateById: ${id}: ${ERROR}`);
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
      console.error(`error service package deleteById: ${id}: ${ERROR}`);
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
        console.error(`error service package deleteById: ${id}: failed to get item`);
        reject('failed to get item');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function activatePackagesByIdList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let idList = req.payload.idList;
      let dataUpdated = {
        isHidden: false,
      };

      //vi moi lan chi co toi da 10-20 package nen ko can xu ly update theo list
      //khoi mat cong viet them method resource, tranh lam source chay lung tung
      for (let i = 0; i < idList.length; i++) {
        const _id = idList[i];
        await PaymentServicePackageResourceAccess.updateById(_id, dataUpdated);
      }
      resolve('success');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deactivatePackagesByIdList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let idList = req.payload.idList;
      let dataUpdated = {
        isHidden: true,
      };

      //vi moi lan chi co toi da 10-20 package nen ko can xu ly update theo list
      //khoi mat cong viet them method resource, tranh lam source chay lung tung
      for (let i = 0; i < idList.length; i++) {
        const _id = idList[i];
        await PaymentServicePackageResourceAccess.updateById(_id, dataUpdated);
      }
      resolve('success');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetListPaymentPackage(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      if (!filter) {
        filter = {};
      }

      filter.packageCategory = PACKAGE_CATEGORY.NORMAL;
      filter.packageStatus = PACKAGE_STATUS.NEW;
      filter.isHidden = 0;

      let paymentServices = await PaymentServicePackageResourceAccess.find(filter, skip, limit, order);
      if (paymentServices && paymentServices.length > 0) {
        let paymentServiceCount = await PaymentServicePackageResourceAccess.count(filter);
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

async function rewardProfitBonusForUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let servicePackageUserId = req.payload.paymentServicePackageUserId;
      let amount = req.payload.profitBonus;
      let rewardResult = await ServicePackageUserResourceAccess.incrementBalance(servicePackageUserId, `profitBonus`, amount);
      if (rewardResult) {
        resolve('success');
      } else {
        console.error(`error service package rewardProfitBonusForUser with servicePackageUserId: ${servicePackageUserId}: ${ERROR}`);
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
  activatePackagesByIdList,
  deactivatePackagesByIdList,
  userGetListPaymentPackage,
  rewardProfitBonusForUser,
};
