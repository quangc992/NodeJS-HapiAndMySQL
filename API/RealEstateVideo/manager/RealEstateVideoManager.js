/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const RealEstateVideoResourceAccess = require('../resourceAccess/RealEstateVideoResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateVideo = req.payload;
      let result = await RealEstateVideoResourceAccess.insert(realEstateVideo);
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

      let result = await RealEstateVideoResourceAccess.find(filter, skip, limit, order);
      let resultCount = await RealEstateVideoResourceAccess.count(filter, order);
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
      let realEstateVideoId = req.payload.id;
      let realEstateVideoData = req.payload.data;
      let result = await RealEstateVideoResourceAccess.updateById(realEstateVideoId, realEstateVideoData);
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
      let realEstateVideoId = req.payload.id;
      let result = await RealEstateVideoResourceAccess.findById(realEstateVideoId);
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
      let realEstateVideoId = req.payload.id;
      let result = await RealEstateVideoResourceAccess.deleteById(realEstateVideoId);
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
