/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const Logger = require('../../../utils/logging');

const tableName = 'ServicePackageWalletViews';
const rootTableName = 'PaymentServicePackageUser';
const primaryKeyField = 'paymentServicePackageUserId';

async function createView() {
  const UserTableName = 'AppUser';
  const PaymentServicePackageTable = 'PaymentServicePackage';
  const WalletBalanceUnit = 'WalletBalanceUnitView';

  let fields = [
    `${primaryKeyField}`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.paymentServicePackageId`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,
    DB.raw(`DATE_FORMAT(${rootTableName}.createdAt, "%d-%m-%Y") as createdDate`),
    `${rootTableName}.packageExpireDate`,
    `${rootTableName}.profitEstimate`,
    `${rootTableName}.packagePrice`,
    `${rootTableName}.packageDiscountPrice`,
    `${rootTableName}.packagePaymentAmount`,
    `${rootTableName}.packageActivityStatus`,
    `${rootTableName}.profitActual`,
    `${rootTableName}.profitClaimed`,
    `${rootTableName}.profitBonus`,
    `${rootTableName}.profitBonusClaimed`,
    `${rootTableName}.packageLastActiveDate`,
    `${rootTableName}.packageNote`,

    `${UserTableName}.sotaikhoan`,
    `${UserTableName}.tentaikhoan`,
    `${UserTableName}.tennganhang`,
    `${UserTableName}.firstName`,
    `${UserTableName}.lastName`,
    `${UserTableName}.username`,
    `${UserTableName}.email`,
    `${UserTableName}.memberLevelName`,
    `${UserTableName}.active`,
    `${UserTableName}.ipAddress`,
    `${UserTableName}.phoneNumber`,
    `${UserTableName}.telegramId`,
    `${UserTableName}.facebookId`,
    `${UserTableName}.appleId`,
    `${PaymentServicePackageTable}.packageName`,
    `${PaymentServicePackageTable}.packagePerformance`,
    `${PaymentServicePackageTable}.packageDuration`,
    `${PaymentServicePackageTable}.packageUnitId`,
    `${WalletBalanceUnit}.walletBalanceUnitId`,
    `${WalletBalanceUnit}.walletBalanceUnitDisplayName`,
    `${WalletBalanceUnit}.walletBalanceUnitCode`,
    `${WalletBalanceUnit}.walletBalanceUnitAvatar`,
    `${WalletBalanceUnit}.originalPrice`,
    `${WalletBalanceUnit}.userSellPrice`,
    `${WalletBalanceUnit}.agencySellPrice`,
    `${WalletBalanceUnit}.balance`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(UserTableName, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${UserTableName}.appUserId`);
    })
    .leftJoin(PaymentServicePackageTable, function () {
      this.on(`${rootTableName}.paymentServicePackageId`, '=', `${PaymentServicePackageTable}.paymentServicePackageId`);
    })
    .leftJoin(WalletBalanceUnit, function () {
      this.on(`${PaymentServicePackageTable}.packageUnitId`, '=', `${WalletBalanceUnit}.walletBalanceUnitId`);
      this.on(`${rootTableName}.appUserId`, '=', `${WalletBalanceUnit}.appUserId`);
    });

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

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

async function sumAmountDistinctByDate(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByDate(tableName, 'packagePaymentAmount', filter, startDate, endDate);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  if (filter === undefined) {
    filter = {};
  }
  let filterData = JSON.parse(JSON.stringify(filter));

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

  queryBuilder.where(filterData);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }
  queryBuilder.where('walletBalanceUnitId', '>', 0);

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
  //const _field = 'packagePaymentAmount';

  let queryBuilder = DB(tableName);
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  if (filter.referAgentId) {
    queryBuilder.where('referId', referAgentId);
  }

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${sumField} as sumResult`).then(records => {
        if (records && records[0].sumResult === null) {
          resolve(undefined);
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

async function customSumCountDistinct(distinctFields, filter, startDate, endDate) {
  const _sumField = 'packagePerformance';

  let queryBuilder = DB(tableName);
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where(filter);
  queryBuilder.where('walletBalanceUnitId', '>', 0);
  return new Promise((resolve, reject) => {
    try {
      queryBuilder
        .sum(`${_sumField} as totalSum`)
        .count(`${_sumField} as totalCount`)
        .select(distinctFields)
        .groupBy(distinctFields)
        .then(records => {
          if (records && (records.length < 1 || records[0].totalCount === null)) {
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

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  sum,
  customSearch,
  customCount,
  customSum,
  customSumCountDistinct,
  sumAmountDistinctByDate,
};
