/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { BET_STATUS } = require('../BetRecordsConstant');
const tableName = 'UserBetRecordsView';
const rootTableName = 'BetRecords';
const primaryKeyField = 'betRecordId';

//cac field nay la optional, tuy du an co the su dung hoac khong
function optionalViewFields(table) {
  return [`${table}.memberReferIdF1`, `${table}.memberReferIdF2`, `${table}.memberReferIdF3`];
}

async function createUserTotalBetView() {
  const UserTableName = 'AppUser';
  let fields = [
    `${rootTableName}.betRecordId`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.betRecordAmountIn`,
    `${rootTableName}.betRecordAmountOut`,
    `${rootTableName}.betRecordWin`,
    `${rootTableName}.betRecordStatus`,
    `${rootTableName}.betRecordType`,
    `${rootTableName}.betRecordSection`,
    `${rootTableName}.betRecordNote`,
    `${rootTableName}.betRecordResult`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,

    `${UserTableName}.referUserId`,
    `${UserTableName}.referUser`,
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
  ];

  fields = fields.concat(optionalViewFields(UserTableName));

  var viewDefinition = DB.select(fields)
    .from(`${rootTableName}`)
    .leftJoin(`${UserTableName}`, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${UserTableName}.appUserId`);
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

async function sumBetAmountDistinctByAppUserId(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByCustomField(tableName, 'betRecordAmountIn', 'appUserId', filter, startDate, endDate);
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

function _makeQueryBuilderForReferedUser(filter, skip, limit, searchText, startDate, endDate, order) {
  let queryBuilder = _makeQueryBuilderByFilter({}, skip, limit, searchText, startDate, endDate, order);

  if (filter.memberReferIdF1) {
    queryBuilder.where({ memberReferIdF1: filter.memberReferIdF1 });
  } else if (filter.memberReferIdF2) {
    queryBuilder.where({ memberReferIdF2: filter.memberReferIdF2 });
  } else if (filter.memberReferIdF3) {
    queryBuilder.where({ memberReferIdF3: filter.memberReferIdF3 });
    // } else if (filter.memberReferIdF4) {
    //   queryBuilder.where({memberReferIdF4: filter.memberReferIdF4});
    // } else if (filter.memberReferIdF5) {
    //   queryBuilder.where({memberReferIdF5: filter.memberReferIdF5});
    // } else if (filter.memberReferIdF6) {
    //   queryBuilder.where({memberReferIdF6: filter.memberReferIdF6});
    // } else if (filter.memberReferIdF7) {
    //   queryBuilder.where({memberReferIdF7: filter.memberReferIdF7});
    // } else if (filter.memberReferIdF8) {
    //   queryBuilder.where({memberReferIdF8: filter.memberReferIdF8});
    // }  else if (filter.memberReferIdF9) {
    //   queryBuilder.where({memberReferIdF9: filter.memberReferIdF9});
    // } else if (filter.memberReferIdF10) {
    //   queryBuilder.where({memberReferIdF10: filter.memberReferIdF10});
  } else if (filter.appUserId) {
    queryBuilder.where(function () {
      this.orWhere('memberReferIdF1', filter.appUserId).orWhere('memberReferIdF2', filter.appUserId).orWhere('memberReferIdF3', filter.appUserId);
      // .orWhere('memberReferIdF4', filter.appUserId)
      // .orWhere('memberReferIdF5', filter.appUserId)
      // .orWhere('memberReferIdF6', filter.appUserId)
      // .orWhere('memberReferIdF7', filter.appUserId)
      // .orWhere('memberReferIdF8', filter.appUserId)
      // .orWhere('memberReferIdF9', filter.appUserId)
      // .orWhere('memberReferIdF10', filter.appUserId)
    });
  }

  return queryBuilder;
}

async function customSumForReferedUser(sumField, filter, searchText, startDate, endDate, order) {
  let queryBuilder = _makeQueryBuilderForReferedUser(filter, undefined, undefined, searchText, startDate, endDate, order);
  return queryBuilder.sum(`${sumField} as sumResult`);
}

async function countReferedUserByUserId(filter, searchText, startDate, endDate) {
  let queryBuilder = _makeQueryBuilderForReferedUser(filter, undefined, undefined, searchText, startDate, endDate);
  return await queryBuilder.count(`${primaryKeyField} as count`);
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
  sumBetAmountDistinctByAppUserId,
  customSumForReferedUser,
  countReferedUserByUserId,
};
