/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'WalletRecord';
const primaryKeyField = 'WalletRecordId';
async function createTable() {
  console.info(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('WalletRecordId').primary();
          table.integer('appUserId');
          table.integer('walletId');
          table.float('paymentAmount', 48, 10).defaultTo(0);
          table.float('paymentAmountIn', 48, 10).defaultTo(0); //credit
          table.float('paymentAmountOut', 48, 10).defaultTo(0); //debit
          table.integer('paymentAmountInOut').defaultTo(0); //0: CREDIT , 10: DEBIT
          table.float('balanceBefore', 48, 10).defaultTo(0);
          table.float('balanceAfter', 48, 10).defaultTo(0);
          table.string('WalletRecordNote').nullable(); // nội dung để tham khảo
          table.string('WalletRecordRef').nullable(); //hóa đơn, mã giao dịch .v.v. id để tham khảo
          table.float('WalletRecordRefAmount', 48, 10).defaultTo(0); //Số tiền gì đó, dùng để tham khảo
          table.string('WalletRecordType');
          table.integer('staffId');
          table.integer('betRecordId');
          table.integer('gameRecordId');
          table.integer('paymentDepositTransactionId');
          table.integer('paymentWithdrawTransactionId');
          table.integer('paymentExchangeTransactionId');
          table.integer('paymentExternalTransactionId');
          table.integer('paymentBonusTransactionId');
          timestamps(table);
          table.index('appUserId');
          table.index('walletId');
          table.index('staffId');
          table.index('betRecordId');
          table.index('gameRecordId');
          table.index('paymentDepositTransactionId');
          table.index('paymentWithdrawTransactionId');
          table.index('paymentExchangeTransactionId');
          table.index('paymentExternalTransactionId');
          table.index('paymentBonusTransactionId');
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

function _makeQueryBuilderByFilter(filter, skip, limit, searchText, startDate, endDate, order) {
  let queryBuilder = DB(tableName);
  let filterData = JSON.parse(JSON.stringify(filter));

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`)
        .orWhere('companyName', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where(filterData);

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

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

async function customSum(sumField, filter, searchText, startDate, endDate, order) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, undefined, undefined, searchText, startDate, endDate, order);
  return queryBuilder.sum(`${sumField} as sumResult`);
}
module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  customSum,
};
