/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const moment = require('moment');
const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { SCHEDULE_STATUS } = require('../CustomerScheduleConstants');
const tableName = 'CustomerSchedule';

const primaryKeyField = 'customerScheduleId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('customerScheduleId').primary();
          table.string('customerIdentity');
          table.string('customerPhone');
          table.string('customerName');
          table.string('customerEmail');
          table.string('customerScheduleDate');
          table.string('customerScheduleTime');
          table.string('customerScheduleAddress', 500);
          table.string('customerScheduleNote');
          table.string('customerScheduleStatus').defaultTo(SCHEDULE_STATUS.NEW);
          table.integer('stationsId');
          table.integer('appUserId');
          table.integer('staffId');
          table.integer('agencyId');
          table.integer('stationServicesId');
          table.integer('stationProductsId');
          table.integer('scheduleRefId'); //lien ket den id cua paymentpackage
          table.string('scheduleCode');
          timestamps(table);
          table.index('customerEmail');
          table.index('customerPhone');
          table.index('customerIdentity');
          table.index('customerScheduleDate');
          table.index('customerScheduleStatus');
          table.index('stationsId');
          table.index('appUserId');
          table.index('staffId');
          table.index('agencyId');
          table.index('stationServicesId');
          table.index('stationProductsId');
          table.index('scheduleRefId');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          resolve();
        });
    });
  });
}

async function initDB() {
  await createTable();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(customerScheduleId, data) {
  let dataId = {};
  dataId[primaryKeyField] = customerScheduleId;
  return await Common.updateById(tableName, dataId, data);
}
async function deleteById(customerScheduleId) {
  let dataId = {};
  dataId[primaryKeyField] = customerScheduleId;
  return await Common.deleteById(tableName, dataId);
}

async function findById(id) {
  return await Common.findById(tableName, primaryKeyField, id);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
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
  initDB,
  modelName: tableName,
  customSearch,
  customCount,
  deleteById,
};
