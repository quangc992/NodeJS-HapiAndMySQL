/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'StakingPackage';
const primaryKeyField = 'stakingPackageId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(primaryKeyField).primary();
          table.string('stakingPackageName'); // tên gói
          table.string('stakingPackageDescription', 500); // mô tả gói
          table.float('stakingPackagePrice', 48, 24); // số tiền gửi
          table.integer('stakingPeriod'); // kỳ hạn - ngay
          table.float('stakingInterestRate'); // lãi xuất %
          table.integer('stakingPaymentType'); // kỳ trả lãi (cuối kỳ hoặc theo  giai đoạn)
          table.integer('stakingPaymentPeriod'); // thời gian mỗi kỳ (ngày)
          timestamps(table);
          table.index(primaryKeyField);
          table.index('stakingPackagePrice');
          table.index('stakingPeriod');
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
  let paymentPackages = [
    {
      stakingPackageName: 'STAKE 1',
      stakingPackageDescription: 'WONDERFUL STAKE 1',
      stakingPackagePrice: 1000,
      stakingPeriod: 60,
      stakingInterestRate: 14,
      stakingPaymentType: 20,
      stakingPaymentPeriod: 30,
    },
    {
      stakingPackageName: 'STAKE 2',
      stakingPackageDescription: 'WONDERFUL STAKE 2',
      stakingPackagePrice: 2000,
      stakingPeriod: 120,
      stakingInterestRate: 40,
      stakingPaymentType: 20,
      stakingPaymentPeriod: 30,
    },
    {
      stakingPackageName: 'STAKE 3',
      stakingPackageDescription: 'WONDERFUL STAKE 3',
      stakingPackagePrice: 5000,
      stakingPeriod: 360,
      stakingInterestRate: 180,
      stakingPaymentType: 20,
      stakingPaymentPeriod: 30,
    },
  ];
  return new Promise(async (resolve, reject) => {
    DB(`${tableName}`)
      .insert(paymentPackages)
      .then(result => {
        Logger.info(`${tableName}`, `seeding ${tableName}` + result);
        resolve();
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

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
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
  findById,
  count,
  updateById,
  initDB,
  customCount,
  customSearch,
  modelName: tableName,
  customSum,
  deleteById,
};
