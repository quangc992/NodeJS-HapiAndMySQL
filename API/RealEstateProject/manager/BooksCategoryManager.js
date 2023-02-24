/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const BooksCategoryResourceAccess = require('../resourceAccess/BooksCategoryResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let booksCategoryData = req.payload;
      let result = await BooksCategoryResourceAccess.insert(booksCategoryData);
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

      let booksCategorys = await BooksCategoryResourceAccess.find(filter, skip, limit, order);
      let booksCategorysCount = await BooksCategoryResourceAccess.count(filter, order);
      if (booksCategorys && booksCategorysCount) {
        resolve({ data: booksCategorys, total: booksCategorysCount[0].count });
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
      let booksCategoryId = req.payload.id;
      let booksCategoryData = req.payload.data;
      let result = await BooksCategoryResourceAccess.updateById(booksCategoryId, booksCategoryData);
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
