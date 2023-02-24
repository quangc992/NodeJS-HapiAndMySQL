/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const SystemConfigurationsResourceAccess = require('../resourceAccess/SystemConfigurationsResourceAccess');
const SystemConfigurationsFunction = require('../SystemConfigurationsFunction');
const Logger = require('../../../utils/logging');

async function statisticalFAC() {
  console.log('update systemconfig');
  return new Promise(async (resolve, reject) => {
    try {
      let dataUpdate = {};
      dataUpdate.totalWorkingServicePackages = await SystemConfigurationsFunction.totalUserExploitFAC();
      dataUpdate.totalBetRecordWinAmount = await SystemConfigurationsFunction.totalExploitFAC();
      let config = await SystemConfigurationsResourceAccess.find({}, 0, 1);
      if (dataUpdate.totalWorkingServicePackages <= config[0].totalWorkingServicePackages) {
        dataUpdate.totalWorkingServicePackages = config[0].totalWorkingServicePackages;
      }
      if (dataUpdate.totalBetRecordWinAmount <= config[0].totalBetRecordWinAmount) {
        dataUpdate.totalBetRecordWinAmount = config[0].totalBetRecordWinAmount;
      }
      let result = await SystemConfigurationsResourceAccess.updateById(config[0].systemConfigurationsId, dataUpdate);
      if (result) {
        resolve('DONE');
        Logger.info(`DONE`);
      } else {
        reject('failed');
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function updateCurrentStage() {
  const moment = require('moment');
  let _systemConfigurations = await SystemConfigurationsFunction.getSystemConfig();
  let today = moment().format(`YYYY/MM/DD`);
  let currentStage = _systemConfigurations.packageCurrentStage;
  let newStage = undefined;

  if (currentStage === 1 && today > _systemConfigurations.stage1LastDate) {
    newStage = 2;
  } else if (currentStage === 2 && today > _systemConfigurations.stage2LastDate) {
    newStage = 3;
  } else if (currentStage === 3 && today > _systemConfigurations.stage3LastDate) {
    newStage = 4;
  } else if (currentStage === 4 && today > _systemConfigurations.stage4LastDate) {
    newStage = 5;
  } else if (currentStage === 5 && today > _systemConfigurations.stage5LastDate) {
    newStage = 5;
  }

  if (newStage) {
    await SystemConfigurationsResourceAccess.updateById(_systemConfigurations.systemConfigurationsId, {
      packageCurrentStage: newStage,
    });
    const PackageFunction = require('../../PaymentServicePackage/PaymentServicePackageFunctions');
    await PackageFunction.regenerateAllPresalePackage();
  }
}

module.exports = {
  statisticalFAC,
  updateCurrentStage,
};
