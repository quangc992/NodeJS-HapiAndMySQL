/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const SystemConfigurationResourceAccess = require('../resourceAccess/SystemConfigurationResourceAccess');
const Logger = require('../../../utils/logging');

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await SystemConfigurationResourceAccess.find();

      if (data) {
        resolve({ data: data, total: 1 });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let config = await SystemConfigurationResourceAccess.find();
      let data = req.payload.data;
      let result = await SystemConfigurationResourceAccess.updateById(config[0].systemConfigurationId, data);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  find,
  updateById,
};
