/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { SMS_MESSAGE_STATUS } = require('../SMSMessageConstants');
const tableName = 'SMSMessage';
const primaryKeyField = 'smsMessageId';

//user receive message schema
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(primaryKeyField).primary();
          table.string('smsMessageOrigin').defaultTo(''); // được gửi từ đâu
          table.float('smsMessageBalanceAmount', 48, 24).defaultTo(0); // số tiền
          table.integer('smsMessageRef').nullable(); // số tham chiếu đến PaymentDepositTransaction
          table.string('smsMessageStatus').defaultTo(SMS_MESSAGE_STATUS.NEW); // status
          table.string('smsMessageContent', 2000).defaultTo(''); // full content
          table.string('smsReceiveTime').defaultTo(''); // HH:mm giờ gửi tin nhắn từ máy
          table.string('smsReceiveDate').defaultTo(''); // YYYYMMDD ngày gửi tin nhắn từ máy
          table.string('smsReceiveMessageTime').defaultTo(''); // HH:mm giờ trong tin nhắn
          table.string('smsReceiveMessageDate').defaultTo(''); // YYYYMMDD ngày trong tin nhắn
          table.string('smsHash').defaultTo(''); // UUID của tin nhắn, generate từ hash của smsMessageContent + smsMessageOrigin + smsReceiveDate + smsReceiveTime
          table.string('smsMessageNote').defaultTo(''); // note
          table.integer('smsMessageAppUserId').nullable(); // app user id
          timestamps(table);
          table.index(primaryKeyField);
          table.index('smsMessageOrigin');
          table.index('smsMessageStatus');
          table.index('smsMessageAppUserId');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
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

async function findById(id) {
  return await Common.findById(tableName, primaryKeyField, id);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('smsMessageOrigin', 'like', `%${searchText}%`)
        .orWhere('smsMessageContent', 'like', `%${searchText}%`)
        .orWhere('smsMessageNote', 'like', `%${searchText}%`);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where(filterData);

  queryBuilder.where({ isDeleted: 0 });

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
  return new Promise((resolve, reject) => {
    try {
      query.count(`${primaryKeyField} as count`).then(records => {
        resolve(records);
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)} - ${JSON.stringify(order)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

module.exports = {
  insert,
  find,
  findById,
  count,
  updateById,
  initDB,
  modelName: tableName,
  customSearch,
  customCount,
  updateAll,
};
