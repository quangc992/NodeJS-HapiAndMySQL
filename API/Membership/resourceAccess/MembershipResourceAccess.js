/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 12/31/21.
 */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'Membership';
const primaryKeyField = 'membershipId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('membershipTitle');
          table.integer('membershipPointRequired');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('membershipTitle');
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
  let projectStatus = [
    {
      membershipTitle: 'Member',
      membershipPointRequired: 0,
    },
    {
      membershipTitle: 'VIP 1',
      membershipPointRequired: 100,
    },
    {
      membershipTitle: 'VIP 2',
      membershipPointRequired: 200,
    },
    {
      membershipTitle: 'VIP 3',
      membershipPointRequired: 500,
    },
    {
      membershipTitle: 'VIP 4',
      membershipPointRequired: 1000,
    },
    {
      membershipTitle: 'VIP 5',
      membershipPointRequired: 2000,
    },
    {
      membershipTitle: 'VIP 6',
      membershipPointRequired: 5000,
    },
    {
      membershipTitle: 'VIP 7',
      membershipPointRequired: 10000,
    },
    {
      membershipTitle: 'VIP 8',
      membershipPointRequired: 20000,
    },
    {
      membershipTitle: 'VIP 9',
      membershipPointRequired: 50000,
    },
    {
      membershipTitle: 'VIP 10',
      membershipPointRequired: 100000,
    },
  ];
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`)
      .insert(projectStatus)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName}` + result);
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
