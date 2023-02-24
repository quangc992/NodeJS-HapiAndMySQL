/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const AreaDirection = require('../resourceAccess/AreaDirectionResourceAccess');
const Logger = require('../../../utils/logging');
const { nonAccentVietnamese } = require('../../ApiUtils/utilFunctions');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let directionData = req.payload;
      let result = await AreaDirection.insert(directionData);
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

      let directions = await AreaDirection.find(filter, skip, limit, order);
      let directionsCount = await AreaDirection.count(filter, order);
      if (directions && directionsCount) {
        resolve({ data: directions, total: directionsCount[0].count });
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
      let directionId = req.payload.id;
      let directionData = req.payload.data;
      let result = await AreaDirection.updateById(directionId, directionData);
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
      let directionId = req.payload.id;
      let result = await AreaDirection.updateById(directionId, {
        isDeleted: 1,
      });
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
  deleteById,
  findById,
};
