/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StationProductsResourceAccess = require('../resourceAccess/StationProductsResourceAccess');
const StationsResourceAccess = require('../../Stations/resourceAccess/StationsResourceAccess');
const Logger = require('../../../utils/logging');
const formatDate = require('../../ApiUtils/utilFunctions');
const ImageUtils = require('../../ApiUtils/imageUtilsFunctions');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationProductsData = req.payload;

      if (req.currentUser.stationsId) {
        stationProductsData.stationsId = req.currentUser.stationsId;
      }

      //xu ly cap nhat thumbnail neu co update avatar
      if (stationProductsData.stationProductsAvatar) {
        let _thumbnailsUrl = await ImageUtils.createThumbnailsImage(stationProductsData.stationProductsAvatar);
        if (_thumbnailsUrl) {
          stationProductsData.stationProductsAvatarThumbnails = _thumbnailsUrl;
        }
      }

      let result = await StationProductsResourceAccess.insert(stationProductsData);
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

      let stationProducts = await StationProductsResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let stationProductsCount = await StationProductsResourceAccess.customCount(filter, startDate, endDate, searchText, order);
      if (stationProducts && stationProductsCount) {
        resolve({ data: stationProducts, total: stationProductsCount });
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
      let stationProductsId = req.payload.id;
      let stationProductsData = req.payload.data;

      //xu ly cap nhat thumbnail neu co update avatar
      if (stationProductsData.stationProductsAvatar) {
        let _thumbnailsUrl = await ImageUtils.createThumbnailsImage(stationProductsData.stationProductsAvatar);
        if (_thumbnailsUrl) {
          stationProductsData.stationProductsAvatarThumbnails = _thumbnailsUrl;
        }
      }

      let result = await StationProductsResourceAccess.updateById(stationProductsId, stationProductsData);
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
      let stationProductsId = req.payload.id;
      let result = await StationProductsResourceAccess.findById(stationProductsId);
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
      let stationProductsId = req.payload.id;

      let result = await StationProductsResourceAccess.deleteById(stationProductsId);
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
      let stationProductsId = req.payload.id;
      let result = await StationProductsResourceAccess.findById(stationProductsId);
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
      let stationProducts = await StationProductsResourceAccess.find(filter, skip, limit);
      console.log(filter);
      if (stationProducts && stationProducts.length > 0) {
        let stationProductsCount = await StationProductsResourceAccess.count(filter);
        resolve({ data: stationProducts, total: stationProductsCount });
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
