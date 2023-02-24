/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const Logger = require('../../../utils/logging');

const tableName = 'PackageUnitView';
const rootTableName = 'PaymentServicePackage';
const primaryKeyField = 'paymentServicePackageId';

async function createView() {
  const WalletBalanceUnitTable = 'WalletBalanceUnit';
  const PaymentServicePackageTable = 'PaymentServicePackage';

  let fields = [
    `${rootTableName}.${primaryKeyField}`,
    `${rootTableName}.packageName`,
    `${rootTableName}.packageDescription`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.packagePrice`,
    `${rootTableName}.packageDiscountPrice`,
    `${rootTableName}.packagePerformance`,
    `${rootTableName}.packageCategory`,
    `${rootTableName}.packageDuration`,
    `${rootTableName}.packageUnitId`,
    `${rootTableName}.packageStatus`,
    `${rootTableName}.packageType`,

    `${WalletBalanceUnitTable}.walletBalanceUnitId`,
    `${WalletBalanceUnitTable}.walletBalanceUnitDisplayName`,
    `${WalletBalanceUnitTable}.walletBalanceUnitCode`,
    `${WalletBalanceUnitTable}.walletBalanceUnitAvatar`,
    `${WalletBalanceUnitTable}.originalPrice`,
    `${WalletBalanceUnitTable}.userSellPrice`,
    `${WalletBalanceUnitTable}.agencySellPrice`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(WalletBalanceUnitTable, function () {
      this.on(`${rootTableName}.packageUnitId`, '=', `${WalletBalanceUnitTable}.walletBalanceUnitId`);
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

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  if (filter === undefined) {
    filter = {};
  }
  let filterData = JSON.parse(JSON.stringify(filter));

  if (searchText) {
    this.orWhere('packageName', 'like', `%${searchText}%`)
      .orWhere('walletBalanceUnitCode', 'like', `%${searchText}%`)
      .orWhere('walletBalanceUnitDisplayName', 'like', `%${searchText}%`);
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
  const _sumField = 'packagePaymentAmount';

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
};
