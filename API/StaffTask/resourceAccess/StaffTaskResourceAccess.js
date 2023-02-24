/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const CommonResourceAccess = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'StaffTask';
const primaryKeyField = 'staffTaskId';
const { STAFF_TASK_STATUS, STAFF_TASK_PRIORITY } = require('../StaffTaskConstants');

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('taskName');
          table.integer('taskPriority').defaultTo(STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_NORMAL);
          table.integer('taskStatus').defaultTo(STAFF_TASK_STATUS.NEW);
          table.integer('taskType');
          table.string('taskDescription');
          table.string('taskTags');
          table.string('taskTitle');
          table.integer('parentTaskId');
          table.integer('stationId');
          table.integer('reportedStaffId');
          table.integer('taskCompletedPercentage');
          table.integer('assignedStaffId');
          table.timestamp('taskStartDate').nullable();
          table.timestamp('taskEndDate').nullable();
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index(`taskStatus`);
          table.index(`taskPriority`);
          table.index(`taskStartDate`);
          table.index(`taskEndDate`);
          table.index(`taskTags`);
          table.index(`parentTaskId`);
          table.index('taskTitle');
        })
        .then(() => {
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

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  const queryBuilder = DB(tableName);
  const filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('taskTitle', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where({ isDeleted: 0 });

  //!! IMPORTANT !! thường chỉ lấy danh sách task do chính staff đó tạo ra hoặc được phân công
  if (filterData.reportedStaffId && filterData.assignedStaffId) {
    let _reportedStaffId = filterData.reportedStaffId;
    let _assignedStaffId = filterData.assignedStaffId;
    queryBuilder.where(function () {
      this.orWhere('reportedStaffId', '=', _reportedStaffId);
      this.orWhere('assignedStaffId', '=', _assignedStaffId);
    });
    delete filterData.reportedStaffId;
    delete filterData.assignedStaffId;
  }

  CommonResourceAccess.filterHandler(filterData, queryBuilder);

  if (limit !== undefined) {
    queryBuilder.limit(limit);
  }

  if (skip !== undefined) {
    queryBuilder.offset(skip);
  }

  if (startDate) {
    queryBuilder.where('taskEndDate', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('taskEndDate', '<=', endDate);
  }

  if (order && order.key !== '' && ['desc', 'asc'].includes(order.value)) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  console.log(queryBuilder.toString());
  return queryBuilder;
}

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
  return query.count(`${primaryKeyField} as count`);
}

async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return query.select();
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  customSearch,
  customCount,
  updateAll,
  findById,
};
