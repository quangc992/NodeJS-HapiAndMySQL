/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { WITHDRAW_TRX_STATUS, WITHDRAW_TRX_CATEGORY, WITHDRAW_TRX_UNIT, WITHDRAW_TRX_TYPE } = require('../PaymentWithdrawTransactionConstant');
const tableName = 'PaymentWithdrawTransaction';
const primaryKeyField = 'paymentWithdrawTransactionId';
async function createTable() {
  console.info(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('paymentWithdrawTransactionId').primary();
          table.integer('appUserId');
          table.integer('walletId');
          table.integer('referId'); // nguoi gioi thieu
          table.integer('paymentMethodId');
          table.float('paymentAmount', 48, 24).defaultTo(0); //số tiền rút
          table.float('balanceBefore', 48, 24).defaultTo(0);
          table.float('balanceAfter', 48, 24).defaultTo(0);
          table.float('paymentRewardAmount', 48, 24).defaultTo(0); //số tiền được thưởng
          table.float('paymentRefAmount', 48, 24).defaultTo(0); //số tiền quy đổi hoặc tham chiếu
          table.string('paymentUnit').defaultTo(WITHDRAW_TRX_UNIT.VND); //don vi tien
          table.string('paymentType').defaultTo(WITHDRAW_TRX_TYPE.USER_WITHDRAW);
          table.string('paymentStatus').defaultTo(WITHDRAW_TRX_STATUS.NEW);
          table.string('paymentCategory').defaultTo(WITHDRAW_TRX_CATEGORY.BANK);
          table.string('paymentNote').defaultTo(''); //Ghi chu
          table.string('paymentRef').defaultTo(''); //Ma hoa don,ma giao dich thuc te
          table.string('paymentOwner').defaultTo(''); //ten nguoi gui, ten tai khoan
          table.string('paymentOriginSource').defaultTo(''); //ten ngan hang, ten mang (blockchain)
          table.string('paymentOriginName').defaultTo(''); //so tai khoan, dia chi vi
          table.timestamp('paymentApproveDate', { useTz: true }); // ngay duyet
          table.integer('paymentPICId'); // nguoi duyet
          table.integer('paymentStaffId'); // nguoi tạo, người quản lý
          table.float('paymentFeeAmount', 48, 24).defaultTo(0); //fee rút tiền cần chuyển

          timestamps(table);
          table.index('appUserId');
          table.index('walletId');
          table.index('referId');
        })
        .then(() => {
          console.info(`${tableName} table created done`);
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

async function customSum(sumField, filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  queryBuilder.where(filterData);

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where({
    paymentStatus: WITHDRAW_TRX_STATUS.COMPLETED,
  });

  return new Promise((resolve, reject) => {
    try {
      queryBuilder.sum(`${sumField} as sumResult`).then(records => {
        if (records && records[0].sumResult === null) {
          resolve(undefined);
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

async function sumAmountDistinctByDate(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByDate(tableName, 'paymentAmount', filter, startDate, endDate);
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  customSum,
  sumAmountDistinctByDate,
  findById,
};
