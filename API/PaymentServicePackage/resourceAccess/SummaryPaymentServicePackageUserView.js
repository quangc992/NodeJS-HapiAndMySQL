/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'SummaryPaymentServicePackageUserView';
const rootTableName = 'AppUserViews';
const primaryKeyField = 'appUserId';
async function createView() {
  const PaymentServicePackageUserTable = 'PaymentServicePackageUser';

  let fields = [
    `${rootTableName}.appUserId`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.firstName`,
    `${rootTableName}.lastName`,
    `${rootTableName}.email`,
    `${rootTableName}.memberLevelName`,
    `${rootTableName}.active`,
    `${rootTableName}.ipAddress`,
    `${rootTableName}.phoneNumber`,
    `${rootTableName}.telegramId`,
    `${rootTableName}.facebookId`,
    `${rootTableName}.appleId`,
    `${rootTableName}.username`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.companyName`,
    `${rootTableName}.isVerified`,

    `${rootTableName}.appUserMembershipTitle`,
    `${rootTableName}.appUsermembershipId`,
    `${rootTableName}.memberReferIdF1`,
    `${rootTableName}.memberReferIdF2`,
    `${rootTableName}.memberReferIdF3`,
    `${rootTableName}.memberReferIdF4`,
    `${rootTableName}.memberReferIdF5`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .sum('packagePaymentAmount as totalpackagePaymentAmount')
    .sum('profitActual as totalProfitActual')
    .sum('profitClaimed as totalProfitClaimed')
    .count('paymentServicePackageUserId as totalCount')
    .groupBy(`${rootTableName}.appUserId`)
    .orderBy(`${rootTableName}.appUserId`)
    .leftJoin(PaymentServicePackageUserTable, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${PaymentServicePackageUserTable}.appUserId`);
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

function _makeQueryBuilderForReferedUser(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('companyName', 'like', `%${searchText}%`);
      // .orWhere("firstName", "like", `%${searchText}%`)
      // .orWhere("lastName", "like", `%${searchText}%`)
      // .orWhere("phoneNumber", "like", `%${searchText}%`)
      // .orWhere("email", "like", `%${searchText}%`)
      // .orWhere("companyName", "like", `%${searchText}%`);
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

  queryBuilder.where(filter);

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

async function findReferedUserByUserId(filter, skip, limit, searchText) {
  let queryBuilder = _makeQueryBuilderForReferedUser(filter, skip, limit, undefined, undefined, searchText);
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

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  sum,
  findReferedUserByUserId,
  countReferedUserByUserId,
  sumReferedUserByUserId,
  customSum,
  customCount,
  customSearch,
};
