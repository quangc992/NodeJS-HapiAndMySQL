/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const Logger = require('../../../utils/logging');
const { UNKNOWN_ERROR } = require('../../Common/CommonConstant');
const CameraSectionResourceAccess = require('../resourceAccess/CameraSectionResourceAccess');
const StationsResourceAccess = require('../../Stations/resourceAccess/StationsResourceAccess');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let cameraData = req.payload;
      cameraData.stationId = req.currentUser.stationId;

      if (!req.currentUser.stationId) {
        console.error(`invalid stationId`);
        reject(UNKNOWN_ERROR);
        return;
      }

      let insertResult = await CameraSectionResourceAccess.insert(cameraData);
      if (insertResult) {
        resolve(insertResult);
      } else {
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
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
      let startDate = undefined;
      let endDate = undefined;
      let camera = await CameraSectionResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (camera && camera.length > 0) {
        let cameraCount = await CameraSectionResourceAccess.customCount(filter, undefined, undefined, startDate, endDate, searchText, order);

        for (let item of camera) {
          item.stationName = await getStationNameCameraSection(item);
        }

        resolve({ data: camera, total: cameraCount });
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
      let cameraId = req.payload.id;
      let cameraData = req.payload.data;

      let result = await CameraSectionResourceAccess.updateById(cameraId, cameraData);
      if (result) {
        resolve(result);
      } else {
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let cameraId = req.payload.id;
      let cameraData = await CameraSectionResourceAccess.findById(cameraId);
      if (cameraData) {
        let station = await StationsResourceAccess.findById(cameraData.stationId);
        if (station) {
          cameraData.stationName = station.stationsName;
        }
        resolve(cameraData);
      } else {
        console.error(`error camera cannot findById with cameraId ${cameraId}: ${UNKNOWN_ERROR}`);
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let cameraId = req.payload.id;

      let result = await CameraSectionResourceAccess.deleteById(cameraId);
      if (result) {
        resolve(result);
      } else {
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function create(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let cameraData = req.payload;
      cameraData.stationId = req.currentUser.stationsId;

      if (!req.currentUser.stationsId) {
        console.error(`invalid req.currentUser.stationsId`);
        reject(UNKNOWN_ERROR);
        return;
      }

      let insertResult = await CameraSectionResourceAccess.insert(cameraData);
      if (insertResult) {
        resolve(insertResult);
      } else {
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function getList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      if (!filter) {
        filter = {};
      }
      filter.stationId = req.currentUser.stationsId;

      let cameraCount = await CameraSectionResourceAccess.customCount(filter);

      if (cameraCount && cameraCount > 0) {
        let camera = await CameraSectionResourceAccess.customSearch(filter);
        resolve({ data: camera, total: cameraCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function userUpdateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let cameraId = req.payload.id;
      let cameraData = req.payload.data;
      let cameraBeforeUpdate = await CameraSectionResourceAccess.findById(cameraId);
      if (!cameraBeforeUpdate) {
        reject('CAMERA_NOT_FOUND');
        return;
      }
      if (cameraBeforeUpdate.stationId !== req.currentUser.stationsId) {
        reject('PERMISSION_DENIED');
        return;
      }
      let result = await CameraSectionResourceAccess.updateById(cameraId, cameraData);
      if (result) {
        resolve(result);
      } else {
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function getDetailById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let cameraId = req.payload.id;
      let stationsId = req.currentUser.stationsId;

      let cameraData = await CameraSectionResourceAccess.find({
        cameraId: cameraId,
        stationId: stationsId,
      });
      if (cameraData && cameraData.length > 0) {
        resolve(cameraData[0]);
      } else {
        console.error(`error camera cannot findById with cameraId ${cameraId}: ${UNKNOWN_ERROR}`);
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function userDeleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let cameraId = req.payload.id;
      let cameraBeforeUpdate = await CameraSectionResourceAccess.findById(cameraId);
      if (!cameraBeforeUpdate) {
        reject('CAMERA_NOT_FOUND');
        return;
      }
      if (cameraBeforeUpdate.stationId !== req.currentUser.stationsId) {
        reject('PERMISSION_DENIED');
        return;
      }
      let result = await CameraSectionResourceAccess.deleteById(cameraId);
      if (result) {
        resolve(result);
      } else {
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function getStationNameCameraSection(camera, storeStationName = {}) {
  if (camera && camera.stationId) {
    let stationId = camera.stationId;
    let stationName = '';
    if (storeStationName && storeStationName.hasOwnProperty(stationId)) {
      // kiểm tra stationName trong storeStaionName
      stationName = storeStationName[stationId]; // get stationName
      return stationName;
    } else {
      let station = await StationsResourceAccess.findById(stationId);
      stationName = station.stationsName;
      storeStationName[stationId] = stationName; // set stationName với key là stationId
      return stationName;
    }
  } else {
    return undefined;
  }
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  deleteById,
  create,
  userUpdateById,
  userDeleteById,
  getList,
  getDetailById,
};
