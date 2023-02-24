/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StakingResourceAccess = require('../resourceAccess/StakingPackageResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      let result = await StakingResourceAccess.insert(data);
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
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      let listStaking = await StakingResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (listStaking && listStaking.length > 0) {
        let listStakingCount = await StakingResourceAccess.customCount(filter, startDate, endDate, searchText, order);

        resolve({ data: listStaking, total: listStakingCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await StakingResourceAccess.findById(req.payload.id);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
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
      let id = req.payload.id;
      let data = req.payload.data;

      if (data.packageDiscountPrice !== null && data.packageDiscountPrice < 1) {
        Logger.error(`invalid packageDiscountPrice`);
        reject('INVALID_DISCOUNT_PRICE');
        return;
      }

      let result = await StakingResourceAccess.updateById(id, data);
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

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await StakingResourceAccess.deleteById(req.payload.id);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  find,
  findById,
  updateById,
  deleteById,
  insert,
};
