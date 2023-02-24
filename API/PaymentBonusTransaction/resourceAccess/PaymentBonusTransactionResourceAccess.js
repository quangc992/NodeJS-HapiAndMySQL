/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { BONUS_TRX_STATUS, BONUS_TRX_CATEGORY, BONUS_TRX_UNIT } = require('../PaymentBonusTransactionConstant');
const tableName = 'PaymentBonusTransaction';
const primaryKeyField = 'paymentBonusTransactionId';

async function createTable() {
  console.info(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('paymentBonusTransactionId').primary();
          table.integer('appUserId'); //user duoc nhan hoa hong
          table.integer('walletId');
          table.integer('referUserId'); //nguoi user duoc tham chieu de tinh hoa hong
          table.integer('paymentMethodId');
          table.float('paymentAmount', 48, 24).defaultTo(0);
          table.float('totalReferAmount', 48, 24).defaultTo(0);
          table.string('paymentUnit').defaultTo(BONUS_TRX_UNIT.VND); //don vi tien
          table.string('paymentStatus').defaultTo(BONUS_TRX_STATUS.NEW);
          table.string('paymentDate'); //format YYYY/MM/DD
          table.string('paymentNote').defaultTo(''); //Ghi chu hoa don
          table.string('paymentRef').defaultTo(''); //Ma hoa don ngoai thuc te
          table.string('paymentOwner').defaultTo(''); //ten nguoi gui, ten tai khoan
          table.string('paymentOriginSource').defaultTo(''); //ten ngan hang, ten mang (blockchain)
          table.string('paymentOriginName').defaultTo(''); //so tai khoan, dia chi vi
          table.float('balanceBefore', 48, 24).defaultTo(0);
          table.float('balanceAfter', 48, 24).defaultTo(0);
          table.timestamp('paymentApproveDate', { useTz: true }); // ngay duyet
          table.integer('paymentPICId'); // nguoi duyet
          timestamps(table);
        })
        .then(() => {
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

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function customSearch(startDate, endDate) {
  let queryBuilder = DB(tableName);
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }
  queryBuilder.where({ isDeleted: 0 });
  return await queryBuilder.select();
}

async function customSum(sumField, filter, skip, limit, startDate, endDate, searchText, order) {
  //const _field = 'paymentAmount';

  let queryBuilder = DB(tableName);
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }
  queryBuilder.where({ isDeleted: 0 });

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

async function incrementPaymentAmount(id, amount) {
  return await Common.incrementFloat(tableName, primaryKeyField, id, 'paymentAmount', amount);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  deleteById,
  customSearch,
  modelName: tableName,
  customSum,
  sumAmountDistinctByDate,
  incrementPaymentAmount,
};
