/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { PAYMENT_TYPE } = require('../PaymentMethodConstant');
const tableName = 'PaymentMethod';
const primaryKeyField = 'paymentMethodId';

async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('paymentMethodId').primary();
          table.string('paymentMethodName');
          table.integer('paymentMethodType').defaultTo(PAYMENT_TYPE.USDT);
          table.string('paymentMethodIdentityNumber');
          table.string('paymentMethodReferName');
          table.string('paymentMethodReceiverName');
          table.string('paymentMethodImageUrl');
          timestamps(table);
          table.index('paymentMethodId');
          table.index('paymentMethodName');
        })
        .then(async () => {
          console.log(`${tableName} table created done`);
          let paymentMethods = [
            {
              paymentMethodName: 'USDT',
              paymentMethodIdentityNumber: '',
              paymentMethodReferName: '',
              paymentMethodReceiverName: 'TA6xG4AYZ9r6Lu98CH9ucy7y9Tu8Gj9m44',
              paymentMethodType: PAYMENT_TYPE.TRC20,
            },
          ];

          DB(`${tableName}`)
            .insert(paymentMethods)
            .then(result => {
              console.log(`init ${tableName}` + result);
              resolve();
            });
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
  filter.isDeleted = 0;
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  deleteById,
};
