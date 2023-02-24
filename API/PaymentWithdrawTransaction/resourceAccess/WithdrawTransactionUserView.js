/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'WithdrawTransactionUserView';
const rootTableName = 'PaymentWithdrawTransaction';
const primaryKeyField = 'paymentWithdrawTransactionId';
async function createView() {
  const WalletTableName = 'Wallet';
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
    `${UserTableName}.diachiviUSDT`,
    `${UserTableName}.diachiviBTC`,
    `${UserTableName}.sotaikhoan`,
    `${UserTableName}.tentaikhoan`,
    `${UserTableName}.tennganhang`,

    `${primaryKeyField}`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.walletId`,
    DB.raw(`DATE_FORMAT(${rootTableName}.createdAt, "%d-%m-%Y") as createdDate`),
    // 'paymentMethodId',
    'paymentAmount',
    // 'paymentRewardAmount',
    // 'paymentUnit',
    `${rootTableName}.paymentStatus`,
    `${rootTableName}.paymentNote`,
    `${rootTableName}.paymentRef`,
    `${rootTableName}.paymentRefAmount`,
    `${rootTableName}.paymentApproveDate`,
    `${rootTableName}.paymentPICId`,
    `${rootTableName}.paymentOwner`,
    `${rootTableName}.paymentOriginSource`,
    `${rootTableName}.paymentOriginName`,
    `${rootTableName}.paymentFeeAmount`,

    `${WalletTableName}.walletType`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(UserTableName, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${UserTableName}.appUserId`);
    })
    .leftJoin(WalletTableName, function () {
      this.on(`${rootTableName}.walletId`, '=', `${WalletTableName}.walletId`);
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
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.sum(`${sumField} as sumResult`);
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
  sumAmountDistinctByDate,
  customSum,
};
