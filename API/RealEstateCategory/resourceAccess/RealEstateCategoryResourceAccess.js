/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const UtilFunction = require('../../ApiUtils/utilFunctions');
const tableName = 'RealEstateCategory';
const primaryKeyField = 'realEstateCategoryId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('realEstateCategoryName').unique();
          table.integer('realEstatePostTypeId');
          table.integer('weekViews').defaultTo(0);
          table.integer('dayViews').defaultTo(0);
          table.integer('monthViews').defaultTo(0);
          table.integer('yearViews').defaultTo(0);
          table.integer('totalViews').defaultTo(0);
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('realEstateCategoryName');
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
      realEstateCategoryName: 'Bán nhà riêng',
      realEstatePostTypeId: 1,
    },
    {
      realEstateCategoryName: 'Bán căn hộ chung cư',
      realEstatePostTypeId: 1,
    },
    {
      realEstateCategoryName: 'Bán đất',
      realEstatePostTypeId: 1,
    },
    {
      realEstateCategoryName: 'Bán bất động sản khác',
      realEstatePostTypeId: 1,
    },
    {
      realEstateCategoryName: 'Cho thuê nhà riêng',
      realEstatePostTypeId: 2,
    },
    {
      realEstateCategoryName: 'Cho thuê căn hộ chung cư',
      realEstatePostTypeId: 2,
    },
    {
      realEstateCategoryName: 'Cho thuê đất',
      realEstatePostTypeId: 2,
    },
    {
      realEstateCategoryName: 'Cho văn phòng, mặt bằng kinh doanh',
      realEstatePostTypeId: 2,
    },
    {
      realEstateCategoryName: 'Cho thuê phòng trọ',
      realEstatePostTypeId: 2,
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
async function incrementView(id) {
  await Common.increment(tableName, primaryKeyField, id, 'dayViews', 1);
  await Common.increment(tableName, primaryKeyField, id, 'weekViews', 1);
  await Common.increment(tableName, primaryKeyField, id, 'monthViews', 1);
  await Common.increment(tableName, primaryKeyField, id, 'yearViews', 1);
  return await Common.increment(tableName, primaryKeyField, id, 'totalViews', 1);
}
async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
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
