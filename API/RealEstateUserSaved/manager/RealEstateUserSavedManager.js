/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const RealEstateUserSaved = require('../resourceAccess/RealEstateUserSavedResourceAccess');
const Logger = require('../../../utils/logging');
const RealEstateUserSavedViews = require('../resourceAccess/RealEstateUserSavedViews');
const RealEstateFunctions = require('../../RealEstate/RealEstateFunctions');
async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateUserSavedData = {
        realEstateId: req.payload.realEstateId,
        appUserIdSaved: req.currentUser.appUserId,
      };
      let resultIsDeleted = await RealEstateUserSaved.updateById(realEstateUserSavedData, { isDeleted: 0 });
      if (resultIsDeleted) {
        resolve('Success');
      } else {
        let result = await RealEstateUserSaved.insert(realEstateUserSavedData);
        if (result) {
          resolve('Success');
        } else {
          reject('failed');
        }
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
      let result = await RealEstateUserSaved.find(filter, skip, limit, order);
      let resultCount = await RealEstateUserSaved.count(filter, order);
      if (result && resultCount) {
        resolve({ data: result, total: resultCount[0].count });
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
      let realEstateUserSavedId = req.payload.id;
      let realEstatePostTypeData = req.payload.data;
      let result = await RealEstateUserSaved.updateById(realEstateUserSavedId, realEstatePostTypeData);
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
      let realEstateUserSavedId = req.payload.id;
      let result = await RealEstateUserSaved.findById(realEstateUserSavedId);
      if (result) {
        resolve(result);
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
      let appUserIdSaved = req.currentUser.appUserId;
      let realEstateId = req.payload.realEstateId;
      let result = await RealEstateUserSaved.deleteById(appUserIdSaved, realEstateId);
      if (result) {
        resolve(result);
      } else {
        resolve({ data: [] });
      }
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
      if (filter === undefined) {
        filter = {};
      }
      let filterClause = req.payload.filterClause;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      filter.appUserIdSaved = req.currentUser.appUserId;
      let result = await RealEstateUserSavedViews.customSearch(filter, filterClause, skip, limit, startDate, endDate, searchText, order);
      let resultCount = await RealEstateUserSavedViews.customCount(filter, filterClause, startDate, endDate, searchText, order);
      if (result && resultCount) {
        resolve({ data: result, total: resultCount[0].count });
        for (var i = 0; i < result.length; i++) {
          // function tăng lượt xem,
          await RealEstateFunctions.viewsRealEstate(result[i].realEstateId, result[i]);
        }
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
  insert,
  find,
  updateById,
  findById,
  deleteById,
  getList,
};
