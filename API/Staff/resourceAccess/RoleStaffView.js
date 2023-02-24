/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'RoleStaffView';
const rootTableName = 'Staff';
const primaryKeyField = 'staffId';

async function createRoleStaffView() {
  const RoleTableName = 'StaffRole';
  let fields = [
    `${rootTableName}.staffId`,
    `${rootTableName}.staffRoleId`,
    `${rootTableName}.username`,
    `${rootTableName}.firstName`,
    `${rootTableName}.lastName`,
    `${rootTableName}.email`,
    `${rootTableName}.password`,
    `${rootTableName}.active`,
    `${rootTableName}.ipAddress`,
    `${rootTableName}.phoneNumber`,
    `${rootTableName}.lastActiveAt`,
    `${rootTableName}.twoFACode`,
    `${rootTableName}.telegramId`,
    `${rootTableName}.facebookId`,
    `${rootTableName}.appleId`,
    `${rootTableName}.stationsId`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.staffAvatar`,
    `${rootTableName}.staffToken`,

    `${RoleTableName}.permissions`,
    `${RoleTableName}.staffRoleName`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(RoleTableName, function () {
      this.on(`${rootTableName}.staffRoleId`, '=', `${RoleTableName}.staffRoleId`);
    });

  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createRoleStaffView();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  return await Common.updateById(tableName, { staffId: id }, data);
}

/**WARNING !!! Only use this function with super admin. user customSearch() instead  */
async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (filterData.username) {
    queryBuilder.where('username', 'like', `%${filterData.username}%`);
    delete filterData.username;
  }

  if (filterData.lastName) {
    queryBuilder.where('lastName', 'like', `%${filterData.lastName}%`);
    delete filterData.lastName;
  }

  if (filterData.firstName) {
    queryBuilder.where('firstName', 'like', `%${filterData.firstName}%`);
    delete filterData.firstName;
  }

  if (filterData.email) {
    queryBuilder.where('email', 'like', `%${filterData.email}%`);
    delete filterData.email;
  }

  if (filterData.phoneNumber) {
    queryBuilder.where('phoneNumber', 'like', `%${filterData.phoneNumber}%`);
    delete filterData.phoneNumber;
  }

  queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

  queryBuilder.where('staffRoleId', '<>', 1);
  queryBuilder.where('staffId', '<>', 1);

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

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  updateAll,
  customSearch,
  customCount,
};
