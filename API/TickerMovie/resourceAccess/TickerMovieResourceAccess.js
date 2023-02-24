'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'TickerMovie';
const primaryKeyField = 'TickerMovieId';
const { SHOW_TIME, PAYMENT_METHOD, DEFAULT_NAME, DEFAULT_PRICE, DEFAULT_SEATNUMBER,DEFAULT_MOVIENAME } = require('../TickerMovieConstant');
const Logger = require('../../../utils/logging');

async function createTable() {
  console.info(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    try {
      // gán default DB để sử dụng tạm thời
      await DB.schema.dropTableIfExists(`${tableName}`);
      await DB.schema.createTable(`${tableName}`, function (table) {
        table.increments('TickerMovieId').primary();
        table.string('MovieNameId').defaultTo(DEFAULT_MOVIENAME);
        table.string('ShowtimeId').defaultTo(SHOW_TIME.TIME_07);
        table.integer('SeatNumber').defaultTo(DEFAULT_SEATNUMBER);
        table.float('Price').defaultTo(DEFAULT_PRICE);
        table.string('CustomerName').defaultTo(DEFAULT_NAME);
        table.string('PaymentMethod').defaultTo(PAYMENT_METHOD.VND);
        timestamps(table);
        table.index('TickerMovieId');
        table.index('MovieNameId');
        table.index('ShowtimeId');
        table.index('SeatNumber');
        table.index('Price');
        table.index('CustomerName');
        table.index('PaymentMethod');
      });
      Logger.info(`${tableName}`, `${tableName} table created done`);
      resolve();
    } catch (error) {
      reject(error);
    }
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

async function countAll() {
  return await Common.count(tableName, primaryKeyField);
}

async function findById(id) {
  return await Common.findById(tableName, id);
}

async function updateById(id, data) {
  let dataId = { [primaryKeyField]: id };
  return await Common.updateById(tableName, dataId, data);
}

async function deleteById(id) {
  // return await Common.DeleteById(tableName, id); - chưa cần thiết
  return await Common.permanentlyDeleteById(tableName, id); 
}

module.exports = {
  insert,
  find,
  countAll,
  updateById,
  initDB,
  findById,
  deleteById
};
