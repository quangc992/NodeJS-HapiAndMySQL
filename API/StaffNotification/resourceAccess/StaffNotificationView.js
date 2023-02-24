/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { DB } = require('../../../config/database');
const tableName = 'StaffNotificationView';
const rootTableName = 'StaffNotification';
const primaryKeyField = 'staffNotificationId';

async function createStaffNotifycationView() {
  const StationTableName = 'Stations';
  const fields = [
    `${rootTableName}.staffNotificationId`,
    `${rootTableName}.notificationSendStatus`,
    `${rootTableName}.notificationMethod`,
    `${rootTableName}.notificationTopic`,
    `${rootTableName}.notificationType`,
    `${rootTableName}.receiverType`,
    `${rootTableName}.receiverId`,
    `${rootTableName}.stationsId`,
    `${rootTableName}.staffTaskId`,
    `${rootTableName}.isRead`,
    `${rootTableName}.notificationImage`,
    `${rootTableName}.notificationNote`,
    `${rootTableName}.notificationTitle`,
    `${rootTableName}.notificationContent`,
    `${rootTableName}.groupStaffNotificationId`,

    `${rootTableName}.updatedAt`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.isDeleted`,

    `${StationTableName}.stationsName`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(StationTableName, function () {
      this.on(`${rootTableName}.stationsId`, '=', `${StationTableName}.stationsId`);
    });

  await Common.createOrReplaceView(tableName, viewDefinition);
}

function initViews() {
  createStaffNotifycationView();
}

function find(filter, skip, limit, order) {
  return Common.find(tableName, filter, skip, limit, order);
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('notificationMethod', 'like', `%${searchText}%`)
        .orWhere('notificationTitle', 'like', `%${searchText}%`)
        .orWhere('notificationContent', 'like', `%${searchText}%`);
    });
  }

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

module.exports = {
  initViews,
  find,
  findById,
  customSearch,
};
