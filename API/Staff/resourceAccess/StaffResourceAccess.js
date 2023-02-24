/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'Staff';
const primaryKeyField = 'staffId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('staffId').primary();
          table.string('username');
          table.string('lastName');
          table.string('firstName');
          table.string('email');
          table.integer('staffRoleId');
          table.string('password');
          table.string('active').defaultTo(1);
          table.string('ipAddress');
          table.string('phoneNumber');
          table.string('lastActiveAt');
          table.string('twoFACode');
          table.string('telegramId');
          table.string('facebookId');
          table.string('appleId');
          table.string('staffAvatar', 2000); //Image from social login may be so long (include token)
          table.string('stationsId');
          table.string('staffToken', 1000);
          timestamps(table);
          table.index('staffId');
          table.unique('username');
          table.unique('email');
          table.index('username');
          table.index('firstName');
          table.index('lastName');
          table.index('email');
          table.index('password');
          table.index('active');
          table.index('ipAddress');
          table.index('phoneNumber');
          table.index('lastActiveAt');
          table.index('twoFACode');
        })
        .then(() => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          seeding().then(result => {
            Logger.info(`${tableName}`, `init ${tableName}` + result);
            resolve();
          });
        });
    });
  });
}

async function initDB() {
  await createTable();
}

async function seeding() {
  return new Promise(async (resolve, reject) => {
    let initialStaff = [
      {
        lastName: 'string',
        firstName: 'string',
        username: 'superadmin',
        email: 'string@string.com',
        password: 'fc6e53bc3b36d4f8a9479ab9886904dc62b1194f60cc0a7dea4fbc58e0859614',
        phoneNumber: 'string',
        staffRoleId: 1,
      },
      {
        lastName: 'agency',
        firstName: 'agency',
        username: 'agency',
        email: 'agency@string.com',
        password: 'fc6e53bc3b36d4f8a9479ab9886904dc62b1194f60cc0a7dea4fbc58e0859614',
        phoneNumber: 'agency',
        staffRoleId: 5,
        stationsId: 1,
      },
    ];
    DB(`${tableName}`)
      .insert(initialStaff)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName}` + result);
        resolve();
      });
  });
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

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  modelName: tableName,
  findById,
};
