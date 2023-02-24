/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const RealEstatePostTypeResourceAccess = require('../resourceAccess/RealEstatePostTypeResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstatePostType = req.payload;
      let result = await RealEstatePostTypeResourceAccess.insert(realEstatePostType);
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

      let result = await RealEstatePostTypeResourceAccess.find(filter, skip, limit, order);
      let resultCount = await RealEstatePostTypeResourceAccess.count(filter, order);
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
      let realEstatePostTypeId = req.payload.id;
      let realEstatePostTypeData = req.payload.data;
      let result = await RealEstatePostTypeResourceAccess.updateById(realEstatePostTypeId, realEstatePostTypeData);
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
      let realEstatePostTypeId = req.payload.id;
      let result = await RealEstatePostTypeResourceAccess.findById(realEstatePostTypeId);
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
      let realEstatePostTypeId = req.payload.id;
      let result = await RealEstatePostTypeResourceAccess.deleteById(realEstatePostTypeId);
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
