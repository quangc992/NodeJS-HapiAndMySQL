/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const UtilFunction = require('../../ApiUtils/utilFunctions');
const tableName = 'RealEstateSubCategory';
const primaryKeyField = 'realEstateSubCategoryId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('realEstateSubCategoryName').unique();
          table.integer('realEstateCategoryId');
          table.integer('weekViews').defaultTo(0);
          table.integer('dayViews').defaultTo(0);
          table.integer('monthViews').defaultTo(0);
          table.integer('yearViews').defaultTo(0);
          table.integer('totalViews').defaultTo(0);
          timestamps(table);
          table.index(`${primaryKeyField}`);
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          resolve();
        });
    });
  });
}
function __getDefaultFeild() {
  const defaultFeild = [
    {
      realEstateSubCategoryName: 'Bán nhà biệt thự,liền kề',
      realEstateCategoryId: 1,
    },
    {
      realEstateSubCategoryName: 'Bán nhà mặt phố',
      realEstateCategoryId: 1,
    },
    {
      realEstateSubCategoryName: 'Bán nhà hẻm',
      realEstateCategoryId: 1,
    },
    {
      realEstateSubCategoryName: 'Bán chung cư',
      realEstateCategoryId: 2,
    },
    {
      realEstateSubCategoryName: 'Bán Duplex',
      realEstateCategoryId: 2,
    },
    {
      realEstateSubCategoryName: 'Bán Penhouse',
      realEstateCategoryId: 2,
    },
    {
      realEstateSubCategoryName: 'Bán căn hộ dịch vụ, mini',
      realEstateCategoryId: 2,
    },
    {
      realEstateSubCategoryName: 'Bán tập thể, cư xá',
      realEstateCategoryId: 2,
    },
    {
      realEstateSubCategoryName: 'Bán Officetel',
      realEstateCategoryId: 2,
    },
    {
      realEstateSubCategoryName: 'Bán Condotel',
      realEstateCategoryId: 2,
    },
    {
      realEstateSubCategoryName: 'Bán đất nền dự án',
      realEstateCategoryId: 3,
    },
    {
      realEstateSubCategoryName: 'Bán đất thổ cư',
      realEstateCategoryId: 3,
    },
    {
      realEstateSubCategoryName: 'Bán đất công nghiệp',
      realEstateCategoryId: 3,
    },
    {
      realEstateSubCategoryName: 'Bán đất nông nghiệp',
      realEstateCategoryId: 3,
    },
    {
      realEstateSubCategoryName: 'Bán trang trại, khu nghĩ dưỡng',
      realEstateCategoryId: 4,
    },
    {
      realEstateSubCategoryName: 'Bán nhà xưởng',
      realEstateCategoryId: 4,
    },
    {
      realEstateSubCategoryName: 'Bán bất động sản khác',
      realEstateCategoryId: 4,
    },
    {
      realEstateSubCategoryName: 'Cho thuê nhà biệt thự,liền kề',
      realEstateCategoryId: 5,
    },
    {
      realEstateSubCategoryName: 'Cho thuê nhà mặt phố',
      realEstateCategoryId: 5,
    },
    {
      realEstateSubCategoryName: 'Cho thuê nhà hẻm',
      realEstateCategoryId: 5,
    },
    {
      realEstateSubCategoryName: 'Cho thuê Condotel',
      realEstateCategoryId: 6,
    },
    {
      realEstateSubCategoryName: 'Cho thuê Chung cư',
      realEstateCategoryId: 6,
    },
    {
      realEstateSubCategoryName: 'Cho thuê Duplex',
      realEstateCategoryId: 6,
    },
    {
      realEstateSubCategoryName: 'Cho thuê Penhouse',
      realEstateCategoryId: 6,
    },
    {
      realEstateSubCategoryName: 'Cho thuê căn hộ dịch vụ, mini',
      realEstateCategoryId: 6,
    },
    {
      realEstateSubCategoryName: 'Cho thuê tập thể, cư xá',
      realEstateCategoryId: 6,
    },
    {
      realEstateSubCategoryName: 'Cho thuê Officetel',
      realEstateCategoryId: 6,
    },
    {
      realEstateSubCategoryName: 'Cho thuê đất nền dự án',
      realEstateCategoryId: 7,
    },
    {
      realEstateSubCategoryName: 'Cho thuê đất thổ cư',
      realEstateCategoryId: 7,
    },
    {
      realEstateSubCategoryName: 'Cho thuê đất công nghiệp',
      realEstateCategoryId: 7,
    },
    {
      realEstateSubCategoryName: 'Cho thuê đất nông nghiệp',
      realEstateCategoryId: 7,
    },
    {
      realEstateSubCategoryName: 'Cho thuê mặt bằng kinh doanh',
      realEstateCategoryId: 8,
    },
    {
      realEstateSubCategoryName: 'Cho thuê văn phòng',
      realEstateCategoryId: 8,
    },
    {
      realEstateSubCategoryName: 'Cho thuê shop house',
      realEstateCategoryId: 8,
    },
    {
      realEstateSubCategoryName: 'Cho thuê phòng trọ',
      realEstateCategoryId: 9,
    },
  ];
  return defaultFeild;
}
async function initDB() {
  await createTable();
  const data = __getDefaultFeild();
  for (var i = 0; i < data.length; i++) {
    await Common.insert(tableName, data[i]);
  }
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
async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}

async function incrementView(id) {
  await Common.increment(tableName, primaryKeyField, id, 'dayViews', 1);
  await Common.increment(tableName, primaryKeyField, id, 'weekViews', 1);
  await Common.increment(tableName, primaryKeyField, id, 'monthViews', 1);
  await Common.increment(tableName, primaryKeyField, id, 'yearViews', 1);
  return await Common.increment(tableName, primaryKeyField, id, 'totalViews', 1);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  deleteById,
  findById,
  incrementView,
  modelName: tableName,
};
