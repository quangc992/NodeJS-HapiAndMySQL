/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const CommonPlaceResourceAccess = require('../../CommonPlace/resourceAccess/CommonPlaceResourceAccess');
const CommonPlaceView = require('../../CommonPlace/resourceAccess/CommonPlaceView');
const Logger = require('../../../utils/logging');
const { parseIntArray } = require('../../Common/CommonFunctions');
const { verifyAreaPermission } = require('../../Common/CommonFunctions');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      data.areaCountryId = 1;
      let result = await CommonPlaceResourceAccess.insert(data);
      if (result) {
        resolve(result);
      } else {
        reject('Cannot insert data');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getCommonPlace(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let order = req.payload.order;
      let limit = req.payload.limit;
      let result = await CommonPlaceView.customSearch(filter, skip, limit, order);
      let resultCount = await CommonPlaceView.customCount(filter, order);
      if (result && resultCount) {
        resolve({ data: result, total: resultCount[0].count });
      } else {
        reject('Cannot find data');
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
      let order = req.payload.order;
      let limit = req.payload.limit;
      const staff = req.currentUser;
      if (staff.roleId !== 1) {
        filter.areaCountryId = parseIntArray(staff.areaCountryId);
        filter.areaProvinceId = parseIntArray(staff.areaProvinceId);
        filter.areaDistrictId = parseIntArray(staff.areaDistrict);
        filter.areaWardId = parseIntArray(staff.areaWard);
      }
      let result = await CommonPlaceView.customSearch(filter, skip, limit, order);
      let resultCount = await CommonPlaceView.customCount(filter, order);
      if (result && resultCount) {
        resolve({ data: result, total: resultCount[0].count });
      } else {
        reject('Cannot find data');
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
      let data = req.payload.data;
      let id = req.payload.commonPlaceId;
      if (!req.currentUser.roleId) reject("Don't have permission");
      if (req.currentUser.roleId !== 1) {
        let find = await CommonPlaceResourceAccess.find({ commonPlaceId: id });
        if (!find) reject('error');
        if (find && find.length === 0) reject('error');

        const verifyPermission = verifyAreaPermission(req.currentUser, find[0]);
        if (!verifyPermission) reject("Don't have permission");
      }

      let result = await CommonPlaceResourceAccess.updateById(id, data);
      if (result) {
        resolve('OK');
      } else {
        reject('Cannot update data');
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
      let id = req.payload.commonPlaceId;
      if (!req.currentUser.roleId) reject("Don't have permission");
      if (req.currentUser.roleId !== 1) {
        let find = await CommonPlaceResourceAccess.find({ commonPlaceId: id });
        if (!find) reject('error');
        if (find && find.length === 0) reject('error');

        const verifyPermission = verifyAreaPermission(req.currentUser, find[0]);
        if (!verifyPermission) reject("Don't have permission");
      }

      let result = await CommonPlaceResourceAccess.updateById(id, {
        isDeleted: 1,
      });
      if (result) {
        resolve('OK');
      } else {
        reject('Cannot update data');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  getCommonPlace,
  find,
  updateById,
  deleteById,
  insert,
};
