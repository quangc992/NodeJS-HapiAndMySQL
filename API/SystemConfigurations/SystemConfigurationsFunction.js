/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const SystemConfigurationsResourceAccess = require('./resourceAccess/SystemConfigurationsResourceAccess');
async function getSystemConfig() {
  let config = await SystemConfigurationsResourceAccess.find({}, 0, 1);
  if (config && config.length > 0) {
    return config[0];
  }
  return undefined;
}
module.exports = {
  getSystemConfig,
};
