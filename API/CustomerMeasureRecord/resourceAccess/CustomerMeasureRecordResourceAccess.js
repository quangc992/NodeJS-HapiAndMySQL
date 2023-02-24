/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const moment = require('moment');

const { CHECKING_STATUS } = require('../CustomerMeasureRecordConstants');
const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'CustomerMeasureRecord';
const primaryKeyField = 'customerMeasureRecordId';

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('customerMeasureRecordId').primary();
          table.integer('id').defaultTo(0);
          table.string('date_check').defaultTo('');
          table.string('time').defaultTo('');
          table.string('healthAssessment_title').defaultTo('');
          table.integer('healthAssessment_value').defaultTo(0);
          table.string('healthAssessment_unit').defaultTo('');
          table.string('bodyComposittionAnalysis_title').defaultTo('');
          table.string('customerMeasureRecordPlatenumber');
          table.string('customerMeasureRecordPlateColor').defaultTo('white');
          table.string('customerMeasureRecordPlateImageUrl').defaultTo('');
          table.string('customerMeasureRecordCheckDate').defaultTo('');
          table.string('customerMeasureRecordCheckStatus').defaultTo(CHECKING_STATUS.NEW);
          table.timestamp('customerMeasureRecordProcessCheckDate').defaultTo(DB.fn.now());
          table.string('customerMeasureRecordCheckExpiredDate').defaultTo('');
          table.integer('customerMeasureRecordCheckDuration').nullable();
          table.integer('customerMeasureRecordCheckStepDuration').nullable();
          table.timestamp('customerMeasureRecordModifyDate').nullable();
          table.timestamp('customerMeasureRecordEmailNotifyDate').nullable();
          table.timestamp('customerMeasureRecordSMSNotifyDate').nullable();
          table.integer('customerStationId');
          table.integer('returnNumberCount').defaultTo(0);
          timestamps(table);
          table.index('customerMeasureRecordFullName');
          table.index('customerMeasureRecordState');
          table.index('customerMeasureRecordEmail');
          table.index('customerMeasureRecordPhone');
          table.index('customerMeasureRecordPlateColor');
          table.index('customerMeasureRecordPlatenumber');
          table.index('returnNumberCount');
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

async function deleteById(customerScheduleId) {
  let dataId = {};
  dataId[primaryKeyField] = customerScheduleId;
  return await Common.deleteById(tableName, dataId);
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
      this.orWhere('customerMeasureRecordFullName', 'like', `%${searchText}%`)
        .orWhere('customerMeasureRecordEmail', 'like', `%${searchText}%`)
        .orWhere('customerMeasureRecordPhone', 'like', `%${searchText}%`)
        .orWhere('customerMeasureRecordPlatenumber', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.customerMeasureRecordFullName) {
      queryBuilder.where('customerMeasureRecordFullName', 'like', `%${filterData.customerMeasureRecordFullName}%`);
      delete filterData.customerMeasureRecordFullName;
    }

    if (filterData.customerMeasureRecordEmail) {
      queryBuilder.where('customerMeasureRecordEmail', 'like', `%${filterData.customerMeasureRecordEmail}%`);
      delete filterData.customerMeasureRecordEmail;
    }

    if (filterData.customerMeasureRecordPhone) {
      queryBuilder.where('customerMeasureRecordPhone', 'like', `%${filterData.customerMeasureRecordPhone}%`);
      delete filterData.customerMeasureRecordPhone;
    }

    if (filterData.customerMeasureRecordPlatenumber) {
      queryBuilder.where('customerMeasureRecordPlatenumber', 'like', `%${filterData.customerMeasureRecordPlatenumber}%`);
      delete filterData.customerMeasureRecordPlatenumber;
    }
  }

  if (startDate) {
    queryBuilder.where('customerMeasureRecordCheckDate', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('customerMeasureRecordCheckDate', '<=', endDate);
  }
  if (filterData.returnNumberCount) {
    queryBuilder.where('returnNumberCount', '>=', filterData.returnNumberCount);
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
function _makeQueryBuilderByFilterByExpiredDate(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('customerMeasureRecordFullName', 'like', `%${searchText}%`)
        .orWhere('customerMeasureRecordEmail', 'like', `%${searchText}%`)
        .orWhere('customerMeasureRecordPhone', 'like', `%${searchText}%`)
        .orWhere('customerMeasureRecordPlatenumber', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.customerMeasureRecordFullName) {
      queryBuilder.where('customerMeasureRecordFullName', 'like', `%${filterData.customerMeasureRecordFullName}%`);
      delete filterData.customerMeasureRecordFullName;
    }

    if (filterData.customerMeasureRecordEmail) {
      queryBuilder.where('customerMeasureRecordEmail', 'like', `%${filterData.customerMeasureRecordEmail}%`);
      delete filterData.customerMeasureRecordEmail;
    }

    if (filterData.customerMeasureRecordPhone) {
      queryBuilder.where('customerMeasureRecordPhone', 'like', `%${filterData.customerMeasureRecordPhone}%`);
      delete filterData.customerMeasureRecordPhone;
    }

    if (filterData.customerMeasureRecordPlatenumber) {
      queryBuilder.where('customerMeasureRecordPlatenumber', 'like', `%${filterData.customerMeasureRecordPlatenumber}%`);
      delete filterData.customerMeasureRecordPlatenumber;
    }
  }

  if (startDate) {
    queryBuilder.where('customerMeasureRecordCheckExpiredDate', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('customerMeasureRecordCheckExpiredDate', '<=', endDate);
  }
  if (filterData.returnNumberCount) {
    queryBuilder.where('returnNumberCount', '>=', filterData.returnNumberCount);
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
  if (startDate) {
    startDate = moment(startDate, 'DD/MM/YYYY').hours(0).minutes(0).toDate();
  }
  if (endDate) {
    endDate = moment(endDate, 'DD/MM/YYYY').hours(23).minutes(59).toDate();
  }

  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, startDate, endDate, searchText, order) {
  if (startDate) {
    startDate = moment(startDate, 'DD/MM/YYYY').hours(0).minutes(0).toDate();
  }
  if (endDate) {
    endDate = moment(endDate, 'DD/MM/YYYY').hours(23).minutes(59).toDate();
  }

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

async function customSearchByExpiredDate(filter, skip, limit, startDate, endDate, searchText, order) {
  if (startDate) {
    startDate = moment(startDate, 'DD/MM/YYYY').hours(0).minutes(0).toDate();
  }
  if (endDate) {
    endDate = moment(endDate, 'DD/MM/YYYY').hours(23).minutes(59).toDate();
  }

  let query = _makeQueryBuilderByFilterByExpiredDate(filter, skip, limit, startDate, endDate, searchText, order);

  return await query.select();
}

async function customCountByExpiredDate(filter, startDate, endDate, searchText, order) {
  if (startDate) {
    startDate = moment(startDate, 'DD/MM/YYYY').hours(0).minutes(0).toDate();
  }
  if (endDate) {
    endDate = moment(endDate, 'DD/MM/YYYY').hours(23).minutes(59).toDate();
  }

  let query = _makeQueryBuilderByFilterByExpiredDate(filter, undefined, undefined, startDate, endDate, searchText, order);
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

async function findRecordByProcessCheckDate(filter, startDate, endDate) {
  if (startDate) {
    startDate = moment(startDate, 'DD/MM/YYYY').hours(0).minutes(0).toDate();
  }
  if (endDate) {
    endDate = moment(endDate, 'DD/MM/YYYY').hours(23).minutes(59).toDate();
  }

  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (startDate) {
    queryBuilder.where('customerMeasureRecordProcessCheckDate', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('customerMeasureRecordProcessCheckDate', '<=', endDate);
  }

  queryBuilder.where({ isDeleted: 0 });
  queryBuilder.where(filterData);

  return await queryBuilder.select();
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
  customSearchByExpiredDate,
  customCountByExpiredDate,
  deleteById,
  findRecordByProcessCheckDate,
  updateAll,
};
