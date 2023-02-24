/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'LeaderBoardViews';
const rootTableName = 'LeaderBoard';
const primaryKeyField = 'appUserId';

const UserTableName = 'AppUserViews';

async function createView() {
  let fields = [
    // `${rootTableName}.${primaryKeyField}`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.totalPlayScore`,
    `${rootTableName}.totalReferScore`,
    `${rootTableName}.totalScore`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.ranking`,

    `${UserTableName}.sotaikhoan`,
    `${UserTableName}.tentaikhoan`,
    `${UserTableName}.tennganhang`,
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
    `${UserTableName}.referUserId`,
    `${UserTableName}.userAvatar`,
    `${UserTableName}.companyName`,

    `${UserTableName}.appUserMembershipTitle`,
    `${UserTableName}.appUsermembershipId`,
    `${UserTableName}.memberReferIdF1`,
    `${UserTableName}.memberReferIdF2`,
    `${UserTableName}.memberReferIdF3`,
    `${UserTableName}.memberReferIdF4`,
    `${UserTableName}.memberReferIdF5`,
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

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, startRanKing, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  if (filterData.username) {
    queryBuilder.where('username', 'like', `%${filterData.username}%`);
    delete filterData.username;
  }
  if (filterData.firstName) {
    queryBuilder.where('firstName', 'like', `%${filterData.firstName}%`);
    delete filterData.firstName;
  }
  if (filterData.phoneNumber) {
    queryBuilder.where('phoneNumber', 'like', `%${filterData.phoneNumber}%`);
    delete filterData.phoneNumber;
  }
  if (filterData.email) {
    queryBuilder.where('email', 'like', `%${filterData.email}%`);
    delete filterData.email;
  }
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }
  if (startRanKing) {
    queryBuilder.where('ranking', '>=', startRanKing);
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

async function customSearch(filter, skip, limit, startDate, endDate, startRanKing, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, startRanKing, order);
  return await query.select();
}

async function customCount(filter, startDate, endDate, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
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
  findById,
};
