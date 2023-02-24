/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { PRODUCT_VIEW_STATUS } = require('../StationServicesConstants');
const tableName = 'StationServices';
const primaryKeyField = 'stationServicesId';

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('stationServicesId').primary();
          table.integer('stationsId');
          table.string('stationServicesTitle', 1000);
          table.text('stationServicesContent', 'longtext');
          table.integer('stationServicesRating').defaultTo(5);
          table.string('stationServicesCreators');
          table.integer('stationServicesViewStatus').defaultTo(PRODUCT_VIEW_STATUS.NORMAL);
          table.string('stationServicesAvatar').defaultTo(`https://${process.env.HOST_NAME}/uploads/sample_product_avatar.png`);
          table.string('stationServicesAvatarThumbnails').defaultTo(`https://${process.env.HOST_NAME}/uploads/sample_product_thumbnail.png`);
          table.string('stationServicesCategory');
          table.string('productAttribute1'); //thoi gian chuan bi
          table.string('productAttribute2'); //khau phan
          table.string('productAttribute3'); //Nang luong
          table.string('productAttribute4'); //chua su dung
          table.string('productAttribute5'); //chua su dung
          table.integer('totalViewed').defaultTo(0);
          table.integer('dayViewed').defaultTo(0);
          table.integer('monthViewed').defaultTo(0);
          table.integer('weekViewed').defaultTo(0);
          table.integer('searchCount').defaultTo(0);
          table.integer('followCount').defaultTo(0);
          timestamps(table);
          table.index('stationServicesId');
          table.index('stationServicesViewStatus');
          table.index('stationServicesCategory');
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
    let initialData = [];

    for (let i = 0; i < 30; i++) {
      initialData.push({
        stationServicesTitle: `${i} Tập thể: Tập toàn thân - Vùng Core`,
        stationServicesContent: `${i} Bài tập này thực hiện theo quy tắc tăng dần / giảm dần. Trong hiệp đầu tiên, hãy thực hiện 10 lần burpee và 1 lần hít xà đơn. Hiệp tiếp theo, bạn hãy thực hiện 9 lần burpee và 2 lần hít xà đơn. Tiếp tục lặp lại cho đến khi bạn hoàn thành 10 lần hít xà đơn và 1 lần burpee. 
        \r\nBurpees: 10-9-8-7-6-5-4-3-2-1
        \r\nHít xà đơn: 1-2-3-4-5-6-7-8-9-10
        \r\nCố gắng hạn chế thời gian nghỉ giữa mỗi hiệp.`,
        productAttribute1: '60',
        productAttribute2: 'Sức mạnh - Căn bản',
        productAttribute3: '365',
        stationServicesCategory: `${parseInt(i % 5)}`,
      });
    }

    DB(`${tableName}`)
      .insert(initialData)
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
      this.orWhere('stationServicesTitle', 'like', `%${searchText}%`).orWhere('stationServicesContent', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.stationServicesTitle) {
      queryBuilder.where('stationServicesTitle', 'like', `%${filterData.stationServicesTitle}%`);
      delete filterData.stationServicesTitle;
    }
    if (filterData.stationServicesContent) {
      queryBuilder.where('stationServicesContent', 'like', `%${filterData.stationServicesContent}%`);
      delete filterData.stationServicesContent;
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

async function updateFollowCount(stationServicesId) {
  let filter = {};
  filter[primaryKeyField] = stationServicesId;
  return await DB(tableName).where(filter).increment('followCount', 1);
}

async function updateSearchCount(stationServicesId) {
  let filter = {};
  filter[primaryKeyField] = stationServicesId;
  return await DB(tableName).where(filter).increment('searchCount', 1);
}

async function addViewCount(stationServicesId) {
  let filter = {};
  filter[primaryKeyField] = stationServicesId;

  await DB(tableName).where(filter).increment('stationServicesTotalViewed', 1);
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
async function deleteById(stationServicesId) {
  let dataId = {};
  dataId[primaryKeyField] = stationServicesId;
  return await Common.deleteById(tableName, dataId);
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
};
