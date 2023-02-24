/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'AppUserRecordView';
const rootTableName = 'AppUserRecord';
const primaryKeyField = 'appUserRecordId';

async function createStationView() {
  const UserStationTableName = 'UserStationsView';
  let fields = [
    `${rootTableName}.appUserRecordId`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.startWork`,
    `${rootTableName}.finishWork`,
    `${rootTableName}.workDate`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,

    `${UserStationTableName}.username`,
    `${UserStationTableName}.firstName`,
    `${UserStationTableName}.phoneNumber`,
    `${UserStationTableName}.email`,
    `${UserStationTableName}.userHomeAddress`,
    `${UserStationTableName}.birthDay`,
    `${UserStationTableName}.sex`,
    `${UserStationTableName}.active`,
    `${UserStationTableName}.identityNumber`,
    `${UserStationTableName}.dateStartWork`,
    `${UserStationTableName}.licenseNumber`,
    `${UserStationTableName}.licenseValidDate`,
    `${UserStationTableName}.licenseExpirationDate`,
    `${UserStationTableName}.licenseStatus`,
    `${UserStationTableName}.stationsId`,
    `${UserStationTableName}.stationsName`,
    `${UserStationTableName}.stationUrl`,
    `${UserStationTableName}.stationsHotline`,
    `${UserStationTableName}.stationsAddress`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(UserStationTableName, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${UserStationTableName}.appUserId`);
    });

  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createStationView();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  return await Common.updateById(tableName, { appUserRecordId: id }, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function findById(id) {
  return await Common.findById(tableName, primaryKeyField, id);
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

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('stationsName', 'like', `%${searchText}%`).orWhere('firstName', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (startDate) {
    queryBuilder.where('startWork', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('finishWork', '<=', endDate);
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
  findById,
};
