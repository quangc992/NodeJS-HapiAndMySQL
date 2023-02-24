/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { STACKING_ACTIVITY_STATUS } = require('../StakingPackageConstant');
const tableName = 'UserStakingPackage';
const primaryKeyField = 'userStakingPackageId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(primaryKeyField).primary();
          table.integer('stakingPackageId');
          table.integer('appUserId');
          table.string('stakingName', 500);
          table.double('stakingPackagePrice'); // << so tien dau tu tai thoi diem do
          table.integer('stakingPeriod');
          table.integer('stakingActivityStatus').defaultTo(STACKING_ACTIVITY_STATUS.STAKING);
          table.float('stackingAmount', 48, 24); // số tiền gửi
          table.string('stakingStartDate'); // ngày bắt đầu
          table.string('stakingEndDate'); // ngày kết thúc
          table.string('stakingInterestRate'); // lãi xuất %
          table.timestamp('packageLastActiveDate', { useTz: true }).defaultTo(DB.fn.now());
          table.double('profitEstimate').defaultTo(0); // << loi nhuan du kien
          table.double('profitActual').defaultTo(0); // << loi nhuan thuc te
          table.double('profitClaimed').defaultTo(0); // << tien da thu duoc
          table.double('profitBonus').defaultTo(0); // << so tien duoc thuong (admin tang hoac he thong tu thuong)
          table.integer('stakingPaymentType'); // kỳ trả lãi (cuối kỳ hoặc theo  giai đoạn)
          table.integer('stakingPaymentPeriod'); // thời gian mỗi kỳ (ngày)
          timestamps(table);
          table.index('stakingPackageId');
          table.index('appUserId');
          table.index('stakingActivityStatus');
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
