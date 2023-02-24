/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'StationServicesCategory';
const primaryKeyField = 'stationServicesCategoryId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('stationServicesCategoryId').primary();
          table.integer('stationsId');
          table.string('stationServicesCategoryTitle');
          table.string('stationServicesCategoryContent', 500);
          table.string('stationServicesCategoryAvatar');
          table.integer('displayIndex').defaultTo(0);
          table.integer('totalViewed').defaultTo(0);
          table.integer('dayViewed').defaultTo(0);
          table.integer('monthViewed').defaultTo(0);
          table.integer('weekViewed').defaultTo(0);
          table.integer('searchCount').defaultTo(0);
          table.integer('followCount').defaultTo(0);
          timestamps(table);
          table.index('stationServicesCategoryId');
          table.index('displayIndex');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(result => {
            Logger.info(`${tableName}`, `init ${tableName}` + result);
            resolve();
          });
        });
    });
  });
}

async function initDB() {
  await createTable();
}

async function seeding() {
  return new Promise(async (resolve, reject) => {
    let initialStaff = [
      {
        stationServicesCategoryTitle: 'Gym',
        stationServicesCategoryContent: 'Gym',
        displayIndex: 0,
      },
      {
        stationServicesCategoryTitle: 'Yoga',
        stationServicesCategoryContent: 'Yoga',
        displayIndex: 1,
      },
      {
        stationServicesCategoryTitle: 'Cardio',
        stationServicesCategoryContent: 'Cardio',
        displayIndex: 2,
      },
      {
        stationServicesCategoryTitle: 'Tập máy',
        stationServicesCategoryContent: 'Tập máy',
        displayIndex: 3,
      },
      {
        stationServicesCategoryTitle: 'Body combat',
        stationServicesCategoryContent: 'Body combat',
        displayIndex: 3,
      },
    ];
    DB(`${tableName}`)
      .insert(initialStaff)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName}` + result);
        resolve();
      });
  });
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;

  return await Common.updateById(tableName, dataId, data);
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
  let filterData = JSON.parse(JSON.stringify(filter));
  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('stationServicesCategoryTitle', 'like', `%${searchText}%`).orWhere('stationServicesCategoryContent', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.stationServicesCategoryTitle) {
      queryBuilder.where('stationServicesCategoryTitle', 'like', `%${filterData.stationServicesCategoryTitle}%`);
      delete filterData.stationServicesCategoryTitle;
    }
    if (filterData.stationServicesCategoryContent) {
      queryBuilder.where('stationServicesCategoryContent', 'like', `%${filterData.stationServicesCategoryContent}%`);
      delete filterData.stationServicesCategoryContent;
    }
  }
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where(filterData);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  queryBuilder.where({ isDeleted: 0 });

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

async function updateFollowCount(stationServicesCategoryId) {
  let filter = {};
  filter[primaryKeyField] = stationServicesCategoryId;
  return await DB(tableName).where(filter).increment('followCount', 1);
}

async function updateSearchCount(stationServicesCategoryId) {
  let filter = {};
  filter[primaryKeyField] = stationServicesCategoryId;
  return await DB(tableName).where(filter).increment('searchCount', 1);
}

async function addViewCount(stationServicesCategoryId) {
  let filter = {};
  filter[primaryKeyField] = stationServicesCategoryId;

  await DB(tableName).where(filter).increment('stationServicesCategoryTotalViewed', 1);
  await DB(tableName).where(filter).increment('dayViewed', 1);
  await DB(tableName).where(filter).increment('monthViewed', 1);
  await DB(tableName).where(filter).increment('weekViewed', 1);

  return 1;
}

async function resetDayViewedCount() {
  return await DB(tableName).update({ dayViewed: 0 });
}

async function resetMonthViewedCount() {
  return await DB(tableName).update({ monthViewed: 0 });
}

async function resetWeekViewedCount() {
  return await DB(tableName).update({ weekViewed: 0 });
}

async function deleteById(stationServicesCategoryId) {
  let dataId = {};
  dataId[primaryKeyField] = stationServicesCategoryId;
  return await Common.deleteById(tableName, dataId);
}

async function increaseDisplayIndex(stationServicesCategoryId) {
  let filter = {};
  filter[primaryKeyField] = stationServicesCategoryId;
  return await DB(tableName).where(filter).increment('displayIndex', 1);
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
  resetWeekViewedCount,
  resetMonthViewedCount,
  resetDayViewedCount,
  updateFollowCount,
  updateSearchCount,
  addViewCount,
  deleteById,
  increaseDisplayIndex,
};
