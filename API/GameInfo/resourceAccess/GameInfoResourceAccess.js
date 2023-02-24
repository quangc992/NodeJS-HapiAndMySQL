/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'GameInfo';
const primaryKeyField = 'gameInfoId';
async function createTable() {
  console.info(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(primaryKeyField).primary();
          table.string('gameName');
          table.string('gameLogoUrl');
          table.string('gameBannerUrl');
          timestamps(table);
          table.index('gameInfoId');
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
