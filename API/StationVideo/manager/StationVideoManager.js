/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Logger = require('../../../utils/logging');
const StationVideoResourceAccess = require('../resourceAccess/StationVideoResourceAccess');
const StationVideoFunction = require('../StationVideoFunctions');
const StationVideoView = require('../resourceAccess/StationVideoView');
const { UNKNOWN_ERROR } = require('../../Common/CommonConstant');
const UploadFunctions = require('../../Upload/UploadFunctions');
const StationsResourceAccess = require('../resourceAccess/StationVideoResourceAccess');
const StationsFunctions = require('../../Stations/StationsFunctions');
const { STATION_VIDEO_ERROR } = require('../StationVideoConstants');
const moment = require('moment');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let staff = req.currentUser;
      let stationVideo = req.payload;
      const stationApiKeyFromQueryURL = req.query.stationApiKey;
      const stationApiKeyFromHeader = req.headers.stationapikey;
      const host = req.headers.host;
      const stationApiKey = stationApiKeyFromHeader || stationApiKeyFromQueryURL;

      let station;

      if (stationApiKey) {
        station = await StationsFunctions.findStationByApiKey(stationApiKey);
      } else {
        station = await StationsFunctions.findStationByWebhookUrl(host);
      }

      if (station) {
        stationVideo.stationsId = station.stationsId;
      } else {
        return reject('STATION NOT FOUND !');
      }

      if (staff) {
        stationVideo.staffId = staff.staffId;
        stationVideo.uploaderName = staff.username;
      }
      let result = await StationVideoResourceAccess.insert(stationVideo);

      if (result && result.length > 0) {
        resolve(result);
      } else {
        console.error(`error StationVideoFunction insert failed: ${UNKNOWN_ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error('error StationVideoFunction insert StationVideo', e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationVideoId = req.payload.id;
      let dataUpdate = req.payload.data;
      let result = await StationVideoResourceAccess.updateById(stationVideoId, dataUpdate);
      if (result) {
        resolve(result);
      } else {
        console.error(`error StationVideoFunction updateById with stationVideoId ${stationVideoId}: ${UNKNOWN_ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error('error StationVideoFunction updateById StationVideo', e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationVideoId = req.payload.id;
      let result = await StationVideoResourceAccess.findById(stationVideoId);
      if (result) {
        resolve(result);
      } else {
        console.error(`error cannot found StationVideoFunction findById with stationVideoId ${stationVideoId}`);
        reject('failed');
      }
    } catch (e) {
      console.error('error cannot StationVideoFunction findById StationVideo', e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationVideoId = req.payload.id;

      let result = await StationVideoResourceAccess.deleteById(stationVideoId);
      if (result) {
        resolve(result);
      } else {
        console.error(`error StationVideoFunction deleteById with stationVideoId ${stationVideoId}: ${UNKNOWN_ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(__filename, e);
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
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = undefined;
      let stationVideos = await StationVideoView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      if (stationVideos && stationVideos.length > 0) {
        let stationVideosCount = await StationVideoView.customCount(filter, undefined, undefined, startDate, endDate, searchText, order);
        resolve({ data: stationVideos, total: stationVideosCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      console.error(__filename, e);
      reject('failed');
    }
  });
}

async function uploadCameraVideo(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const videoData = req.payload.videoData;
      const videoFormat = req.payload.videoFormat;
      let uploadCameraId = req.payload.uploadCameraId;
      let staffId = req.currentUser.staffId;
      let appUserId = req.currentUser.appUserId;
      let stationsId = req.currentUser.stationsId;
      if (!videoData) {
        console.error(`error uploadMediaFile: do not have book data`);
        reject('do not have image data');
        return;
      }

      var originaldata = Buffer.from(videoData, 'base64');
      let newMediaUrl = await UploadFunctions.uploadMediaFile(originaldata, videoFormat, undefined, {
        uploadCameraId: uploadCameraId,
        uploadAppUserId: appUserId,
        uploadStaffId: staffId,
        uploadStationId: stationsId,
      });
      if (newMediaUrl) {
        let _newStationVideo = {
          stationsId: stationsId,
          videoName: `Video_${uploadCameraId}_${moment().format('YYYYMMDDHHmm')}`,
          uploaderName: req.currentUser.username,
          staffId: req.currentUser.staffId,
          appUserId: req.currentUser.appUserId,
          uploadFileName: `Video_${uploadCameraId}_${moment().format('YYYYMMDDHHmm')}`,
          uploadVideoUrl: newMediaUrl,
          uploadFileExtension: 'mp4',
          uploadFileSize: originaldata.length,
          stationVideoNote: 'Hệ thống tự upload',
        };
        await StationVideoResourceAccess.insert(_newStationVideo);
        resolve(newMediaUrl);
      } else {
        console.error(`error uploadMediaFile: ${UNKNOWN_ERROR}`);
        reject('failed to upload');
      }
    } catch (error) {
      console.error(__filename, error);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function exportExcelStationVideo(req) {
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
          console.error(`error cannot find station with stationsId ${filter.stationsId}`);
          reject(STATION_VIDEO_ERROR.CAN_NOT_FIND_STATION_VIDEO);
        }
      } else {
        filter.stationsId = req.currentUser.stationsId;
      }
      let stationVideoCount = await StationVideoView.customCount(filter, skip, limit, startDate, endDate, searchText, order);
      if (stationVideoCount) {
        let stationVideoTotal = [];
        // mỗi lần chỉ lấy 10 record
        let count = stationVideoCount >= 10 ? stationVideoCount / 10 : 1; // nếu bản ghi < 10 thì count =  1

        for (let i = 0; i <= count; i++) {
          let skip = 10 * i;
          let stationVideos = await StationVideoView.customSearch(filter, skip, 10, startDate, endDate, searchText, order);
          if (stationVideos) {
            stationVideoTotal.push(...stationVideos);
          }
        }
        if (stationVideoTotal.length > 0) {
          let fileName = 'DSV_' + moment().format('YYYYMMDDHHmm') + '_' + req.currentUser.staffId + '.xlsx';
          const filepath = 'uploads/exportExcel/' + fileName;

          let newData = await StationVideoFunction.exportStationVideoToExcel(stationVideoTotal, filepath, station);
          if (newData) {
            let newExcelUrl = 'https://' + process.env.HOST_NAME + '/' + filepath;
            resolve(newExcelUrl);
          } else {
            console.error(`error exportStationVideo : ${UNKNOWN_ERROR}`);
            reject(UNKNOWN_ERROR);
          }
        } else {
          console.error(`error exportStationVideo: ${STATION_VIDEO_ERROR.NO_DATA}`);
          reject(STATION_VIDEO_ERROR.NO_DATA);
        }
      } else {
        console.error(`error exportStationVideo: ${STATION_VIDEO_ERROR.NO_DATA}`);
        reject(STATION_VIDEO_ERROR.NO_DATA);
      }
    } catch (e) {
      if (e === STATION_VIDEO_ERROR.NO_DATA) {
        console.error(`error`, e);
        reject(STATION_VIDEO_ERROR.NO_DATA);
      } else if (e === STATION_VIDEO_ERROR.CAN_NOT_FIND_STATION_VIDEO) {
        console.error(`error`, e);
        reject(STATION_VIDEO_ERROR.CAN_NOT_FIND_STATION_VIDEO);
      } else {
        console.error(__filename, e);
        reject(UNKNOWN_ERROR);
      }
    }
  });
}

async function _storeVideo(station, payload) {
  console.log(`_storeVideo`);
  console.log(payload);
  return new Promise(async (resolve, reject) => {
    const fs = require('fs');
    let dirName = `uploads/media/video/station_${station.stationsId}/${moment().format('YYYYMMDD')}`;
    if (payload.video !== undefined && payload.video.path !== undefined) {
      fs.readFile(payload.video.path, (err, data) => {
        if (err) {
          console.error('writeFile error');
          console.error(err);
          resolve(undefined);
          return;
        }

        // check if upload directory exists
        if (fs.existsSync(`uploads/media/video`) === false) {
          fs.mkdirSync(`uploads/media/video`);
        }

        // check if upload directory exists
        if (fs.existsSync(`uploads/media/video/station_${station.stationsId}`) === false) {
          fs.mkdirSync(`uploads/media/video/station_${station.stationsId}`);
        }

        // check if directory exists
        if (fs.existsSync(dirName) === false) {
          fs.mkdirSync(dirName);
        }

        let newFileName = `station_${station.stationsId}_${payload.video.filename}`;

        //write file to storage
        fs.writeFile(`${dirName}/${newFileName}`, data, async writeErr => {
          if (writeErr) {
            console.error('writeFile error');
            console.error(writeErr);
            resolve(undefined);
            return;
          }
          resolve(`https://${process.env.HOST_NAME}/${dirName}/${newFileName}`);
          return;
        });
      });
    } else {
      resolve(undefined);
    }
  });
}

//BEWARE !! This API is use for robot
async function uploadCameraVideoMultipart(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let payload = req.payload;
      const StationResource = require('../../Stations/resourceAccess/StationsResourceAccess');
      let station = await StationResource.findById(req.currentUser.stationsId);

      //retry to find config with
      if (!station) {
        console.info(`can not find station by id ${req.currentUser.stationsId} for robotInsert`);
        reject('CAN_NOT_FIND_STATION');
        return;
      }

      let storeResult = await _storeVideo(station, payload);

      if (storeResult) {
        let _newStationVideo = {
          stationsId: station.stationsId,
          videoName: `${station.stationCode}_${payload.video.filename}`,
          uploaderName: req.currentUser.username,
          staffId: req.currentUser.staffId,
          appUserId: req.currentUser.appUserId,
          uploadFileName: `${station.stationCode}_${payload.video.filename}`,
          uploadVideoUrl: storeResult,
          uploadFileExtension: 'mp4',
          uploadFileSize: payload.video.bytes / 1024 / 1024, //store in Megabytes Mb
          stationVideoNote: 'Hệ thống tự upload',
        };
        await StationVideoResourceAccess.insert(_newStationVideo);
        resolve(storeResult);
      } else {
        console.error(`error robotInsert Customer Record: ${UNKNOWN_ERROR}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
module.exports = {
  insert,
  updateById,
  findById,
  deleteById,
  find,
  uploadCameraVideo,
  exportExcelStationVideo,
  uploadCameraVideoMultipart,
};
