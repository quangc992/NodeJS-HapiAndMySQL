/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const {
  NOTIFICATION_METHOD,
  NOTIFICATION_RECEIVER,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE,
  NOTIFICATION_TOPIC,
} = require('../StaffNotificationConstants');
const tableName = 'StaffNotification';

const primaryKeyField = 'staffNotificationId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('notificationSendStatus').defaultTo(NOTIFICATION_STATUS.NEW);
          table.string('notificationMethod').defaultTo(NOTIFICATION_METHOD.GENERAL);
          table.string('notificationTopic').defaultTo(NOTIFICATION_TOPIC.STAFF);
          table.string('notificationType').defaultTo(NOTIFICATION_TYPE.GENERAL);
          table.integer('receiverType').defaultTo(NOTIFICATION_RECEIVER.STAFF);
          table.integer('receiverId').unsigned().notNullable(); // id nguoi nhan
          table.integer('stationsId').unsigned().notNullable();
          table.integer('staffTaskId').unsigned(); // link toi task neu la thong bao ve task
          table.boolean('isRead').defaultTo(0);
          table.string('notificationImage');
          table.string('notificationNote');
          table.string('notificationTitle');
          table.string('notificationContent', 2000);
          table.integer('groupStaffNotificationId').unsigned(); //id nhom (neu gui theo nhom)
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('notificationSendStatus');
          table.index('notificationMethod');
          table.index('notificationTopic');
          table.index('notificationType');
          table.index('stationsId');
          table.index('receiverId');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          resolve();
        });
    });
  });
}

function initDB() {
  createTable();
}

function insert(data) {
  return Common.insert(tableName, data);
}

function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return Common.deleteById(tableName, dataId);
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}

function find(filter, skip, limit, order) {
  return Common.find(tableName, filter, skip, limit, order);
}

function count(filter, order) {
  return Common.count(tableName, primaryKeyField, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('notificationMethod', 'like', `%${searchText}%`)
        .orWhere('notificationTitle', 'like', `%${searchText}%`)
        .orWhere('notificationContent', 'like', `%${searchText}%`);
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

module.exports = {
  insert,
  find,
  findById,
  count,
  deleteById,
  initDB,
  customSearch,
  customCount,
};
