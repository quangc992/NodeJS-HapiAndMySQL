/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'HanetFaceMapping';
const primaryKeyField = 'personID';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          // table.increments(`${primaryKeyField}`).primary();
          table.string('personID').primary(); //: id định danh của một FaceID
          table.integer('staffId').nullable().defaultTo(null); //: staff ID cua system
          table.integer('appUserId').nullable().defaultTo(null); //: appUserID cua system
          table.integer('customerInfoId').nullable().defaultTo(null); //: customerInfoId cua system
          timestamps(table);
          table.index(`personID`);
          table.index(`appUserId`);
          table.index(`staffId`);
          table.index(`customerInfoId`);
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

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, skip, limit, order) {
  return await Common.count(tableName, filter, skip, limit, order);
}

async function deleteByFilter(filter) {
  return await Common.deleteById(tableName, filter);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  const queryBuilder = DB(tableName);
  const filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('customerFullName', 'like', `%${searchText}%`)
        .orWhere('customerEmail', 'like', `%${searchText}%`)
        .orWhere('customerPhoneNumber', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

  if (limit !== undefined) {
    queryBuilder.limit(limit);
  }

  if (skip !== undefined) {
    queryBuilder.offset(skip);
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  if (order && order.key !== '' && ['desc', 'asc'].includes(order.value)) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}
module.exports = {
  insert,
  find,
  findById,
  count,
  initDB,
  deleteByFilter,
  updateById,
  updateAll,
  customCount,
  customSearch,
};
