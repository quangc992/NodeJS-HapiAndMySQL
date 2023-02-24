/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const PaymentMethodResourceAccess = require('../resourceAccess/PaymentMethodResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentMethodData = req.payload;
      let result = await PaymentMethodResourceAccess.insert(paymentMethodData);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      if (filter === undefined) {
        filter = {};
      }
      let paymentMethods = await PaymentMethodResourceAccess.find(filter, skip, limit, order);
      let paymentMethodsCount = await PaymentMethodResourceAccess.count(filter, order);
      if (paymentMethods && paymentMethodsCount) {
        resolve({ data: paymentMethods, total: paymentMethodsCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentMethodId = req.payload.id;
      let paymentMethodData = req.payload.data;
      let result = await PaymentMethodResourceAccess.updateById(paymentMethodId, paymentMethodData);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentMethodId = req.payload.id;
      let result = await PaymentMethodResourceAccess.find({ paymentMethodId: paymentMethodId });
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}
async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await PaymentMethodResourceAccess.deleteById(id);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      if (filter === undefined) {
        filter = {};
      }
      let paymentMethods = await PaymentMethodResourceAccess.find(filter, skip, limit, order);

      if (paymentMethods && paymentMethods.length > 0) {
        let paymentMethodsCount = await PaymentMethodResourceAccess.count(filter, order);

        resolve({ data: paymentMethods, total: paymentMethodsCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}
module.exports = {
  insert,
  find,
  updateById,
  findById,
  deleteById,
  getList,
};
