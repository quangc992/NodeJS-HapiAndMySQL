/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Logger = require('../../../utils/logging');
const moment = require('moment');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { CUSTOMER_VISIT_STATUS } = require('../CustomerVisitRecordConstants');
const tableName = 'CustomerVisitRecord';
const primaryKeyField = 'customerVisitRecordId';

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, table => {
          table.increments(`${primaryKeyField}`).primary();
          table.string('customerVisitRecordFullname');
          table.string('customerVisitRecordNote');
          table.string('customerVisitRecordEmail');
          table.integer('customerVisitRecordStatus').defaultTo(CUSTOMER_VISIT_STATUS.NONE);
          table.string('customerVisitRecordPhoneNumber');
          table.string('customerVisitRecordImageUrl');
          table.string('customerVisitRecordPurpose');
          table.string('customerVisitRecordCompanyName');
          table.string('customerVisitRecordIdentity');
          table.string('customerVisitRecordPlatenumber');
          table.integer('receiverId');
          table.integer('receiverStationsId');
          table.integer('customerInfoId');
          table.integer('stationsId');
          table.string('staffName');
          table.integer('approvedByStaffId');
          table.integer('proccessedByStaffId');
          table.integer('createdByStaffId');
          table.timestamp('approvedAt').nullable();
          table.timestamp('visitedAt').nullable();
          table.timestamp('leaveAt').nullable();
          timestamps(table);
          table.index(primaryKeyField);
          table.index('customerInfoId');
          table.index('stationsId');
          table.index('approvedAt');
          table.index('visitedAt');
          table.index('leaveAt');
          table.index('receiverStationsId');
          table.index('receiverId');
        })
        .then(() => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          resolve();
        })
        .catch(e => {
          Logger.info(`${tableName}`, `${tableName} table created failure`);
          reject(e);
        });
    });
  });
}

async function initDB() {
  await createTable();
}

function insert(data) {
  return Common.insert(tableName, data);
}

function updateById(id, data) {
  if (!data || Object.keys(data).length === 0) {
    return 1;
  }
  let filter = {};
  filter[primaryKeyField] = id;
  return Common.updateById(tableName, filter, data);
}

function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return Common.deleteById(tableName, dataId);
}

function find(filter, skip, limit, order) {
  return Common.find(tableName, filter, skip, limit, order);
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}

function updateAll(data, filter) {
  return Common.updateAll(tableName, data, filter);
}

function _createQueryBuilderByConditions(filter, skip, limit, startDate, endDate, searchText, order) {
  const queryBuilder = DB(tableName);
  const filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('customerVisitRecordFullname', 'like', `%${searchText}%`)
        .orWhere('customerVisitRecordEmail', 'like', `%${searchText}%`)
        .orWhere('customerVisitRecordPhoneNumber', 'like', `%${searchText}%`);
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
    queryBuilder.where('visitedAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('visitedAt', '<=', endDate);
  }

  if (order && order.key !== '' && ['desc', 'asc'].includes(order.value)) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _createQueryBuilderByConditions(filter, skip, limit, startDate, endDate, searchText, order);
  return query.select();
}

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _createQueryBuilderByConditions(filter, undefined, undefined, startDate, endDate, searchText, order);

  let count;

  try {
    const [record] = await query.count(`${primaryKeyField} as count`);
    if (record || record === 0) {
      count = record.count;
    }
  } catch (e) {
    Logger.error('ResourceAccess', `DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)} - ${JSON.stringify(order)}`);
    Logger.error('ResourceAccess', e);
  }

  return count;
}

module.exports = {
  initDB,
  insert,
  updateById,
  deleteById,
  find,
  findById,
  updateAll,
  customSearch,
  customCount,
  primaryKeyField,
};
