/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const GroupCustomerMessageResourceAccess = require('../resourceAccess/GroupCustomerMessageResourceAccess');
const Logger = require('../../../utils/logging');
const { MESSAGE_ERROR } = require('../CustomerMessageConstant');
const SystemMessageAutoSend = require('../cronjob/SystemMessageAutoSend');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerMessageData = req.payload;
      customerMessageData.stationsId = req.currentUser.stationsId;
      customerMessageData.staffId = req.currentUser.staffId;

      let result = await GroupCustomerMessageResourceAccess.insert(customerMessageData);
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

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      let result = await GroupCustomerMessageResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (result && result.length > 0) {
        let count = await GroupCustomerMessageResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
        resolve({ data: result, total: count[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerMessageId = req.payload.id;
      let customerMessageData = req.payload.data;
      let dataBefore = await GroupCustomerMessageResourceAccess.findById(customerMessageId);
      let result = await GroupCustomerMessageResourceAccess.updateById(customerMessageId, customerMessageData);

      if (result) {
        SystemAppLogFunctions.logCustomerRecordChanged(dataBefore, customerMessageData, req.currentUser);
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerMessageId = req.payload.id;
      let result = await GroupCustomerMessageResourceAccess.findById(customerMessageId);

      if (!result) {
        reject(MESSAGE_ERROR.MESSAGE_NOT_FOUND);
      } else {
        resolve(result);
      }
    } catch (e) {
      Logger.error(__filename, e);
      if (e === MESSAGE_ERROR.MESSAGE_NOT_FOUND) {
        reject(MESSAGE_ERROR.MESSAGE_NOT_FOUND);
      } else {
        reject('failed');
      }
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
};
