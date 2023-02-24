/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StaffRoleResourceAccess = require('../resourceAccess/StaffRoleResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let staffRoleData = req.payload;
      let result = await StaffRoleResourceAccess.insert(staffRoleData);
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

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let staffRoles = await StaffRoleResourceAccess.customSearch(filter, skip, limit, order);
      let staffRolesCount = await StaffRoleResourceAccess.customCount(filter, order);
      if (staffRoles && staffRolesCount) {
        resolve({ data: staffRoles, total: staffRolesCount[0].count });
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
      let staffRoleId = req.payload.id;
      let staffRoleData = req.payload.data;
      let result = await StaffRoleResourceAccess.updateById(staffRoleId, staffRoleData);
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
