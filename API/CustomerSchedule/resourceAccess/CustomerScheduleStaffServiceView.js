/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const moment = require('moment');

const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'CustomerScheduleStaffServiceView';

const rootTableName = 'CustomerSchedule';
const primaryKeyField = 'customerScheduleId';
async function createUserDepositTransactionView() {
  const staffTable = 'Staff';
  const ServicePackageUserViews = 'ServicePackageUserViews';

  let fields = [
    `${rootTableName}.${primaryKeyField}`,
    `${rootTableName}.customerIdentity`,
    `${rootTableName}.customerPhone`,
    `${rootTableName}.customerName`,
    `${rootTableName}.customerEmail`,
    `${rootTableName}.customerScheduleDate`,
    `${rootTableName}.customerScheduleTime`,
    `${rootTableName}.customerScheduleAddress`,
    `${rootTableName}.customerScheduleNote`,
    `${rootTableName}.customerScheduleStatus`,
    `${rootTableName}.stationsId`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.staffId`,
    `${rootTableName}.agencyId`,
    `${rootTableName}.stationServicesId`,
    `${rootTableName}.stationProductsId`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.scheduleRefId`,
    `${rootTableName}.scheduleCode`,

    `${staffTable}.firstName`, //ho va ten PT
    `${staffTable}.lastName`, //ho va ten PT
    `${staffTable}.staffAvatar`, //avatar cua PT

    `${ServicePackageUserViews}.packageName`, //<< Tên gói tap
    `${ServicePackageUserViews}.packageType`, //<< Loai goi tap
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(staffTable, function () {
      this.on(`${rootTableName}.agencyId`, '=', `${staffTable}.staffId`);
    })
    .leftJoin(servicePackageTable, function () {
      this.on(`${rootTableName}.scheduleRefId`, '=', `${ServicePackageUserViews}.paymentServicePackageUserId`);
    });
  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createUserDepositTransactionView();
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
async function findById(id) {
  return await Common.findById(tableName, primaryKeyField, id);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('customerIdentity', 'like', `%${searchText}%`)
        .orWhere('customerPhone', 'like', `%${searchText}%`)
        .orWhere('customerEmail', 'like', `%${searchText}%`)
        .orWhere('customerName', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.customerName) {
      queryBuilder.where('customerName', 'like', `%${filterData.customerName}%`);
      delete filterData.customerName;
    }

    if (filterData.customerEmail) {
      queryBuilder.where('customerEmail', 'like', `%${filterData.customerEmail}%`);
      delete filterData.customerEmail;
    }

    if (filterData.customerPhone) {
      queryBuilder.where('customerPhone', 'like', `%${filterData.customerPhone}%`);
      delete filterData.customerPhone;
    }

    if (filterData.customerIdentity) {
      queryBuilder.where('customerIdentity', 'like', `%${filterData.customerIdentity}%`);
      delete filterData.customerIdentity;
    }
  }

  if (startDate) {
    let _startDate = moment(startDate).format('YYYY/MM/DD');
    // let _startTime = moment(startDate).format("HH:mm");
    queryBuilder.where('customerScheduleDate', '>=', _startDate);
    // queryBuilder.where('customerScheduleTime', '>=', _startTime)
  }

  if (endDate) {
    let _endDate = moment(endDate).format('YYYY/MM/DD');
    // let _endTime = moment(endDate).format("HH:mm");
    queryBuilder.where('customerScheduleDate', '<=', _endDate);
    // queryBuilder.where('customerScheduleTime', '<=', _endTime)
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
async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
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
  findById,
  count,
  updateById,
  initViews,
  sum,
  customSearch,
  customCount,
  modelName: tableName,
};
