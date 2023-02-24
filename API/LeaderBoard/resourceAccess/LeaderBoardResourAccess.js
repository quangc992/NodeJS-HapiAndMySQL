/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'LeaderBoard';
const primaryKeyField = 'appUserId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          // table.increments(`${primaryKeyField}`).primary();
          table.float('totalPlayScore', 48, 24).defaultTo(0);
          table.float('totalReferScore', 48, 24).defaultTo(0);
          table.integer('appUserId');
          table.integer('ranking').nullable().defaultTo(9999);
          table.float('totalScore ', 48, 24).defaultTo(0);
          timestamps(table);
          // table.index(`${primaryKeyField}`);
          table.unique(`appUserId`);
          table.index(`appUserId`);
        })
        .then(() => {
          console.log(`${tableName} table created done`);
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
  let filter = {};
  filter[`${primaryKeyField}`] = id;
  return await Common.updateById(tableName, filter, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

async function cleanAllData() {
  return await createTable();
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  findById,
  cleanAllData,
  modelName: tableName,
};
