/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StationServicesResourceAccess = require('../resourceAccess/StationServicesResourceAccess');
const StationsResourceAccess = require('../../Stations/resourceAccess/StationsResourceAccess');
const Logger = require('../../../utils/logging');
const formatDate = require('../../ApiUtils/utilFunctions');
const ImageUtils = require('../../ApiUtils/imageUtilsFunctions');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationServicesData = req.payload;
      stationServicesData.stationsId = req.currentUser.stationsId;

      //xu ly tao ra thumbnail tu avatar (neu co cap nhat)
      if (stationServicesData.stationServicesAvatar) {
        let _thumbnailsUrl = await ImageUtils.createThumbnailsImage(stationServicesData.stationServicesAvatar);
        if (_thumbnailsUrl) {
          stationServicesData.stationServicesAvatarThumbnails = _thumbnailsUrl;
        }
      }

      let result = await StationServicesResourceAccess.insert(stationServicesData);
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

      if (!filter) {
        filter = {};
      }

      let stationServices = await StationServicesResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let stationServicesCount = await StationServicesResourceAccess.customCount(filter, startDate, endDate, searchText, order);
      if (stationServices && stationServicesCount) {
        resolve({ data: stationServices, total: stationServicesCount });
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
      let stationServicesId = req.payload.id;
      let stationServicesData = req.payload.data;

      //xu ly tao ra thumbnail tu avatar (neu co cap nhat)
      if (stationServicesData.stationServicesAvatar) {
        let _thumbnailsUrl = await ImageUtils.createThumbnailsImage(stationServicesData.stationServicesAvatar);
        if (_thumbnailsUrl) {
          stationServicesData.stationServicesAvatarThumbnails = _thumbnailsUrl;
        }
      }

      let result = await StationServicesResourceAccess.updateById(stationServicesId, stationServicesData);
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
      let stationServicesId = req.payload.id;
      let result = await StationServicesResourceAccess.findById(stationServicesId);
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
      let stationServicesId = req.payload.id;

      let result = await StationServicesResourceAccess.deleteById(stationServicesId);
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

async function userGetDetailProduct(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationServicesId = req.payload.id;
      let result = await StationServicesResourceAccess.findById(stationServicesId);
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

async function userGetListProduct(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let filter = req.payload.filter;
      let stationServices = await StationServicesResourceAccess.find(filter, skip, limit);

      if (stationServices && stationServices.length > 0) {
        let stationServicesCount = await StationServicesResourceAccess.count(filter);
        resolve({ data: stationServices, total: stationServicesCount });
      } else {
        resolve({ data: [], total: 0 });
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
  userGetDetailProduct,
  userGetListProduct,
  deleteById,
};
