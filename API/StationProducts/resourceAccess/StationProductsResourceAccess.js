/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { PRODUCT_VIEW_STATUS } = require('../StationProductsConstants');
const tableName = 'StationProducts';
const primaryKeyField = 'stationProductsId';

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('stationProductsId').primary();
          table.integer('stationsId');
          table.string('stationProductsTitle', 1000);
          table.text('stationProductsContent', 'longtext');
          table.integer('stationProductsRating').defaultTo(5);
          table.string('stationProductsCreators');
          table.integer('stationProductsViewStatus').defaultTo(PRODUCT_VIEW_STATUS.NORMAL);
          table.string('stationProductsAvatar').defaultTo(`https://${process.env.HOST_NAME}/uploads/sample_product_avatar.png`);
          table.string('stationProductsAvatarThumbnails').defaultTo(`https://${process.env.HOST_NAME}/uploads/sample_product_thumbnail.png`);
          table.string('stationProductsCategory');
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
          table.index('stationProductsId');
          table.index('stationProductsViewStatus');
          table.index('stationProductsCategory');
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
        stationProductsTitle: `${i} Sốt salad từ chanh, dầu olive, mật ong`,
        stationProductsContent: `${i} Công thức cơ bản này vốn thay thế cho những loại dầu dấm chua ngọt làm sẵn trên thị trường. Khi trộn đều nước cốt chanh, mật ong và dầu olive ta thu được hỗn hợp có mùi thơm dịu nhẹ, chua chua ăn với salad rất ngon.
        \r\nCách làm: Khuấy đều 1 thìa canh dầu olive + 2 thìa nước cốt chanh + 1 thìa cà phê mật ong với nhau rồi rưới đều lên salad.
        \r\nVới thực đơn giảm cân 2000 calo/ngày, mỗi phần salad trung bình chỉ có 500 – 600 calo (đã bao gồm rau củ, protein và một ít chất béo tốt cho cơ thể). Thế nên ăn salad nhiều bữa trong ngày cũng không lo vượt quá chỉ tiêu của kế hoạch giảm cân.
        \r\nKhuyên dùng: Buổi sáng hằng ngày.`,
        productAttribute1: '15',
        productAttribute2: '1',
        productAttribute3: '365',
        stationProductsCategory: `${parseInt(i % 4)}`,
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
      this.orWhere('stationProductsTitle', 'like', `%${searchText}%`).orWhere('stationProductsContent', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.stationProductsTitle) {
      queryBuilder.where('stationProductsTitle', 'like', `%${filterData.stationProductsTitle}%`);
      delete filterData.stationProductsTitle;
    }
    if (filterData.stationProductsContent) {
      queryBuilder.where('stationProductsContent', 'like', `%${filterData.stationProductsContent}%`);
      delete filterData.stationProductsContent;
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

async function updateFollowCount(stationProductsId) {
  let filter = {};
  filter[primaryKeyField] = stationProductsId;
  return await DB(tableName).where(filter).increment('followCount', 1);
}

async function updateSearchCount(stationProductsId) {
  let filter = {};
  filter[primaryKeyField] = stationProductsId;
  return await DB(tableName).where(filter).increment('searchCount', 1);
}

async function addViewCount(stationProductsId) {
  let filter = {};
  filter[primaryKeyField] = stationProductsId;

  await DB(tableName).where(filter).increment('stationProductsTotalViewed', 1);
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
async function deleteById(stationProductsId) {
  let dataId = {};
  dataId[primaryKeyField] = stationProductsId;
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
