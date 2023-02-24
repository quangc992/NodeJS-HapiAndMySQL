/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'AreaData';
const primaryKeyField = 'areaDataId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('areaDataName');
          table.string('areaDataType');
          table.integer('areaParentId');
          table.integer('weekViews').defaultTo(0);
          table.integer('dayViews').defaultTo(0);
          table.integer('monthViews').defaultTo(0);
          table.integer('yearViews').defaultTo(0);
          table.integer('totalViews').defaultTo(0);
          timestamps(table);
          table.index(`${primaryKeyField}`);
        })
        .then(() => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          let initCountry = [
            {
              areaDataName: 'Việt Nam',
              areaDataType: 'COUNTRY',
              areaParentId: 0,
            },
          ];
          DB(`${tableName}`)
            .insert(initCountry)
            .then(result => {
              Logger.info(`${tableName}`, `init $ {tableName}` + result);
              resolve();
            });
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

function _makeQueryBuilderByFilter(filter, skip, limit, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (filterData.areaDataName) {
    queryBuilder.where('areaDataName', 'like', `%${filter.areaDataName}%`);
    delete filterData.areaDataName;
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

async function customSearch(filter, skip, limit, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, order);
  return await query.select();
}

async function customCount(filter, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, order);
  return await query.count(`${primaryKeyField} as count`);
}
async function incrementView(id) {
  await Common.increment(tableName, primaryKeyField, id, 'dayViews', 1);
  await Common.increment(tableName, primaryKeyField, id, 'weekViews', 1);
  await Common.increment(tableName, primaryKeyField, id, 'monthViews', 1);
  await Common.increment(tableName, primaryKeyField, id, 'yearViews', 1);
  return await Common.increment(tableName, primaryKeyField, id, 'totalViews', 1);
}
async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  customSearch,
  customCount,
  incrementView,
  sum,
};
