/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const AppUserRecordView = require('../resourceAccess/AppUserRecordView');
const AppUserRecordResourceAccess = require('../resourceAccess/AppUserRecordResourceAccess');
const StationsResourceAccess = require('../../Stations/resourceAccess/StationsResourceAccess');
const AppUserFunctions = require('../AppUserRecordFunction');
const { UNKNOWN_ERROR } = require('../../Common/CommonConstant');
const { APP_USER_ERROR } = require('../AppUserConstant');
const moment = require('moment');
const { resolve } = require('path');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserRecord = req.payload;
      let startWork = appUserRecord.startWork;
      let finishWork = appUserRecord.finishWork;
      let isDateTimeWorkValid = await _checkValidDateTimeWork(startWork, finishWork);

      if (isDateTimeWorkValid) {
        let appUserRecordId = await AppUserRecordResourceAccess.insert(appUserRecord);

        if (appUserRecordId) {
          resolve(appUserRecordId);
        } else {
          console.error(`error cannot insert appUserRecordId: ${UNKNOWN_ERROR}`);
          reject(UNKNOWN_ERROR);
        }
      } else {
        console.error(`error cannot insert appUserRecordId: startWork ${startWork} is must before finishWork ${finishWork}`);
        reject(APP_USER_ERROR.STARTWORK_BEFORE_FINISHWORK);
      }
    } catch (e) {
      console.error('error AppUserRecord insert failed', e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserRecordId = req.payload.id;
      let appUserRecordUpdate = req.payload.data;
      let startWork = appUserRecordUpdate.startWork;
      let finishWork = appUserRecordUpdate.finishWork;
      //  let isDateTimeWorkValid = true;

      let appUserRecord = await AppUserRecordResourceAccess.findById(appUserRecordId);
      if (appUserRecord) {
        if (startWork && finishWork) {
          let isDateTimeWorkValid = await _checkValidDateTimeWork(startWork, finishWork);

          if (isDateTimeWorkValid === APP_USER_ERROR.STARTWORK_BEFORE_FINISHWORK) {
            reject(APP_USER_ERROR.STARTWORK_BEFORE_FINISHWORK);
          }
        } else {
          if (startWork || finishWork) {
            let defaultDateTimeWork = {
              startWork: appUserRecord.startWork,
              finishWork: appUserRecord.finishWork,
            };

            let finalDatimeWork = undefined;
            finalDatimeWork = await _setStartWork(defaultDateTimeWork, startWork);
            finalDatimeWork = await _setFinishWork(defaultDateTimeWork, finishWork);

            let isDateTimeWorkValid = await _checkValidDateTimeWork(finalDatimeWork.startWork, finalDatimeWork.finishWork);

            if (isDateTimeWorkValid !== APP_USER_ERROR.STARTWORK_BEFORE_FINISHWORK) {
              appUserRecordUpdate.startWork = finalDatimeWork.startWork;
              appUserRecordUpdate.finishWork = finalDatimeWork.finishWork;
            }
          }
        }

        let result = await AppUserRecordResourceAccess.updateById(appUserRecordId, appUserRecordUpdate);
        if (result) {
          resolve('success');
        } else {
          console.error(`error cannot update appUserRecordId with id ${appUserRecordId}: ${UNKNOWN_ERROR}`);
          reject(UNKNOWN_ERROR);
        }
      } else {
        console.error(`cannot find appUserRecordId with id ${appUserRecordId}`);
        reject(APP_USER_ERROR.CAN_NOT_FIND_APP_USER_RECORD);
      }
    } catch (e) {
      if (e === APP_USER_ERROR.STARTWORK_BEFORE_FINISHWORK) {
        console.error('error AppUserRecord update failed', e);
        reject(APP_USER_ERROR.STARTWORK_BEFORE_FINISHWORK);
      } else if (e === APP_USER_ERROR.CAN_NOT_FIND_APP_USER_RECORD) {
        console.error('error', e);
        reject(APP_USER_ERROR.CAN_NOT_FIND_APP_USER_RECORD);
      } else {
        console.error('error AppUserRecord update failed', e);
        reject(UNKNOWN_ERROR);
      }
    }
  });
}

function _checkValidDateTimeWork(startWork, finishWork) {
  return new Promise((resolve, reject) => {
    let isValid = moment(startWork).isBefore(moment(finishWork));
    if (isValid) {
      resolve(isValid);
    } else {
      console.error(`error  appUserRecordId: startWork ${startWork} is must before finishWork ${startWork}`);
      reject(APP_USER_ERROR.STARTWORK_BEFORE_FINISHWORK);
    }
  });
}

async function _setStartWork(defaultDateTimeWork, startWork) {
  return new Promise(async (resolve, reject) => {
    if (startWork) {
      let finalDatimeWork = await _setDefaultDateTimeWork(defaultDateTimeWork, { startWork: startWork });
      resolve(finalDatimeWork);
    } else {
      resolve(defaultDateTimeWork);
    }
  });
}

async function _setFinishWork(defaultDateTimeWork, finishWork) {
  return new Promise(async (resolve, reject) => {
    if (finishWork) {
      let finalDatimeWork = await _setDefaultDateTimeWork(defaultDateTimeWork, { finishWork: finishWork });
      resolve(finalDatimeWork);
    } else {
      resolve(defaultDateTimeWork);
    }
  });
}

function _setDefaultDateTimeWork(defaultDateTimeWork, valueDateTimeWork) {
  return new Promise((resolve, reject) => {
    if (valueDateTimeWork) {
      let finalDatimeWork = Object.assign(defaultDateTimeWork, valueDateTimeWork);
      resolve(finalDatimeWork);
    } else {
      resolve(defaultDateTimeWork);
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserRecordId = req.payload.id;

      let result = await AppUserRecordResourceAccess.deleteById(appUserRecordId);
      if (result) {
        resolve(result);
      } else {
        console.error(`error AppUserRecord deleteById with id ${appUserRecordId}: ${UNKNOWN_ERROR}`);
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserRecordId = req.payload.id;
      let result = await AppUserRecordView.findById(appUserRecordId);
      if (result) {
        resolve(result);
      } else {
        console.error(`error cannot found AppUserRecord findById with appUserRecordId ${appUserRecordId}: ${UNKNOWN_ERROR}`);
        reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      console.error('error cannot AppUserRecord findById', e);
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
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      let appUserRecordCount = await AppUserRecordView.customCount(filter, undefined, undefined, startDate, endDate, searchText, order);

      if (appUserRecordCount) {
        let appUserRecords = await AppUserRecordView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
        console.log(appUserRecords);
        resolve({ data: appUserRecords, total: appUserRecordCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function exportExcelAppUserRecord(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let skip = undefined;
      let limit = undefined;
      let order = undefined;
      let station = undefined;

      if (filter && filter.stationsId) {
        station = await StationsResourceAccess.findById(filter.stationsId);
        if (station === undefined) {
          console.error(`error cannot find station with stationId ${filter.stationsId}`);
          reject(APP_USER_ERROR.CAN_NOT_FIND_STATION_RECORD);
        }
      }

      let appUserRecordCount = await AppUserRecordView.customCount(filter, skip, limit, startDate, endDate, searchText, order);
      if (appUserRecordCount) {
        let appUserRecordTotal = [];
        // mỗi lần chỉ lấy 10 record
        let count = appUserRecordCount >= 10 ? appUserRecordCount / 10 : 1; // nếu bản ghi < 10 thì count =  1

        for (let i = 0; i <= count; i++) {
          let skip = 10 * i;
          let appUserRecord = await AppUserRecordView.customSearch(filter, skip, 10, startDate, endDate, searchText, order);
          if (appUserRecord) {
            appUserRecordTotal.push(...appUserRecord);
          }
        }

        if (appUserRecordTotal.length > 0) {
          let fileName = 'DSCC_' + moment().format('YYYYMMDDHHmm') + '_' + req.currentUser.staffId + '.xlsx';
          const filepath = 'uploads/exportExcel/' + fileName;

          let newData = await AppUserFunctions.exportAppUserRecordToExcel(appUserRecordTotal, filepath, station);
          if (newData) {
            let newExcelUrl = 'https://' + process.env.HOST_NAME + '/' + filepath;
            resolve(newExcelUrl);
          } else {
            console.error(`error exportAppUserRecord : ${UNKNOWN_ERROR}`);
            reject(UNKNOWN_ERROR);
          }
        } else {
          console.error(`error exportAppUserRecord: ${APP_USER_ERROR.NO_DATA}`);
          reject(APP_USER_ERROR.NO_DATA);
        }
      }
    } catch (e) {
      if (e === APP_USER_ERROR.NO_DATA) {
        console.error(`error`, e);
        reject(APP_USER_ERROR.NO_DATA);
      } else if (e === APP_USER_ERROR.CAN_NOT_FIND_STATION_RECORD) {
        console.error(`error`, e);
        reject(APP_USER_ERROR.CAN_NOT_FIND_STATION_RECORD);
      } else {
        console.error(__filename, e);
        reject(UNKNOWN_ERROR);
      }
    }
  });
}

module.exports = {
  insert,
  updateById,
  deleteById,
  findById,
  find,
  exportExcelAppUserRecord,
};
