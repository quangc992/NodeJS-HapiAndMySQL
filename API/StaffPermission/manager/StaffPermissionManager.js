/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StaffPermissionResourceAccess = require('../resourceAccess/StaffPermissionResourceAccess');
const Logger = require('../../../utils/logging');
const { ERROR } = require('../../Common/CommonConstant');
async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let permission = await StaffPermissionResourceAccess.insert(req.payload);
      if (permission) {
        resolve('success');
      } else {
        console.error(`error permission can not insert`);
        reject('Failed');
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

      let permissions = await StaffPermissionResourceAccess.find(filter, skip, limit, order);
      let permissionsCount = await StaffPermissionResourceAccess.count(filter, order);
      if (permissions && permissionsCount) {
        resolve({ data: permissions, total: permissionsCount[0].count });
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
      resolve('success');
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
