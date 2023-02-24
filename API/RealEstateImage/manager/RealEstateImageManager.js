/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const RealEstateImageResourceAccess = require('../resourceAccess/RealEstateImageResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(realEstateImage) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await RealEstateImageResourceAccess.insert(realEstateImage);
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

      let result = await RealEstateImageResourceAccess.find(filter, skip, limit, order);
      let resultCount = await RealEstateImageResourceAccess.count(filter, order);
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
      let realEstateImageId = req.payload.id;
      let realEstateImageData = req.payload.data;
      let result = await RealEstateImageResourceAccess.updateById(realEstateImageId, realEstateImageData);
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
      let realEstateImageId = req.payload.id;
      let result = await RealEstateImageResourceAccess.findById(realEstateImageId);
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
      let realEstateImageId = req.payload.id;
      let result = await RealEstateImageResourceAccess.deleteById(realEstateImageId);
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
