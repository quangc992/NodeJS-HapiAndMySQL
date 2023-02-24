/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const UtilFunction = require('../../ApiUtils/utilFunctions');
const tableName = 'MetaData';
const primaryKeyField = 'metaDataId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('metaDataName');
          table.string('metaDataType');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('metaDataName');
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
      metaDataName: 'Sổ hồng riêng',
      metaDataType: 'LEGAL_PAPERS',
    },
    {
      metaDataName: 'Sổ hồng chung',
      metaDataType: 'LEGAL_PAPERS',
    },
    {
      metaDataName: 'Sổ đỏ',
      metaDataType: 'LEGAL_PAPERS',
    },
    {
      metaDataName: 'Giấy viết tay',
      metaDataType: 'LEGAL_PAPERS',
    },
    {
      metaDataName: 'Công chứng vi bằng',
      metaDataType: 'LEGAL_PAPERS',
    },
    {
      metaDataName: 'Chưa có sổ',
      metaDataType: 'LEGAL_PAPERS',
    },
    {
      metaDataName: 'Nội thất đầy đủ',
      metaDataType: 'FURNITURE',
    },
    {
      metaDataName: 'Không có nội thất',
      metaDataType: 'FURNITURE',
    },
    {
      metaDataName: 'Môi giới',
      metaDataType: 'AGENCY',
    },
    {
      metaDataName: 'Cá nhân',
      metaDataType: 'AGENCY',
    },
    {
      metaDataName: 'Đang hiển thị',
      metaDataType: 'STATUS',
    },
    {
      metaDataName: 'Bị từ chối',
      metaDataType: 'STATUS',
    },
    {
      metaDataName: 'Cần thanh toán',
      metaDataType: 'STATUS',
    },
    {
      metaDataName: 'Tin nháp',
      metaDataType: 'STATUS',
    },
    {
      metaDataName: 'Khác',
      metaDataType: 'STATUS',
    },
    {
      metaDataName: 'Môi giới',
      metaDataType: 'CONTACT',
    },
    {
      metaDataName: 'Chủ nhà',
      metaDataType: 'CONTACT',
    },
    {
      metaDataName: 'Bóp hậu',
      metaDataType: 'SHAPENAME',
    },
    {
      metaDataName: 'Méo mó',
      metaDataType: 'SHAPENAME',
    },
    {
      metaDataName: 'Vuông vắn',
      metaDataType: 'SHAPENAME',
    },
    {
      metaDataName: 'Nở hậu',
      metaDataType: 'SHAPENAME',
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
module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  deleteById,
  findById,
  modelName: tableName,
};
