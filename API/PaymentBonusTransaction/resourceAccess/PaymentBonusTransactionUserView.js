/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'BonusTransactionUserView';
const rootTableName = 'PaymentBonusTransaction';
const primaryKeyField = 'paymentBonusTransactionId';
async function createView() {
  const UserTableName = 'AppUserViews';
  let fields = [
    `${UserTableName}.appUserId`,
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
    `${UserTableName}.appUserMembershipTitle`,
    `${UserTableName}.memberReferIdF1`,
    `${UserTableName}.memberReferIdF2`,
    `${UserTableName}.memberReferIdF3`,
    `${UserTableName}.memberReferIdF4`,
    `${UserTableName}.memberReferIdF5`,

    `${rootTableName}.paymentBonusTransactionId`,
    `${rootTableName}.paymentMethodId`,
    `${rootTableName}.paymentAmount`,
    `${rootTableName}.totalReferAmount`,
    `${rootTableName}.paymentUnit`,
    `${rootTableName}.paymentStatus`,
    `${rootTableName}.paymentRef`,
    `${rootTableName}.paymentNote`,
    `${rootTableName}.paymentOwner`,
    `${rootTableName}.paymentOriginSource`,
    `${rootTableName}.paymentOriginName`,
    `${rootTableName}.paymentApproveDate`,
    `${rootTableName}.paymentPICId`,
    `${rootTableName}.balanceBefore`,
    `${rootTableName}.balanceAfter`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.referUserId`, //nguoi user duoc tham chieu de tinh hoa hong
    DB.raw(`DATE_FORMAT(${rootTableName}.createdAt, "%d-%m-%Y") as createdDate`),
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.isDeleted`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(UserTableName, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${UserTableName}.appUserId`);
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
  return await Common.sumAmountDistinctByDate(tableName, 'paymentAmount', filter, startDate, endDate);
}

async function sumAmountDistinctByStatus(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByCustomField(tableName, 'paymentAmount', 'paymentStatus', filter, startDate, endDate);
}

async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`)
        .orWhere('paymentOwner', 'like', `%${searchText}%`)
        .orWhere('paymentOriginSource', 'like', `%${searchText}%`)
        .orWhere('paymentOriginName', 'like', `%${searchText}%`);
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

async function countReferedUserByUserId(
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
  return await queryBuilder.count(`${primaryKeyField} as count`);
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
  sumAmountDistinctByStatus,
  countReferedUserByUserId,
};
