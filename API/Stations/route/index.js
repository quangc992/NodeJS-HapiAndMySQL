/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Stations = require('./StationsRoute');
const Stations_User = require('./Stations_UserRoute');

module.exports = [
  //Station APIs
  { method: 'POST', path: '/Stations/insert', config: Stations.insert },
  { method: 'POST', path: '/Stations/find', config: Stations.find },
  { method: 'POST', path: '/Stations/findById', config: Stations.findById },
  { method: 'POST', path: '/Stations/findByUrl', config: Stations.findByUrl },
  { method: 'POST', path: '/Stations/updateById', config: Stations.updateById },
  { method: 'POST', path: '/Stations/deleteById', config: Stations.deleteById },

  // { method: 'POST', path: '/Stations/resetAllDefaultMp3', config: Stations.resetAllDefaultMp3 },
  // { method: 'POST', path: '/Stations/updateConfigSMTP', config: Stations.updateConfigSMTP},
  // { method: 'POST', path: '/Stations/updateConfigSMS', config: Stations.updateConfigSMS},
  // { method: 'POST', path: '/Stations/updateCustomSMTP', config: Stations.updateCustomSMTP},
  // { method: 'POST', path: '/Stations/updateCustomSMSBrand', config: Stations.updateCustomSMSBrand},
  // { method: 'POST', path: '/Stations/enableAdsForStation', config: Stations.enableAdsForStation},
  // { method: 'POST', path: '/Stations/updateLeftAdBanner', config: Stations.updateLeftAdBanner},
  // { method: 'POST', path: '/Stations/updateRightAdBanner', config: Stations.updateRightAdBanner},

  //Station USER APIs
  {
    method: 'POST',
    path: '/Stations/user/getList',
    config: Stations_User.userGetListStation,
  },
  {
    method: 'POST',
    path: '/Stations/user/getDetailById',
    config: Stations_User.userGetDetailStationById,
  },
];
