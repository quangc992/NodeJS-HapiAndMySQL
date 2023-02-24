/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const PaymentRecordResourceAccess = require('../resourceAccess/PaymentRecordResourceAccess');
const Logger = require('../../../utils/logging');

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

      let paymentRecords = await PaymentRecordResourceAccess.customSearch(filter, skip, limit, startDate, endDate, order);
      let paymentRecordsCount = await PaymentRecordResourceAccess.customCount(filter, startDate, endDate, order);
      if (paymentRecords && paymentRecordsCount) {
        resolve({ data: paymentRecords, total: paymentRecordsCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentRecordId = req.payload.id;
      let result = await PaymentRecordResourceAccess.findById(paymentRecordId);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  find,
  findById,
};
