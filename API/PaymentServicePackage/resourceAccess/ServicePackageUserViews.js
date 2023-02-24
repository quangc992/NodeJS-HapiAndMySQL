/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const Logger = require('../../../utils/logging');
const { ACTIVITY_STATUS } = require('../PaymentServicePackageConstant');
const tableName = 'ServicePackageUserViews';
const rootTableName = 'PaymentServicePackageUser';
const primaryKeyField = 'paymentServicePackageUserId';

const UserTableName = 'AppUserViews';
async function createView() {
  const PaymentServicePackageTable = 'PaymentServicePackage';
  // const WalletBalanceUnitTable = "WalletBalanceUnit";

  let fields = [
    `${rootTableName}.${primaryKeyField}`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.packagePrice`,
    `${rootTableName}.paymentServicePackageId`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,
    DB.raw(`DATE_FORMAT(${rootTableName}.createdAt, "%d-%m-%Y") as createdDate`),
    `${rootTableName}.packageExpireDate`,
    `${rootTableName}.profitEstimate`,
    `${rootTableName}.packageDiscountPrice`,
    `${rootTableName}.packagePaymentAmount`,
    `${rootTableName}.packageActivityStatus`,
    `${rootTableName}.profitActual`,
    `${rootTableName}.profitClaimed`,
    `${rootTableName}.profitBonus`,
    `${rootTableName}.profitBonusClaimed`,

    `${rootTableName}.packageLastActiveDate`,
    `${rootTableName}.packageCurrentPerformance`,
    `${rootTableName}.percentCompleted`,
    `${rootTableName}.packageNote`,

    `${UserTableName}.sotaikhoan`,
    `${UserTableName}.tentaikhoan`,
    `${UserTableName}.tennganhang`,
    `${UserTableName}.username`,
    `${UserTableName}.firstName`,
    `${UserTableName}.lastName`,
    `${UserTableName}.email`,
    `${UserTableName}.memberLevelName`,
    `${UserTableName}.active`,
    `${UserTableName}.ipAddress`,
    `${UserTableName}.phoneNumber`,
    `${UserTableName}.telegramId`,
    `${UserTableName}.facebookId`,
    `${UserTableName}.appleId`,
    `${UserTableName}.referUserId`,
    `${UserTableName}.appUserMembershipTitle`,
    `${UserTableName}.appUsermembershipId`,
    `${UserTableName}.memberReferIdF1`,
    `${UserTableName}.memberReferIdF2`,
    `${UserTableName}.memberReferIdF3`,
    `${UserTableName}.memberReferIdF4`,
    `${UserTableName}.memberReferIdF5`,
    `${UserTableName}.companyName`,

    `${PaymentServicePackageTable}.packageName`,
    `${PaymentServicePackageTable}.packagePerformance`,
    `${PaymentServicePackageTable}.packageDuration`,
    `${PaymentServicePackageTable}.packageCategory`,
    `${PaymentServicePackageTable}.packageType`,
    `${PaymentServicePackageTable}.packageUnitId`,
    `${PaymentServicePackageTable}.packageStatus`,

    // `${WalletBalanceUnitTable}.walletBalanceUnitDisplayName`,
    // `${WalletBalanceUnitTable}.walletBalanceUnitCode`,
    // `${WalletBalanceUnitTable}.walletBalanceUnitAvatar`,
    // `${WalletBalanceUnitTable}.originalPrice`,
    // `${WalletBalanceUnitTable}.userSellPrice`,
    // `${WalletBalanceUnitTable}.agencySellPrice`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(UserTableName, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${UserTableName}.appUserId`);
    })
    .leftJoin(PaymentServicePackageTable, function () {
      this.on(`${rootTableName}.paymentServicePackageId`, '=', `${PaymentServicePackageTable}.paymentServicePackageId`);
    });
  // .leftJoin(WalletBalanceUnitTable, function () {
  //   this.on(`${PaymentServicePackageTable}.packageUnitId`, '=', `${WalletBalanceUnitTable}.walletBalanceUnitId`);
  // });

  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createView();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

async function sumAmountDistinctByDate(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByDate(tableName, 'packagePaymentAmount', filter, startDate, endDate);
}

async function customGetListUserBuyPackage(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  query.whereIn('packageActivityStatus', [ACTIVITY_STATUS.STANDBY, ACTIVITY_STATUS.WORKING]);
  return await query.select();
}

async function customSumCountDistinct(distinctFields, filter, startDate, endDate) {
  const _sumField = 'packagePaymentAmount';
  let _orderBy = {
    key: 'totalSum',
    value: 'desc',
  };
  let queryBuilder = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, undefined, _orderBy);

  return new Promise((resolve, reject) => {
    try {
      queryBuilder
        .sum(`${_sumField} as totalSum`)
        .count(`${_sumField} as totalCount`)
        .select(distinctFields)
        .groupBy(distinctFields)
        .then(records => {
          if (records && records[0].totalCount === null) {
            resolve(undefined);
          } else {
            resolve(records);
          }
        });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${distinctFields}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

async function countDistinct(distinctFields, filter, startDate, endDate) {
  let _orderBy = {
    key: 'username',
    value: 'desc',
  };
  let queryBuilder = _makeQueryBuilderByFilter(filter, undefined, undefined, undefined, startDate, endDate, undefined, _orderBy);

  return new Promise((resolve, reject) => {
    try {
      queryBuilder
        .count(`${primaryKeyField} as totalPackageCount`)
        .select(
          distinctFields,
          `username`,
          `firstName`,
          `lastName`,
          `email`,
          `memberLevelName`,
          `phoneNumber`,
          `telegramId`,
          `facebookId`,
          `appleId`,
          `referUserId`,
        )
        .groupBy(distinctFields)
        .then(records => {
          if (records && records.length > 0) {
            resolve(records);
          } else {
            resolve(undefined);
          }
        });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${distinctFields}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

async function customSumProfit(filter, startDate, endDate, searchText) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText);
  return new Promise((resolve, reject) => {
    try {
      queryBuilder
        .sum(`profitEstimate as totalProfitEstimate`)
        .sum(`profitActual as totalProfitActual`)
        .sum(`profitClaimed as totalProfitClaimed`)
        .sum(`profitBonus as totalProfitBonus`)
        .sum(`profitBonusClaimed as totalProfitBonusClaimed`)
        .then(records => {
          if (records && records[0].totalCount === null) {
            resolve(undefined);
          } else {
            resolve(records);
          }
        });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${distinctFields}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      resolve(undefined);
    }
  });
}

function _makeQueryBuilderForReferedUser(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (filter && filter.appUserId) {
    const _appUserId = filter.appUserId;
    queryBuilder.where(function () {
      this.orWhere('memberReferIdF1', _appUserId).orWhere('memberReferIdF2', _appUserId).orWhere('memberReferIdF3', _appUserId);
      // .orWhere("memberReferIdF4", _appUserId)
      // .orWhere("memberReferIdF5", _appUserId);
    });
    delete filter.appUserId;
  }

  queryBuilder.where('isDeleted', 0);

  queryBuilder.where(filter);

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

async function findReferedUserByUserId(appUserId, skip, limit) {
  let queryBuilder = _makeQueryBuilderForReferedUser(
    {
      appUserId: appUserId,
    },
    skip,
    limit,
  );
  return await queryBuilder.select();
}

async function countReferedUserByUserId(filter) {
  let queryBuilder = _makeQueryBuilderForReferedUser(filter, undefined, undefined);
  return await queryBuilder.count(`${primaryKeyField} as count`);
}

async function sumReferedUserByUserId(filter, sumField, startDate, endDate) {
  let queryBuilder = _makeQueryBuilderForReferedUser(filter, undefined, undefined, startDate, endDate);
  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${sumField} as sumResult`).then(records => {
        if (records && records[0].sumResult === null) {
          resolve(0);
        } else {
          resolve(records);
        }
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${sumField}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = JSON.parse(JSON.stringify(filter));

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`)
        .orWhere('companyName', 'like', `%${searchText}%`);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function customSum(sumField, filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return queryBuilder.sum(`${sumField} as sumResult`);
}

async function customSearchAllByPackageCategory(filter, skip, limit, searchText, startDate, endDate, order) {
  let _packageCategories = [];
  if (filter.packageCategory) {
    _packageCategories = JSON.parse(JSON.stringify(filter.packageCategory));
    filter.packageCategory = undefined;
  }
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  query.whereIn('packageCategory', _packageCategories);
  return await query.select();
}

async function customCountAllByPackageCategory(filter, searchText, startDate, endDate) {
  let _packageCategories = [];
  if (filter.packageCategory) {
    _packageCategories = JSON.parse(JSON.stringify(filter.packageCategory));
    filter.packageCategory = undefined;
  }

  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText);
  query.whereIn('packageCategory', _packageCategories);

  return await query.count(`${primaryKeyField} as count`);
}

async function findAllWorkingPackage(packageActivityStatuses, filter, skip, limit) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, undefined, undefined, undefined, undefined);
  query.whereIn('packageActivityStatus', packageActivityStatuses);
  return await query.select();
}
module.exports = {
  insert,
  find,
  findById,
  count,
  updateById,
  initViews,
  sum,
  customSearch,
  customCount,
  customSum,
  customSumCountDistinct,
  sumAmountDistinctByDate,
  countDistinct,
  customSumProfit,
  customGetListUserBuyPackage,
  findReferedUserByUserId,
  countReferedUserByUserId,
  sumReferedUserByUserId,
  customSearchAllByPackageCategory,
  customCountAllByPackageCategory,
  findAllWorkingPackage,
};
