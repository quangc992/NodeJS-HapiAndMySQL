/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'RoleUserView';
const rootTableName = 'AppUser';
const primaryKeyField = 'appUserId';

async function createRoleStaffView() {
  const RoleTableName = 'AppUserRole';
  let fields = [
    `${rootTableName}.appUserId`,
    `${rootTableName}.appUserRoleId`,
    `${rootTableName}.username`,
    `${rootTableName}.firstName`,
    `${rootTableName}.lastName`,
    `${rootTableName}.companyName`,
    `${rootTableName}.email`,
    `${rootTableName}.password`,
    `${rootTableName}.active`,
    `${rootTableName}.phoneNumber`,
    `${rootTableName}.lastActiveAt`,
    `${rootTableName}.twoFACode`,
    `${rootTableName}.twoFAQR`,
    `${rootTableName}.twoFAEnable`,
    `${rootTableName}.userAvatar`,
    `${rootTableName}.stationsId`,
    `${rootTableName}.socialInfo`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.appUserNote`,

    `${rootTableName}.diachiviUSDT`, // su dung tam
    `${rootTableName}.diachiviBTC`, //su dung tam

    `${RoleTableName}.appUserRoleName`,
    `${RoleTableName}.permissions`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(RoleTableName, function () {
      this.on(`${rootTableName}.appUserRoleId`, '=', `${RoleTableName}.appUserRoleId`);
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
  return await Common.updateById(tableName, { appUserId: id }, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

function _makeQueryBuilderByFilter(filter, skip, limit, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

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
async function customSearch(filter, skip, limit, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, searchText, order);
  return await query.select();
}
async function customCount(filter, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, searchText, order);
  return new Promise((resolve, reject) => {
    try {
      query.count(`${primaryKeyField} as count`).then(records => {
        resolve(records);
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)} - ${JSON.stringify(order)}`);
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
  updateAll,
  customSearch,
  customCount,
};
