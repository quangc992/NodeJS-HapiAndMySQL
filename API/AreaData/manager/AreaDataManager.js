/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const AreaDataResourceAccess = require('../resourceAccess/AreaDataResourceAccess');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let areaData = req.payload;
      areaData.areaDataType = areaData.areaDataType.toUpperCase();
      let result = await AreaDataResourceAccess.insert(areaData);
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

      let areas = await AreaDataResourceAccess.customSearch(filter, skip, limit, order);
      let areasCount = await AreaDataResourceAccess.customCount(filter, order);
      if (areas && areasCount) {
        resolve({ data: areas, total: areasCount[0].count });
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
      let areaId = req.payload.id;
      let areaData = req.payload.data;
      let result = await AreaDataResourceAccess.updateById(areaId, areaData);
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
      let areaId = req.payload.id;
      let result = await AreaDataResourceAccess.updateById(areaId, {
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
async function statisticalViews(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let areas = await AreaDataResourceAccess.customSearch(filter, skip, limit, order);
      let areasCount = await AreaDataResourceAccess.customCount(filter, order);
      let resultTotalDayViews = await AreaDataResourceAccess.sum('dayViews', filter, order);
      let resultTotalWeekViews = await AreaDataResourceAccess.sum('weekViews', filter, order);
      let resultTtotalMonthViews = await AreaDataResourceAccess.sum('monthViews', filter, order);
      let resultTotalYearViews = await AreaDataResourceAccess.sum('yearViews', filter, order);
      let resultTotalViews = await AreaDataResourceAccess.sum('totalViews', filter, order);
      if (areas && areasCount && resultTotalDayViews && resultTotalWeekViews && resultTtotalMonthViews && resultTotalYearViews && resultTotalViews) {
        let totalDayViews = resultTotalDayViews[0].sumResult;
        let totalWeekViews = resultTotalWeekViews[0].sumResult;
        let totalMonthViews = resultTtotalMonthViews[0].sumResult;
        let totalYearViews = resultTotalYearViews[0].sumResult;
        let totalViews = resultTotalViews[0].sumResult;
        resolve({
          data: areas,
          total: areasCount[0].count,
          totalDayViews: totalDayViews,
          totalWeekViews: totalWeekViews,
          totalMonthViews: totalMonthViews,
          totalYearViews: totalYearViews,
          totalViews: totalViews,
        });
      } else {
        resolve({
          data: [],
          total: 0,
          totalDayViews: 0,
          totalWeekViews: 0,
          totalMonthViews: 0,
          totalYearViews: 0,
          totalViews: 0,
        });
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
  deleteById,
  findById,
  statisticalViews,
};
