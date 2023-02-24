/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { WITHDRAW_TRX_STATUS } = require('../../PaymentWithdrawTransaction/PaymentWithdrawTransactionConstant');
const { EXCHANGE_TRX_STATUS, EXCHANGE_TRX_UNIT } = require('../PaymentExchangeTransactionConstant');
const tableName = 'PaymentExchangeTransaction';
const primaryKeyField = 'paymentExchangeTransactionId';
async function createTable() {
  console.info(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('paymentExchangeTransactionId').primary();
          table.integer('appUserId'); // nguoi gui
          table.integer('sendWalletId'); // vi nguoi gui
          table.integer('receiveWalletId'); // vi nguoi nhan
          table.integer('referId'); // nguoi gioi thieu hoac nguoi nhan
          table.integer('paymentMethodId');
          table.float('exchangeRate', 48, 24).defaultTo(1); //ti le quy doi
          table.float('paymentAmount', 48, 24).defaultTo(0); //so luong tien gui di
          table.float('receiveAmount', 48, 24).defaultTo(0); //so luong tien nhan lai
          table.float('sendWalletBalanceBefore', 48, 24).defaultTo(0); //balance vi gui truoc khi exchange
          table.float('sendWalletBalanceAfter', 48, 24).defaultTo(0); //balance vi gui sau khi exchange
          table.float('receiveWalletBalanceBefore', 48, 24).defaultTo(0); //balance vi nhan truoc khi exchange
          table.float('receiveWalletBalanceAfter', 48, 24).defaultTo(0); //balance vi nhan sau khi exchange
          table.float('paymentRewardAmount', 48, 24).defaultTo(0); //thuong
          table.string('paymentUnit').defaultTo(EXCHANGE_TRX_UNIT.VND); //don vi tien
          table.string('sendPaymentUnitId').defaultTo(EXCHANGE_TRX_UNIT.VND); //don vi tien cua ben gui
          table.string('receivePaymentUnitId').defaultTo(EXCHANGE_TRX_UNIT.VND); //don vi tien cua ben nhan
          table.string('paymentStatus').defaultTo(EXCHANGE_TRX_STATUS.NEW);
          table.string('paymentNote').defaultTo(''); //Ghi chu hoa don
          table.string('paymentRef').defaultTo(''); //Ma hoa don ngoai thuc te
          table.timestamp('paymentApproveDate', { useTz: true }); // ngay duyet
          table.integer('paymentPICId'); // nguoi duyet
          timestamps(table);
          table.index('appUserId');
          table.index('sendWalletId');
          table.index('receiveWalletId');
          table.index('sendPaymentUnitId');
          table.index('receivePaymentUnitId');
          table.index('referId');
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

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
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
    paymentStatus: WITHDRAW_TRX_STATUS.COMPLETED,
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
function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  if (filter === undefined) {
    filter = {};
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where(filter);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  customSum,
  sumAmountDistinctByDate,
  customSearch,
  customCount,
};
