/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { MESSAGE_STATUS, MESSAGE_CATEGORY, MESSAGE_TOPIC, MESSAGE_TYPE, MESSAGE_RECEIVER } = require('../CustomerMessageConstant');
const tableName = 'CustomerMessage';
const primaryKeyField = 'customerMessageId';

//user receive message schema
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('customerMessageId').primary();
          table.string('customerMessageSendStatus').defaultTo(MESSAGE_STATUS.NEW);
          table.string('customerMessageCategories').defaultTo(MESSAGE_CATEGORY.EMAIL);
          table.string('customerMessageTopic').defaultTo(MESSAGE_TOPIC.GENERAL);
          table.string('customerMessageType').defaultTo(MESSAGE_TYPE.GENERAL);
          table.string('customerMessagePhone');
          table.string('customerMessageEmail');
          table.string('customerMessageIdentity');
          table.string('customerMessageNote');
          table.string('customerMessageImage');
          table.string('customerMessageContent', 2000);
          table.string('customerMessageTitle');
          table.integer('isRead').defaultTo(0);
          table.integer('customerStationId'); //tram
          table.integer('customerScheduleId'); //lich hen
          table.integer('receiverType').defaultTo(MESSAGE_RECEIVER.USER); //loai nguoi nhan
          table.integer('customerId'); //id KH
          table.integer('staffId'); //<< nguoi gui
          table.integer('groupCustomerMessageId'); //id nhom (neu gui theo nhom)
          table.integer('templateCustomerMessageId'); //id template (neu gui theo template)
          timestamps(table);
          table.index('customerMessageSendStatus');
          table.index('customerMessageCategories');
          table.index('customerMessageType');
          table.index('customerMessageTopic');
          table.index('customerMessagePhone');
          table.index('customerMessageEmail');
          table.index('customerMessageIdentity');
          table.index('isRead');
          table.index('customerStationId');
          table.index('customerScheduleId');
          table.index('customerId');
          table.index('staffId');
          table.index('groupCustomerMessageId');
          table.index('templateCustomerMessageId');
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
      this.orWhere('customerMessageCategories', 'like', `%${searchText}%`)
        .orWhere('customerMessageContent', 'like', `%${searchText}%`)
        .orWhere('customerRecordPhone', 'like', `%${searchText}%`);
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

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
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
