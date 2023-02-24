/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'Camera';

const primaryKeyField = 'cameraId';

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(primaryKeyField).primary();
          table.string('cameraModel');
          table.string('cameraSeriesNumber');
          table.string('cameraProtocol');
          table.integer('cameraStatus'); // 0: off, 1: on
          table.string('cameraWebhookUrl');
          table.string('cameraInOut');
          table.string('cameraIP');
          table.string('cameraPort');
          table.string('cameraPath');
          table.string('cameraUserName');
          table.string('cameraName'); // tên định danh camera
          table.string('cameraPassword');
          table.string('thumbnails');
          table.text('cameraCanvas', 'longtext').nullable();
          table.integer('cameraStationsId');
          timestamps(table);
          table.index(primaryKeyField);
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

async function updateById(cameraId, data) {
  let dataId = {};
  dataId[primaryKeyField] = cameraId;
  return await Common.updateById(tableName, dataId, data);
}
async function deleteById(cameraId) {
  let dataId = {};
  dataId[primaryKeyField] = cameraId;
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
      this.orWhere('cameraUserName', 'like', `%${searchText}%`)
        .orWhere('cameraModel', 'like', `%${searchText}%`)
        .orWhere('cameraSeriesNumber', 'like', `%${searchText}%`)
        .orWhere('cameraName', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.cameraUserName) {
      queryBuilder.where('cameraUserName', 'like', `%${filterData.cameraUserName}%`);
      delete filterData.cameraUserName;
    }

    if (filterData.cameraName) {
      queryBuilder.where('cameraName', 'like', `%${filterData.cameraName}%`);
      delete filterData.cameraName;
    }

    if (filterData.cameraModel) {
      queryBuilder.where('cameraModel', 'like', `%${filterData.cameraModel}%`);
      delete filterData.cameraModel;
    }

    if (filterData.cameraSeriesNumber) {
      queryBuilder.where('cameraSeriesNumber', 'like', `%${filterData.cameraSeriesNumber}%`);
      delete filterData.cameraSeriesNumber;
    }
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

async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}
async function customCount(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return new Promise((resolve, reject) => {
    try {
      query.count(`${primaryKeyField} as count`).then(records => {
        resolve(records[0].count);
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
