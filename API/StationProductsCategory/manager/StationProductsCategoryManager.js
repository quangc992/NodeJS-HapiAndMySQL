/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StationProductsCategoryResourceAccess = require('../resourceAccess/StationProductsCategoryResourceAccess');
const StationsResourceAccess = require('../../Stations/resourceAccess/StationsResourceAccess');
const ProductCategoryFunctions = require('../StationProductsCategoryFunctions');

const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationProductsCategoryData = req.payload;

      let allCategoryCount = await StationProductsCategoryResourceAccess.count({});
      if (allCategoryCount && allCategoryCount.length > 0) {
        allCategoryCount = allCategoryCount[0].count;
        stationProductsCategoryData.displayIndex = allCategoryCount;
      }

      let result = await StationProductsCategoryResourceAccess.insert(stationProductsCategoryData);

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

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;
      let endDate = req.payload.endDate;
      let startDate = req.payload.startDate;

      let stationProductsCategory = await StationProductsCategoryResourceAccess.customSearch(
        filter,
        skip,
        limit,
        startDate,
        endDate,
        searchText,
        order,
      );

      if (stationProductsCategory && stationProductsCategory.length > 0) {
        let stationProductsCategoryCount = await StationProductsCategoryResourceAccess.customCount(filter, startDate, endDate, searchText, order);
        resolve({
          data: stationProductsCategory,
          total: stationProductsCategoryCount[0].count,
        });
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
      let stationProductsCategoryId = req.payload.id;
      let stationProductsCategoryData = req.payload.data;
      let result = await StationProductsCategoryResourceAccess.updateById(stationProductsCategoryId, stationProductsCategoryData);
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

async function updateDisplayIndexById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationProductsCategoryId = req.payload.id;
      let newIndex = req.payload.data.displayIndex;
      let result = await ProductCategoryFunctions.updateCategoriesIndex(stationProductsCategoryId, newIndex);
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

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationProductsCategoryId = req.payload.id;
      let result = await StationProductsCategoryResourceAccess.findById(stationProductsCategoryId);
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

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationProductsCategoryId = req.payload.id;

      let result = await StationProductsCategoryResourceAccess.deleteById(stationProductsCategoryId);
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

async function userGetListProductCategory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let stationUrl = req.payload.stationsUrl;
      let station = undefined;
      let filter = {};

      //retry to find config with
      if (stationUrl && (!station || station.length <= 0)) {
        station = await StationsResourceAccess.find({ stationUrl: stationUrl }, 0, 1);
      }

      //retry to find config with
      if (stationUrl && (!station || station.length <= 0)) {
        station = await StationsResourceAccess.find({ stationLandingPageUrl: stationUrl }, 0, 1);
      }

      if (station && station.length > 0) {
        station = station[0];
        filter = {
          stationsId: station.stationsId,
        };
      }

      let _categoryOrder = {
        key: 'displayIndex',
        value: 'asc',
      };

      let stationProductsCategory = await StationProductsCategoryResourceAccess.find(filter, skip, limit, _categoryOrder);

      if (stationProductsCategory && stationProductsCategory.length > 0) {
        let stationProductsCategoryCount = await StationProductsCategoryResourceAccess.count(filter);
        resolve({
          data: stationProductsCategory,
          total: stationProductsCategoryCount[0].count,
        });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch {
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
  updateDisplayIndexById,
  userGetListProductCategory,
};
