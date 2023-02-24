/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const INIT_DATA = require('../script/data.json');
const tableName = 'CommonPlace';
const primaryKeyField = 'commonPlaceId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('commonPlaceName');
          table.decimal('lat', 30, 20);
          table.decimal('lng', 30, 20);
          table.integer('areaCountryId').defaultTo(1);
          table.integer('areaProvinceId');
          table.integer('areaDistrictId');
          table.integer('areaWardId');
          table.string('commonPlaceType');
          timestamps(table);
          table.index(`${primaryKeyField}`);
        })
        .then(() => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          DB(`${tableName}`)
            .insert(INIT_DATA.data)
            .then(result => {
              Logger.info(`${tableName}`, `init ${tableName}` + result);
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

  if (filterData.CommonPlaceName) {
    queryBuilder.where('CommonPlaceName', 'like', `%${filter.CommonPlaceName}%`);
    delete filterData.CommonPlaceName;
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

async function findNearPlace(AreaCityId, AreaDistrictId, lat, lng, NEAREST_LAT_LNG) {
  let data = await DB(tableName)
    .whereNot({
      areaProvinceId: AreaCityId,
      areaDistrictId: AreaDistrictId,
    })
    .where(function () {
      this.orWhere('lng', '>=', lng - NEAREST_LAT_LNG)
        .orWhere('lng', '<=', lng + NEAREST_LAT_LNG)
        .orWhere('lat', '<=', lat + NEAREST_LAT_LNG)
        .orWhere('lat', '>=', lat - NEAREST_LAT_LNG);
    })
    .select();
  return data;
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  customSearch,
  customCount,
  findNearPlace,
};
