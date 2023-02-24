/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'AppUserService';
const primaryKeyField = 'appUserId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.integer('appUserId');
          table.integer('userServiceId');
          table.string('userServiceType');
          timestamps(table);
          table.primary(['appUserId', 'userServiceId']);
          table.index('userServiceId');
          table.index('userServiceType');
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
    let seedingData = [];

    if (seedingData.length > 0) {
      DB(`${tableName}`)
        .insert(seedingData)
        .then(result => {
          Logger.info(`${tableName}`, `seeding ${tableName}` + result);
          resolve();
        });
    } else {
      Logger.info(`${tableName}`, `seeding ${tableName}`);
      resolve();
    }
  });
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let filter = {};
  filter[`${primaryKeyField}`] = id;
  return await Common.updateById(tableName, filter, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

async function updateAllById(idList, data) {
  return await Common.updateAllById(tableName, primaryKeyField, idList, data);
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

function _makeQueryBuilderByFilter(filter, skip, limit, searchText, startDate, endDate, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.username) {
      queryBuilder.where('username', 'like', `%${filterData.username}%`);
      delete filterData.username;
    }

    if (filterData.firstName) {
      queryBuilder.where('firstName', 'like', `%${filterData.firstName}%`);
      delete filterData.firstName;
    }

    if (filterData.lastName) {
      queryBuilder.where('lastName', 'like', `%${filterData.lastName}%`);
      delete filterData.lastName;
    }

    if (filterData.phoneNumber) {
      queryBuilder.where('phoneNumber', 'like', `%${filterData.phoneNumber}%`);
      delete filterData.phoneNumber;
    }

    if (filterData.email) {
      let index = filterData.email.indexOf('@');
      let email = filterData.email.slice(0, index);
      queryBuilder.where('email', 'like', `%${email}%`);
      delete filterData.email;
    }
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
async function customSearch(filter, skip, limit, searchText, startDate, endDate, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, searchText, startDate, endDate, order);
  return await query.select();
}
async function customCount(filter, searchText, startDate, endDate, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, searchText, startDate, endDate, order);
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
  count,
  updateById,
  initDB,
  updateAll,
  findById,
  customSearch,
  customCount,
  modelName: tableName,
};
