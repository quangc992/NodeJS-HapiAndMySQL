/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StationNewsResourceAccess = require('../resourceAccess/StationNewsResourceAccess');
const StationsResourceAccess = require('../../Stations/resourceAccess/StationsResourceAccess');
const Logger = require('../../../utils/logging');
const formatDate = require('../../ApiUtils/utilFunctions');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationNewsData = req.payload;
      stationNewsData.stationsId = req.currentUser.stationsId;
      let result = await StationNewsResourceAccess.insert(stationNewsData);
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
      let searchText = req.payload.searchText;
      let endDate = req.payload.endDate;
      let startDate = req.payload.startDate;
      if (endDate) {
        endDate = formatDate.FormatDate(endDate);
      }
      if (startDate) {
        startDate = formatDate.FormatDate(startDate);
      }
      //only get data of current station
      if (filter && req.currentUser.stationsId) {
        filter.stationsId = req.currentUser.stationsId;
      }
      let stationNews = await StationNewsResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let stationNewsCount = await StationNewsResourceAccess.customCount(filter, startDate, endDate, searchText, order);
      if (stationNews && stationNewsCount) {
        resolve({ data: stationNews, total: stationNewsCount });
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
      let stationNewsId = req.payload.id;
      let stationNewsData = req.payload.data;
      let result = await StationNewsResourceAccess.updateById(stationNewsId, stationNewsData);
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
      let stationNewsId = req.payload.id;
      let result = await StationNewsResourceAccess.findById(stationNewsId);
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

async function getNewsDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationNewsId = req.payload.id;
      let result = await StationNewsResourceAccess.findById(stationNewsId);
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

async function getNewList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let stationUrl = req.payload.stationsUrl;
      let station = await StationsResourceAccess.find({
        stationUrl: stationUrl,
      });
      if (station && station.length > 0) {
        let stationNews = await StationNewsResourceAccess.find({ stationsId: station[0].stationsId }, skip, limit);
        let stationNewsCount = await StationNewsResourceAccess.count({
          stationsId: station[0].stationsId,
        });
        if (stationNews && stationNewsCount) {
          resolve({ data: stationNews, total: stationNewsCount });
        } else {
          resolve({ data: [], total: 0 });
        }
      }
      reject('failed');
    } catch {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationNewsId = req.payload.id;

      let result = await StationNewsResourceAccess.deleteById(stationNewsId);
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

async function getHotNewList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let stationUrl = req.payload.stationsUrl;
      let station = await StationsResourceAccess.find({
        stationUrl: stationUrl,
      });
      let order = {
        key: 'totalViewed',
        value: 'desc',
      };
      if (station && station.length > 0) {
        let stationNews = await StationNewsResourceAccess.find({ stationsId: station[0].stationsId }, skip, limit, order);
        let stationNewsCount = await StationNewsResourceAccess.count({
          stationsId: station[0].stationsId,
        });
        if (stationNews && stationNewsCount) {
          resolve({ data: stationNews, total: stationNewsCount });
        } else {
          resolve({ data: [], total: 0 });
        }
      }
      reject('failed');
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
  getNewsDetail,
  getNewList,
  deleteById,
  getHotNewList,
};
