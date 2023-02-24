/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const CameraSectionRoute = require('./CameraSectionRoute');

module.exports = [
  { method: 'POST', path: '/CameraSection/user/create', config: CameraSectionRoute.create },
  { method: 'POST', path: '/CameraSection/user/getList', config: CameraSectionRoute.getList },
  { method: 'POST', path: '/CameraSection/user/getDetailById', config: CameraSectionRoute.getDetailById },
  { method: 'POST', path: '/CameraSection/user/deleteById', config: CameraSectionRoute.userDeleteById },
  { method: 'POST', path: '/CameraSection/user/updateById', config: CameraSectionRoute.userUpdateById },
];
