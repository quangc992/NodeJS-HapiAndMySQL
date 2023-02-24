/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const CustomerMealRecordResourceAccess = require('../resourceAccess/CustomerMealRecordResourceAccess');
const Logger = require('../../../utils/logging');

async function _addNewCustomerMealRecord(mealData) {
  let result = await CustomerMealRecordResourceAccess.insert(mealData);
  if (result) {
    return result;
  }

  return undefined;
}

async function userInsertMealRecord(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerRecordData = req.payload;
      customerRecordData.appUserId = req.currentUser.appUserId;

      let addResult = await _addNewCustomerMealRecord(customerRecordData);
      if (addResult) {
        resolve(addResult);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetListMealRecord(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      if (!filter) {
        filter = {};
      }

      if (req.currentUser.appUserId) {
        filter.appUserId = req.currentUser.appUserId;
      }

      let customerRecord = await CustomerMealRecordResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (customerRecord && customerRecord.length > 0) {
        let customerRecordCount = await CustomerMealRecordResourceAccess.customCount(filter, startDate, endDate, searchText, order);
        resolve({ data: customerRecord, total: customerRecordCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userUpdateMealRecord(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerRecordId = req.payload.id;
      let customerRecordData = req.payload.data;

      let result = await CustomerMealRecordResourceAccess.updateById(customerRecordId, customerRecordData);
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

async function userGetDetailMealRecordById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerRecordId = req.payload.id;
      let result = await CustomerMealRecordResourceAccess.findById(customerRecordId);

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

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerRecordId = req.payload.id;

      let oldRecord = await CustomerMealRecordResourceAccess.findById(customerRecordId);
      if (oldRecord === undefined) {
        reject('invalid record');
        return;
      }

      let result = await CustomerMealRecordResourceAccess.deleteById(customerRecordId);
      if (result) {
        await CustomerFuntion.notifyCustomerStatusDeleted(oldRecord);
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

async function staffGetDetailMealRecordById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerRecordId = req.payload.id;
      let result = await CustomerMealRecordResourceAccess.findById(customerRecordId);

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

async function staffGetListMealRecordByUserId(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      if (!filter) {
        filter = {};
      }

      let customerRecord = await CustomerMealRecordResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (customerRecord && customerRecord.length > 0) {
        let customerRecordCount = await CustomerMealRecordResourceAccess.customCount(filter, startDate, endDate, searchText, order);
        resolve({ data: customerRecord, total: customerRecordCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
module.exports = {
  userInsertMealRecord,
  userGetListMealRecord,
  userUpdateMealRecord,
  userGetDetailMealRecordById,
  deleteById,
  staffGetListMealRecordByUserId,
  staffGetDetailMealRecordById,
};
