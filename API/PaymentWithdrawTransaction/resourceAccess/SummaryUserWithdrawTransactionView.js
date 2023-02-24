/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'SummaryUserWithdrawTransactionView';
const rootTableName = 'AppUser';
const primaryKeyField = 'appUserId';
async function createUserWithdrawTransactionView() {
  const withdrawTableName = 'PaymentWithdrawTransaction';
  let fields = [
    `${rootTableName}.appUserId`,
    `${rootTableName}.sotaikhoan`,
    `${rootTableName}.tentaikhoan`,
    `${rootTableName}.tennganhang`,
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
    `${rootTableName}.isHidden`,
    `${rootTableName}.referUserId`,

    `${withdrawTableName}.paymentStatus`,
  ];

  var viewDefinition = DB.select(fields)
    .from(withdrawTableName)
    .sum('paymentAmount as totalSum')
    .count('paymentWithdrawTransactionId as totalCount')
    .groupBy(`${rootTableName}.appUserId`)
    .groupBy(`${withdrawTableName}.paymentStatus`)
    .orderBy(`${rootTableName}.appUserId`)
    .leftJoin(rootTableName, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${withdrawTableName}.appUserId`);
    });

  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createUserWithdrawTransactionView();
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
module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  sum,
};
