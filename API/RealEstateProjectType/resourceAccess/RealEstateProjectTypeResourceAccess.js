/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'RealEstateProjectType';
const primaryKeyField = 'projectTypeId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('projectTypeName');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('projectTypeName');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(() => {
            resolve();
          });
        });
    });
  });
}

async function seeding() {
  let projectTypes = [
    { projectTypeName: 'Chung cư' },
    { projectTypeName: 'Condotel' },
    { projectTypeName: 'Biệt thự & Shophouse' },
    { projectTypeName: 'Đất nền dự án' },
    { projectTypeName: 'Khác' },
  ];
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`)
      .insert(projectTypes)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName} ` + result);
        resolve();
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

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}
async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}
async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  deleteById,
  findById,
  initDB,
};
