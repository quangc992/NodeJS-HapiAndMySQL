/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { GAME_RECORD_STATUS } = require('../GameRecordConstant');
const { BET_TYPE } = require('../../GamePlayRecords/GamePlayRecordsConstant');

const tableName = 'GameRecords';
const primaryKeyField = 'gameRecordId';
async function createTable() {
  console.info(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(primaryKeyField).primary();
          table.string('gameRecordValue');
          table.string('gameRecordType');
          table.string('gameRecordUnit');
          table.string('gameRecordSection').unique();
          table.string('gameRecordNote');
          table.string('gameRecordStatus').defaultTo(GAME_RECORD_STATUS.NEW);
          timestamps(table);
          table.index('gameRecordId');
          table.index('gameRecordType');
          table.index('gameRecordValue');
          table.index('gameRecordSection');
        })
        .then(async () => {
          console.info(`${tableName} table created done`);
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

async function find(filter, skip, limit, order, startDate, endDate) {
  return await Common.find(tableName, filter, skip, limit, order, startDate, endDate);
}

async function findById(id) {
  let dataId = { [primaryKeyField]: id };
  return await Common.findById(tableName, dataId, id);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

async function updateAll(filter, data) {
  return await Common.updateAll(tableName, data, filter);
}

async function increment(id, key, amount) {
  const data = await findById(id);
  let gameValue = parseInt(data[key]);
  gameValue += amount;
  await updateById(id, {
    [key]: gameValue,
  });
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  sum,
  updateAll,
  increment,
  findById,
};
