/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'user strict';
const StationDocumentsResourceAccess = require('../resourceAccess/StationDocumentsResourceAccess');
const StationDocumentsView = require('../resourceAccess/StationDocumentsView');
const StationsFunctions = require('../../Stations/StationsFunctions');
const { RECORD_ERRORS } = require('../StationDocumentsConstants');
const { UNKNOWN_ERROR, NOT_ENOUGH_AUTHORITY } = require('../../Common/CommonConstant');

const _tableName = 'StationDocuments';

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const stationDocumentsData = req.payload;
      const { staffId } = req.currentUser;
      if (staffId) {
        stationDocumentsData.createdByStaffId = staffId;
      }

      const result = await StationDocumentsResourceAccess.insert(stationDocumentsData);
      if (result) {
        return resolve(result);
      } else {
        return reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      _createErrorResponse(`error ${_tableName} insert failed ${e}`, reject, UNKNOWN_ERROR);
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { filter, skip, limit, startDate, endDate, order, searchText } = req.payload;
      const allowedStationIds = req.allowedStationIds;
      const { stationsId } = filter;

      if (!allowedStationIds || !allowedStationIds.includes(stationsId)) {
        return reject(NOT_ENOUGH_AUTHORITY);
      }

      const stationDocumentsCount = await StationDocumentsView.customCount(filter, startDate, endDate, searchText, order);

      if (stationDocumentsCount) {
        const stationDocumentsRecords = await StationDocumentsView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

        if (stationDocumentsRecords) {
          return resolve({ data: stationDocumentsRecords, total: stationDocumentsCount });
        } else {
          return resolve({ data: [], total: 0 });
        }
      } else {
        return resolve({ data: [], total: 0 });
      }
    } catch (e) {
      _createErrorResponse(`error ${_tableName} select failed ${e}`, reject, UNKNOWN_ERROR);
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const stationDocumentsId = req.payload.id;
      const result = await StationDocumentsView.findById(stationDocumentsId);

      if (result) {
        return resolve(result);
      } else {
        return _createErrorResponse(`cannot find stationDocuments with id ${stationDocumentsId}`, reject, RECORD_ERRORS.RECORD_NOT_FOUND);
      }
    } catch (e) {
      _createErrorResponse(`error ${_tableName} select by id failed ${e}`, reject, UNKNOWN_ERROR);
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const stationDocumentsId = req.payload.id;

      const oldRecord = await StationDocumentsResourceAccess.findById(stationDocumentsId);

      if (!oldRecord) {
        return _createErrorResponse(`error delete record StationDocuments have id  ${stationDocumentsId}`, reject, RECORD_ERRORS.INVALID_RECORD);
      } else {
        const result = await StationDocumentsResourceAccess.deleteById(stationDocumentsId);
        if (result === 1) {
          return resolve('success');
        } else {
          return reject(UNKNOWN_ERROR);
        }
      }
    } catch (e) {
      _createErrorResponse(`error ${_tableName} delete by id failed ${e}`, reject, UNKNOWN_ERROR);
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const stationDocumentsId = req.payload.id;
      const updateData = req.payload.data;

      const targetRecord = await StationDocumentsResourceAccess.findById(stationDocumentsId);

      if (targetRecord) {
        const result = await StationDocumentsResourceAccess.updateById(stationDocumentsId, updateData);
        if (result && result !== 0) {
          return resolve('success');
        } else {
          return _createErrorResponse(`update stationDocuments by id ${stationDocumentsId} failure !`, reject, UNKNOWN_ERROR);
        }
      } else {
        return _createErrorResponse(`cannot find stationDocuments with id ${stationDocumentsId}`, reject, RECORD_ERRORS.RECORD_NOT_FOUND);
      }
    } catch (e) {
      _createErrorResponse(`error ${_tableName} update by id failed ${e}!`, reject, UNKNOWN_ERROR);
    }
  });
}

function _createErrorResponse(errorMessage, reject, rejectErrorMessage) {
  console.error(errorMessage);
  reject(rejectErrorMessage);
}

module.exports = { insert, find, findById, deleteById, updateById };
