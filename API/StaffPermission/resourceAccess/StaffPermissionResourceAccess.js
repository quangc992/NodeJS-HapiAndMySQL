/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'StaffPermission';
const primaryKeyField = 'permissionId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('permissionName');
          table.string('permissionKey');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('permissionName');
          table.index('permissionKey');
          table.unique('permissionKey');
        })
        .then(() => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          let initialStaffPermissions = [
            'VIEW_DASHBOARD',
            'VIEW_PRODUCTS',
            'VIEW_ORDERS',
            'VIEW_USERS',
            'VIEW_DEPOSIT',
            'VIEW_WITHDRAW',
            'VIEW_TRANSACTION',
            'VIEW_NOTIFICATIONS',
            'VIEW_PAYMENT_METHOD',
            'VIEW_SYSTEM_CONFIG',
            'VIEW_ROLES',
            'VIEW_STAFFS',
            'EDIT_USERS',
            'APPROVE_DEPOSIT',
            'APPROVE_WITHDRAW',
          ];
          let permissionArr = [];
          for (let i = 0; i < initialStaffPermissions.length; i++) {
            const permission = initialStaffPermissions[i];
            permissionArr.push({
              permissionName: permission,
              permissionKey: permission.toUpperCase().replace(/\s/gi, '_'),
            });
          }

          DB(`${tableName}`)
            .insert(permissionArr)
            .then(result => {
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

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
};
