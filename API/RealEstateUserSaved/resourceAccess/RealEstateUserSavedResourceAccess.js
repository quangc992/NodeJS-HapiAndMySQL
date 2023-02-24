/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const UtilFunction = require('../../ApiUtils/utilFunctions');
const tableName = 'RealEstateUserSaved';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.integer('appUserIdSaved');
          table.integer('realEstateId');
          table.primary(['appUserIdSaved', 'realEstateId']);
          timestamps(table);
          table.index('appUserIdSaved');
          table.index('realEstateId');
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
  let dataId = id;
  return await Common.updateById(tableName, dataId, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}
async function count(filter, order) {
  return await Common.count(tableName, 'appUserIdSaved', filter, order);
}
async function deleteById(appUserIdSaved, realEstateId) {
  let dataId = {};
  dataId['appUserIdSaved'] = appUserIdSaved;
  dataId['realEstateId'] = realEstateId;
  return await Common.deleteById(tableName, dataId);
}
async function findAllDelete(filter, skip, limit, order) {
  return await Common.findAllDelete(tableName, filter, skip, limit, order);
}
async function findById(id) {
  return await Common.findById(tableName, realEstateId, id);
}
module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  deleteById,
  modelName: tableName,
  findAllDelete,
  findById,
};
