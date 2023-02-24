/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { PAYMENT_AMOUTH } = require('../WalletRecordConstant');
const tableName = 'WalletRecordViews';
const rootTableName = 'WalletRecord';
const primaryKeyField = 'WalletRecordId';
async function createView() {
  const WalletTableName = 'Wallet';
  const UserTableName = 'AppUser';
  const UserViewsTableName = 'AppUserViews';
  let fields = [
    `${rootTableName}.appUserId`,
    `${rootTableName}.WalletRecordId`,
    `${rootTableName}.walletId`,
    `${rootTableName}.paymentAmount`,
    `${rootTableName}.paymentAmountIn`,
    `${rootTableName}.paymentAmountOut`,
    `${rootTableName}.paymentAmountInOut`,
    `${rootTableName}.balanceBefore`,
    `${rootTableName}.balanceAfter`,
    `${rootTableName}.WalletRecordNote`,
    `${rootTableName}.WalletRecordType`,
    `${rootTableName}.WalletRecordRef`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.staffId`,
    `${WalletTableName}.walletType`,
    `${UserTableName}.memberReferIdF1`,
    `${UserTableName}.memberReferIdF2`,
    `${UserTableName}.memberReferIdF3`,
    `${UserTableName}.memberReferIdF4`,
    `${UserTableName}.memberReferIdF5`,
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
    `${UserTableName}.username`,
    `${UserTableName}.companyName`,

    `${UserTableName}.sotaikhoan`, //dung tam
    `${UserTableName}.tentaikhoan`, //dung tam
    `${UserTableName}.tennganhang`, //dung tam
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(WalletTableName, function () {
      this.on(`${rootTableName}.walletId`, '=', `${WalletTableName}.walletId`);
    })
    .leftJoin(UserTableName, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${UserTableName}.appUserId`);
    });

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
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`)
        .orWhere('companyName', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where({ isDeleted: 0 });

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

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
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

function _makeQueryBuilderForReferedUser(
  filter = {},
  appUserId,
  skip,
  limit,
  memberReferIdF1,
  memberReferIdF2,
  memberReferIdF3,
  memberReferIdF4,
  memberReferIdF5,
  startDate,
  endDate,
) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, skip, limit);

  if (memberReferIdF1) {
    queryBuilder.where({ memberReferIdF1: memberReferIdF1 });
  } else if (memberReferIdF2) {
    queryBuilder.where({ memberReferIdF2: memberReferIdF2 });
  } else if (memberReferIdF3) {
    queryBuilder.where({ memberReferIdF3: memberReferIdF3 });
  } else if (memberReferIdF4) {
    queryBuilder.where({ memberReferIdF4: memberReferIdF4 });
  } else if (memberReferIdF5) {
    queryBuilder.where({ memberReferIdF5: memberReferIdF5 });
  } else if (appUserId) {
    queryBuilder.where(function () {
      this.orWhere('memberReferIdF1', appUserId)
        .orWhere('memberReferIdF2', appUserId)
        .orWhere('memberReferIdF3', appUserId)
        .orWhere('memberReferIdF4', appUserId)
        .orWhere('memberReferIdF5', appUserId);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  return queryBuilder;
}

async function sumReferedUserByUserId(
  filter,
  appUserId,
  memberReferIdF1,
  memberReferIdF2,
  memberReferIdF3,
  memberReferIdF4,
  memberReferIdF5,
  startDate,
  endDate,
) {
  const _field = 'paymentAmount';
  let queryBuilder = _makeQueryBuilderForReferedUser(
    filter,
    appUserId,
    undefined,
    undefined,
    memberReferIdF1,
    memberReferIdF2,
    memberReferIdF3,
    memberReferIdF4,
    memberReferIdF5,
    startDate,
    endDate,
  );
  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${_field} as sumResult`).then(records => {
        if (records && records[0].sumResult === null) {
          resolve(undefined);
        } else {
          resolve(records);
        }
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${field}: ${JSON.stringify(filter)}`);
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
  modelName: tableName,
  customSearch,
  customCount,
  sumAmountDistinctByDate,
  sumReferedUserByUserId,
  customSum,
  customSumDistinct,
};
