/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'PaymentServicePackageUser';
const primaryKeyField = 'paymentServicePackageUserId';
const { ACTIVITY_STATUS } = require('../PaymentServicePackageConstant');

async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.integer('appUserId'); //<< User nguoi mua
          table.integer('paymentServicePackageId'); //<< goi cuoc
          table.timestamp('packageExpireDate', { useTz: true }).defaultTo(DB.fn.now()); // << ngay het han
          table.timestamp('packageLastActiveDate', { useTz: true }).defaultTo(DB.fn.now());
          table.integer('packageActivityStatus').defaultTo(ACTIVITY_STATUS.WORKING); // << tinh trang hoat dong cua package
          table.double('packagePrice'); // << gia mua package tai thoi diem do
          table.double('packageDiscountPrice').nullable(); // << gia mua khuyen mai cua package tai thoi diem do
          table.double('packagePaymentAmount').nullable(); // << gia mua khuyen mai cua package tai thoi diem do
          table.double('profitEstimate').defaultTo(0); // << loi nhuan du kien
          table.double('profitActual').defaultTo(0); // << loi nhuan thuc te
          table.double('profitClaimed').defaultTo(0); // << tien da thu duoc
          table.double('profitBonus').defaultTo(0); // << so tien duoc thuong (admin tang hoac he thong tu thuong)
          table.double('profitBonusClaimed').defaultTo(0); //<<so tien thuong da nhan
          table.double('packageCurrentPerformance').defaultTo(0); // << so FAC  khai thac theo giai doan
          table.float('percentCompleted').defaultTo(0); // phần trăm thanh lý
          table.string('packageNote').nullable(); // ly do thanh ly
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index(`appUserId`);
          table.index(`paymentServicePackageId`);
          table.index(`packageExpireDate`);
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

async function sumAmountDistinctByDate(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByDate(tableName, 'paymentAmount', filter, startDate, endDate);
}

async function customCountAllPackage(id) {
  let query = DB(tableName)
    .whereNot('packageActivityStatus', ACTIVITY_STATUS.COMPLETED)
    .where('packageExpireDate', '>', new Date())
    .where('paymentServicePackageId', '=', id);
  return await query.count('* as count');
}

async function findGrantedPackage(id) {
  let query = DB(tableName)
    .whereNot('packageActivityStatus', ACTIVITY_STATUS.COMPLETED)
    .where('packageExpireDate', '>', new Date())
    .where('paymentServicePackageId', '=', id)
    .limit(100);
  return await query.select();
}

async function customCountDistinct(filter, distinctFields, startDate, endDate) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, undefined);

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.countDistinct(` ${distinctFields} as CountResult`).then(records => {
        if (records && records[0].sumResult === null) {
          resolve(undefined);
        } else {
          resolve(records);
        }
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${_field}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

function _makeQueryBuilderForReferedUser(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (filter && filter.appUserId) {
    const _appUserId = filter.appUserId;
    queryBuilder.where(function () {
      this.orWhere('memberReferIdF1', _appUserId).orWhere('memberReferIdF2', _appUserId).orWhere('memberReferIdF3', _appUserId);
      // .orWhere("memberReferIdF4", _appUserId)
      // .orWhere("memberReferIdF5", _appUserId);
    });
    delete filter.appUserId;
  }

  queryBuilder.where(filter);

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

async function findReferedUserByUserId(appUserId, skip, limit) {
  let queryBuilder = _makeQueryBuilderForReferedUser(
    {
      appUserId: appUserId,
    },
    skip,
    limit,
  );
  return await queryBuilder.select();
}

async function countReferedUserByUserId(filter) {
  let queryBuilder = _makeQueryBuilderForReferedUser(filter, undefined, undefined);
  return await queryBuilder.count(`${primaryKeyField} as count`);
}

async function sumReferedUserByUserId(appUserId, sumField, startDate, endDate) {
  let queryBuilder = _makeQueryBuilderForReferedUser(
    {
      appUserId: appUserId,
    },
    undefined,
    undefined,
    startDate,
    endDate,
  );
  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${sumField} as sumResult`).then(records => {
        if (records && records[0].sumResult === null) {
          resolve(0);
        } else {
          resolve(records);
        }
      });
    } catch (e) {
      Logger.error('ResourceAccess', `DB SUM ERROR: ${tableName} ${sumField}: ${JSON.stringify(filter)}`);
      Logger.error('ResourceAccess', e);
      reject(undefined);
    }
  });
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = JSON.parse(JSON.stringify(filter));

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`)
        .orWhere('companyName', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where(filterData);

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
  return await query.count(`${primaryKeyField} as count`);
}

async function customSum(sumField, filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return queryBuilder.sum(`${sumField} as sumResult`);
}

async function incrementBalance(id, field, amount) {
  return await Common.incrementFloat(tableName, primaryKeyField, id, `${field}`, amount);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  findById,
  deleteById,
  initDB,
  sumAmountDistinctByDate,
  customCountAllPackage,
  findGrantedPackage,
  customCountDistinct,
  customSearch,
  customCount,
  customSum,
  incrementBalance,
  findReferedUserByUserId,
  countReferedUserByUserId,
  sumReferedUserByUserId,
};
