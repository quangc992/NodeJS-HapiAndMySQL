/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const UtilFunction = require('../../ApiUtils/utilFunctions');
const tableName = 'PaymentRecord';
const primaryKeyField = 'paymentRecordId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('paymentRecordId').primary();
          table.integer('paymentUserId'); // Người trả tiền
          table.integer('paymentTargetId'); // Đối tượng được thanh toán (ví dụ: BDS)
          table.string('paymentTitle').defaultTo(''); //Tiêu đề mô tả của giao dịch
          table.string('paymentDetail', 500).defaultTo(''); //Nội dung giao dịch
          table.string('paymentTargetType').defaultTo(''); //Loại Đối tượng giao dịch - ASCII (ví dụ "REALESTATE")
          table.string('paymentTargetTypeName').defaultTo(''); //Tên Loại Đối tượng giao dịch (vi dụ "Xem thông tin nhà đất")
          table.integer('walletId'); //Ví
          table.float('paymentAmount', 48, 24).defaultTo(0); // Số tiền thanh toán
          table.float('walletBalanceBefore', 48, 24).defaultTo(0); //Số dư ví trước khi thanh toán
          table.float('walletBalanceAfter', 48, 24).defaultTo(0); //Só dư ví sau khi thanh toán
          table.string('paymentNote').defaultTo(''); //Ghi chú giao dịch
          table.string('paymentRefNote').defaultTo(''); //Số hóa đơn (nếu có)
          timestamps(table);
          table.index('paymentUserId');
          table.index('paymentTargetId');
          table.index('walletId');
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
    Logger.info(`${tableName}`, `seeding ${tableName}`);
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

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  queryBuilder.where(filterData);
  queryBuilder.where({ isDeleted: 0 });
  if (limit) {
    queryBuilder.limit(limit);
  }
  if (skip) {
    queryBuilder.offset(skip);
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

async function customSearch(filter, skip, limit, startDate, endDate, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, order);
  return await query.select();
}

async function customCount(filter, startDate, endDate, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function customSum(filter, startDate, endDate) {
  const _field = 'paymentAmount';

  let queryBuilder = DB(tableName);
  if (startDate) {
    DB.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    DB.where('createdAt', '<=', endDate);
  }

  if (filter.referAgentId) {
    DB.where('referId', referAgentId);
  }

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${_field} as sumResult`).then(records => {
        if (records && records[0].sumResult === null) {
          resolve(undefined);
        } else {
          resolve(records);
        }
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${field}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  customCount,
  customSearch,
  modelName: tableName,
  customSum,
};
