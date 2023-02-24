/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StationVideo = require('./StationVideoRoute');

module.exports = [
  { method: 'POST', path: '/StationVideo/insert', config: StationVideo.insert },
  { method: 'POST', path: '/StationVideo/updateById', config: StationVideo.updateById },
  { method: 'POST', path: '/StationVideo/findById', config: StationVideo.findById },
  { method: 'POST', path: '/StationVideo/deleteById', config: StationVideo.deleteById },
  { method: 'POST', path: '/StationVideo/find', config: StationVideo.find },
  { method: 'POST', path: '/StationVideo/uploadCameraVideo', config: StationVideo.uploadCameraVideo },
  { method: 'POST', path: '/StationVideo/uploadCameraVideoMultipart', config: StationVideo.uploadCameraVideoMultipart },
  { method: 'POST', path: '/StationVideo/exportExcel', config: StationVideo.exportExcelStationVideo },
];
