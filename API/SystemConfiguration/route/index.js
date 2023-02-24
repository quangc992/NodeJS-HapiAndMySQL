/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const SystemConfiguration = require('./SystemConfigurationRoute');

module.exports = [
  //System configuration APIs
  {
    method: 'POST',
    path: '/SystemConfiguration/find',
    config: SystemConfiguration.find,
  },
  {
    method: 'POST',
    path: '/SystemConfiguration/updateConfigs',
    config: SystemConfiguration.updateConfigs,
  },
];
