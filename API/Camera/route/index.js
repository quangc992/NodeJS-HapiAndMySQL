/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const CameraRoute = require('./CameraRoute');

module.exports = [
  { method: 'POST', path: '/Camera/insert', config: CameraRoute.insert },
  { method: 'POST', path: '/Camera/find', config: CameraRoute.find },
  { method: 'POST', path: '/Camera/findById', config: CameraRoute.findById },
  { method: 'POST', path: '/Camera/deleteById', config: CameraRoute.deleteById },
  { method: 'POST', path: '/Camera/updateById', config: CameraRoute.updateById },

  { method: 'POST', path: '/Camera/user/create', config: CameraRoute.create },
  { method: 'POST', path: '/Camera/user/getList', config: CameraRoute.getList },
  { method: 'POST', path: '/Camera/user/getDetailById', config: CameraRoute.getDetailById },
  { method: 'POST', path: '/Camera/user/deleteById', config: CameraRoute.userDeleteById },
  { method: 'POST', path: '/Camera/user/updateById', config: CameraRoute.userUpdateById },
];
