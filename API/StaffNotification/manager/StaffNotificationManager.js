/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'user strict';

const Logger = require('../../../utils/logging');
const StaffNotificationResourceAccess = require('../resourceAccess/StaffNotificationResourceAccess');
const StaffNotificationView = require('../resourceAccess/StaffNotificationView');
const StaffNotificationFunctions = require('../StaffNotificationFunctions');
const { UNKNOWN_ERROR, POPULAR_ERROR } = require('../../Common/CommonConstant');

const _tableName = 'StaffNotification';

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const notifyData = req.payload;
      const result = await StaffNotificationFunctions.insertManyNotificationByMethod(notifyData);

      if (result) {
        return resolve(result);
      } else {
        return reject(POPULAR_ERROR.INSERT_FAILED);
      }
    } catch (e) {
      Logger.error(_tableName, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { filter, skip, limit, startDate, endDate, searchText, order } = req.payload;

      const notifyRecords = await StaffNotificationView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (notifyRecords) {
        const notifyCount = await StaffNotificationResourceAccess.customCount(filter, startDate, endDate, searchText, order);

        if (notifyCount) {
          return resolve({ data: notifyRecords, total: notifyCount[0].count });
        } else {
          return resolve({ data: [], total: 0 });
        }
      } else {
        return resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(_tableName, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const notifyId = req.payload.id;
      const result = await StaffNotificationView.findById(notifyId);

      if (result) {
        return resolve(result);
      } else {
        return reject(POPULAR_ERROR.RECORD_NOT_FOUND);
      }
    } catch (e) {
      Logger.error(_tableName, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.payload.id;

      const result = await StaffNotificationResourceAccess.deleteById(id);

      if (result === 1) {
        return resolve('success');
      } else {
        return reject(POPULAR_ERROR.DELETE_FAILED);
      }
    } catch (e) {
      Logger.error(_tableName, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

module.exports = { insert, find, findById, deleteById };
