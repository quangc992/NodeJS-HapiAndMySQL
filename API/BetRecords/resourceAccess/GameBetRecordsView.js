/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { BET_STATUS } = require('../BetRecordsConstant');
const tableName = 'GameBetRecordsView';
const rootTableName = 'BetRecords';
const primaryKeyField = 'betRecordId';

async function createUserTotalBetView() {
  const GameTableName = 'ServicePackageUserViews';
  let fields = [
    `${rootTableName}.betRecordId`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.betRecordAmountIn`,
    `${rootTableName}.betRecordAmountOut`,
    `${rootTableName}.betRecordWin`,
    `${rootTableName}.betRecordStatus`,
    `${rootTableName}.betRecordSection`,
    `${rootTableName}.betRecordNote`,
    `${rootTableName}.betRecordResult`,
    `${rootTableName}.betRecordType`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,

    `${GameTableName}.packageName`,
    `${GameTableName}.packageType`,
  ];

  var viewDefinition = DB.select(fields)
    .from(`${rootTableName}`)
    .leftJoin(`${GameTableName}`, function () {
      this.on(`${rootTableName}.gameRecordId`, '=', `${GameTableName}.paymentServicePackageUserId`);
    });
  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createUserTotalBetView();
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

function _makeQueryBuilderByFilter(filter, skip, limit, searchText, startDate, endDate, order) {
  let queryBuilder = DB(tableName);
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

  queryBuilder.where(filterData);

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where(filterData);

  queryBuilder.where({ isDeleted: 0 });

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

async function customSearch(filter, skip, limit, searchText, startDate, endDate, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, searchText, startDate, endDate, order);
  return await query.select();
}

async function customCount(filter, searchText, startDate, endDate) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, searchText, startDate, endDate, undefined);
  return await query.count(`${primaryKeyField} as count`);
}

async function sumaryWinAmount(filter, startDate, endDate, searchText) {
  let sumField = 'betRecordWin';
  filter.betRecordStatus = BET_STATUS.COMPLETED;
  return await customSum(sumField, filter, searchText, startDate, endDate);
}

async function customSum(sumField, filter, searchText, startDate, endDate, order) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, undefined, undefined, searchText, startDate, endDate, order);
  return queryBuilder.sum(`${sumField} as sumResult`);
}
async function customCountDistinct(filter, distinctFields, startDate, endDate) {
  let queryBuilder = DB(tableName);
  if (startDate) {
    DB.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    DB.where('createdAt', '<=', endDate);
  }
  return new Promise((resolve, reject) => {
    try {
      queryBuilder.countDistinct(` ${distinctFields} as CountResult`).then(records => {
        if (records && records[0].sumResult === null) {
          resolve(undefined);
        } else {
          resolve(records);
        }
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${_field}: ${JSON.stringify(filter)}`);
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
  sumaryWinAmount,
  customSum,
  customCountDistinct,
};
