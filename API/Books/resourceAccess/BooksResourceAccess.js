/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'Books';
const primaryKeyField = 'booksId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('booksId').primary();
          table.string('booksName');
          table.integer('booksRating').defaultTo(5);
          table.string('booksCreators');
          table.integer('booksStatus').defaultTo(0);
          table.integer('booksUpdateStatus').defaultTo(0);
          table.integer('booksTotalChapter').defaultTo(0);
          table.integer('booksTotalViewed').defaultTo(0);
          table.string('booksError');
          table.string('booksTagCloud', 2000);
          table.string('booksCategories');
          table.integer('booksViewedStatus');
          table.integer('dayViewed').defaultTo(0);
          table.integer('monthViewed').defaultTo(0);
          table.integer('weekViewed').defaultTo(0);
          table.integer('searchCount').defaultTo(0);
          table.integer('followCount').defaultTo(0);
          table.integer('booksCrawlingStatus').defaultTo(1); // no need to crawl
          table.string('booksUrl').unique().notNullable();
          table.string('booksAvatar');
          table.string('booksOriginUrl'); // support for crawling
          table.timestamp('booksUpdatedAt').defaultTo(DB.fn.now());
          timestamps(table);
          table.index('booksId');
          table.index('booksStatus');
          table.index('booksName');
          table.index('booksCategories');
          table.index('booksUrl');
          table.index('booksOriginUrl');
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

function _makeQueryBuilderByFilter(filter, skip, limit, order) {
  let queryBuilder = DB(tableName);
  let filterData = JSON.parse(JSON.stringify(filter));

  if (filterData.booksCategories) {
    queryBuilder.where('booksCategories', 'like', `%${filterData.booksCategories}%`);
    delete filterData.booksCategories;
  }

  if (filterData.booksName) {
    queryBuilder.where('booksName', 'like', `%${filterData.booksName}%`);
    delete filterData.booksName;
  }

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
    queryBuilder.orderBy('booksUpdatedAt', 'desc');
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

async function updateFollowCount(booksId) {
  let filter = {};
  filter[primaryKeyField] = booksId;
  return await DB(tableName).where(filter).increment('followCount', 1);
}

async function updateSearchCount(booksId) {
  let filter = {};
  filter[primaryKeyField] = booksId;
  return await DB(tableName).where(filter).increment('searchCount', 1);
}

async function addViewCount(booksId) {
  let filter = {};
  filter[primaryKeyField] = booksId;

  await DB(tableName).where(filter).increment('booksTotalViewed', 1);
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
};
