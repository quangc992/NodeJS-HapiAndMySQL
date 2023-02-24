/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const AppUserRecordRoute = require('./AppUserRecordRoute');

module.exports = [
  { method: 'POST', path: '/AppUserRecordRoute/insert', config: AppUserRecordRoute.insert },
  { method: 'POST', path: '/AppUserRecordRoute/updateById', config: AppUserRecordRoute.updateById },
  { method: 'POST', path: '/AppUserRecordRoute/deleteById', config: AppUserRecordRoute.deleteById },
  { method: 'POST', path: '/AppUserRecordRoute/findById', config: AppUserRecordRoute.findById },
  { method: 'POST', path: '/AppUserRecordRoute/find', config: AppUserRecordRoute.find },
  {
    method: 'POST',
    path: '/AppUserRecordRoute/exportExcelAppUserRecord',
    config: AppUserRecordRoute.exportExcelAppUserRecord,
  },
];
