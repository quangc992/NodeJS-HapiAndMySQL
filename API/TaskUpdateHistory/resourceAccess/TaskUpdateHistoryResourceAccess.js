/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'TaskUpdateHistory';

const primaryKeyField = 'taskUpdateHistoryId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.integer('createdByStaffId').unsigned().notNullable();
          table.integer('taskId').unsigned().notNullable();
          table.string('updatedColumnName');
          table.integer('changeType'); // 10 ~ UPDATE, 20 ~ ADD, 30 ~ DELETE
          table.string('fromValue');
          table.string('toValue');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('taskId');
          table.index('createdByStaffId');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          resolve();
        });
    });
  });
}

function initDB() {
  createTable();
}

function insert(data) {
  return Common.insert(tableName, data);
}

function find(filter, skip, limit, order) {
  return Common.find(tableName, filter, skip, limit, order);
}

function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return Common.deleteById(tableName, dataId);
}

function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return Common.updateById(tableName, dataId, data);
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}

function count(filter, order) {
  return Common.count(tableName, primaryKeyField, filter, order);
}

function find(filter, skip, limit, order) {
  return Common.find(tableName, filter, skip, limit, order);
}

module.exports = {
  initDB,
  insert,
  find,
  count,
  deleteById,
  updateById,
  findById,
};
