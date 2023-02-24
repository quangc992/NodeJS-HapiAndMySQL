/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const GroupStaffNotificationResourceAccess = require('../resourceAccess/GroupStaffNotificationResourceAccess');
const GroupStaffNotificationFunctions = require('../StaffNotificationFunctions');
const Logger = require('../../../utils/logging');
const { UNKNOWN_ERROR, POPULAR_ERROR } = require('../../Common/CommonConstant');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const notificationData = req.payload;
      notificationData.stationsId = req.currentUser.stationsId;
      const result = await GroupStaffNotificationFunctions.insertGroupNotification(notificationData);
      if (result) {
        resolve(result);
      } else {
        reject(POPULAR_ERROR.INSERT_FAILED);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { filter, skip, limit, startDate, endDate, searchText, order } = req.payload;

      const groupNotificationRecords = await GroupStaffNotificationResourceAccess.customSearch(
        filter,
        skip,
        limit,
        startDate,
        endDate,
        searchText,
        order,
      );

      if (groupNotificationRecords && groupNotificationRecords.length > 0) {
        const groupNotificationCount = await GroupStaffNotificationResourceAccess.customCount(filter, startDate, endDate, searchText, order);
        resolve({ data: groupNotificationRecords, total: groupNotificationCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await GroupStaffNotificationResourceAccess.findById(id);
      if (result) {
        resolve(result);
      }
      reject(POPULAR_ERROR.RECORD_NOT_FOUND);
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

module.exports = {
  insert,
  find,
  findById,
};
