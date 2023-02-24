/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const SystemAppLogResource = require('../resourceAccess/SystemAppChangedLogResourceAccess');
const Logger = require('../../../utils/logging');
const { UNKNOWN_ERROR } = require('../../Common/CommonConstant');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let systemAppLogData = req.payload;
      let result = await SystemAppLogResource.insert(systemAppLogData);
      if (result) {
        resolve(result);
      }
      console.error(`error SystemAppChangedLog insert failed: ${UNKNOWN_ERROR}`);
      reject('failed');
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

      let systemAppLogs = await SystemAppLogResource.find(filter, skip, limit, order);
      let systemAppLogsCount = await SystemAppLogResource.count(filter, order);
      if (systemAppLogs && systemAppLogsCount) {
        resolve({ data: systemAppLogs, total: systemAppLogsCount[0].count });
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
      let systemAppLogId = req.payload.id;
      let systemAppLogData = req.payload.data;
      let result = await SystemAppLogResource.updateById(systemAppLogId, systemAppLogData);
      if (result) {
        resolve(result);
      }
      console.error(`error SystemAppChangedLog updateById failed with systemAppLogId ${systemAppLogId}: ${UNKNOWN_ERROR}`);
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
      resolve('success');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
};
