/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const SystemConfigurations = require('./SystemConfigurationsRoute');

module.exports = [
  //System configuration APIs
  {
    method: 'POST',
    path: '/SystemConfigurations/find',
    config: SystemConfigurations.find,
  },
  {
    method: 'POST',
    path: '/SystemConfigurations/updateConfigs',
    config: SystemConfigurations.updateConfigs,
  },
  {
    method: 'POST',
    path: '/SystemConfigurations/user/getDetail',
    config: SystemConfigurations.userGetDetail,
  },
];
