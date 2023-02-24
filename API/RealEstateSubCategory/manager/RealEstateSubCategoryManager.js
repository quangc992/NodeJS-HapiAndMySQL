/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const RealEstateSubCategoryResourceAccess = require('../resourceAccess/RealEstateSubCategoryResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateSubCategory = req.payload;
      let result = await RealEstateSubCategoryResourceAccess.insert(realEstateSubCategory);
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

      let result = await RealEstateSubCategoryResourceAccess.find(filter, skip, limit, order);
      let resultCount = await RealEstateSubCategoryResourceAccess.count(filter, order);
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
      let realEstateSubCategoryId = req.payload.id;
      let realEstateSubCategoryData = req.payload.data;
      let result = await RealEstateSubCategoryResourceAccess.updateById(realEstateSubCategoryId, realEstateSubCategoryData);
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
      let realEstateSubCategoryId = req.payload.id;
      let result = await RealEstateSubCategoryResourceAccess.findById(realEstateSubCategoryId);
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
      let realEstateSubCategoryId = req.payload.id;
      let result = await RealEstateSubCategoryResourceAccess.deleteById(realEstateSubCategoryId);
      if (result) {
        resolve(result);
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
};
