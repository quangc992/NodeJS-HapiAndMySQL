/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const RealEstateUtilitiesResourceAccess = require('../resourceAccess/RealEstateUtilitiesResourceAccess');

const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      let result = await RealEstateUtilitiesResourceAccess.insert(data);
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

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let result = await RealEstateUtilitiesResourceAccess.customSearch(filter, skip, limit, order);
      let resultCount = await RealEstateUtilitiesResourceAccess.customCount(filter, order);
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
      let id = req.payload.realEstateUtilitiesId;
      let result = await RealEstateUtilitiesResourceAccess.updateById(id, data);
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
      let id = req.payload.realEstateUtilitiesId;
      let result = await RealEstateUtilitiesResourceAccess.updateById(id, {
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
  find,
  updateById,
  deleteById,
  insert,
};
