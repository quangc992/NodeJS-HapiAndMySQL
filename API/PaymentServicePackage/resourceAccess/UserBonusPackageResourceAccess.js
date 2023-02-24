/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'UserBonusPackage';
const primaryKeyField = 'userBonusPackageId';
const { CLAIMABLE_STATUS } = require('../PaymentServicePackageConstant');

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.integer('appUserId'); //<< User nhan
          table.integer('bonusPackageId'); //<< goi cuoc duoc thuong map voi `paymentServicePackageId`
          table.timestamp('bonusPackageExpireDate', { useTz: true }).nullable(); // << ngay het han
          table.timestamp('bonusPackageClaimedDate', { useTz: true }).nullable(); // << ngay nhan
          table.integer('bonusPackageClaimable').defaultTo(CLAIMABLE_STATUS.ENABLE); // << tinh trang hoat dong cua package
          table.string('bonusPackageDescription', 300);
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index(`appUserId`);
          table.index(`bonusPackageId`);
          table.index(`bonusPackageExpireDate`);
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
  return new Promise(async (resolve, reject) => {
    resolve();
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
async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}
async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}

async function customSum(sumField, filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  if (filter.referAgentId) {
    queryBuilder.where('referId', referAgentId);
  }

  queryBuilder.where({
    status: WITHDRAW_TRX_STATUS.COMPLETED,
  });

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${sumField} as sumResult`).then(records => {
        if (records && records[0].sumResult === null) {
          resolve(undefined);
        } else {
          resolve(records);
        }
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${sumField}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

async function sumAmountDistinctByDate(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByDate(tableName, 'paymentAmount', filter, startDate, endDate);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  findById,
  deleteById,
  initDB,
  customSum,
  sumAmountDistinctByDate,
};
