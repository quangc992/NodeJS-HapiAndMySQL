/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'StaffTaskMapping';
const primaryKeyField = 'staffTaskMappingId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.integer('staffId').unsigned().notNullable();
          table.integer('taskId').unsigned().notNullable();
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('staffId');
          table.index('taskId');
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

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, skip, limit, order) {
  return await Common.count(tableName, filter, skip, limit, order);
}

async function deleteByFilter(filter) {
  return await Common.deleteById(tableName, filter);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}
module.exports = {
  insert,
  find,
  count,
  initDB,
  deleteByFilter,
  updateById,
  updateAll,
  findById,
};
