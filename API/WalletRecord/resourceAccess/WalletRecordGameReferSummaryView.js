/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');
const { WALLET_RECORD_TYPE } = require('../WalletRecordConstant');

const tableName = 'WalletRecordGameReferSummaryView';
const rootTableName = 'WalletRecord';
const primaryKeyField = 'gameRecordId';
async function createView() {
  const GameTable = 'GameRecord';
  const BetRecordTable = 'GamePlayRecords';
  let fields = [
    `${rootTableName}.appUserId`,
    `${rootTableName}.gameRecordId`,
    `${GameTable}.createdAt`,
    `${GameTable}.isDeleted`,
    `${GameTable}.gameRecordName`,
    `${GameTable}.teamNameHome`,
    `${GameTable}.teamNameOpponents`,
    `${GameTable}.gameRecordCategoryId`,
    `${GameTable}.gameRecordDate`,
    `${GameTable}.gameRecordTime`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(GameTable, function () {
      this.on(`${rootTableName}.gameRecordId`, '=', `${GameTable}.gameRecordId`);
    })
    .leftJoin(BetRecordTable, function () {
      this.on(`${rootTableName}.betRecordId`, '=', `${BetRecordTable}.betRecordId`);
    })
    .where({
      WalletRecordType: WALLET_RECORD_TYPE.REFER_BONUS,
    })
    .sum(`${rootTableName}.paymentAmount as totalBonus`)
    .sum(`${BetRecordTable}.betRecordAmountIn as totalBetRecordAmountIn`)
    .sum(`${BetRecordTable}.betRecordAmountOut as totalBetRecordAmountOut`)
    .sum(`${BetRecordTable}.betRecordWin as totalBetRecordWin`)
    .groupBy(fields);

  await Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  await createView();
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
  return await Common.sumAmountDistinctByDate(tableName, 'paymentAmount', filter, startDate, endDate);
}

async function customSumDistinct(sumField, distinctFields, filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);

  return new Promise((resolve, reject) => {
    try {
      queryBuilder
        .sum(`${sumField} as totalSum`)
        .count(`${sumField} as totalCount`)
        .select(`${distinctFields}`)
        .groupBy(`${distinctFields}`)
        // .paginate({ perPage: 2, currentPage: 1 })
        .then(records => {
          if (records && (records.length < 1 || records[0].totalCount === null)) {
            resolve(undefined);
          } else {
            resolve(records);
          }
        });
    } catch (e) {
      console.error('ResourceAccess', `DB customSumDistinct ERROR: ${tableName} ${distinctFields}: ${JSON.stringify(filter)}`);
      console.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('gameRecordName', 'like', `%${searchText}%`)
        .orWhere('teamNameHome', 'like', `%${searchText}%`)
        .orWhere('teamNameOpponents', 'like', `%${searchText}%`);
    });
  }

  // queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

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

async function customCount(filter, startDate, endDate, searchText) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, undefined);
  return await query.count(`${primaryKeyField} as count`);
}

async function customSum(sumField, filter, startDate, endDate, searchText, order) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
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
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${field}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      resolve(undefined);
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
  modelName: tableName,
  customSearch,
  customCount,
  sumAmountDistinctByDate,
  customSum,
  customSumDistinct,
};
