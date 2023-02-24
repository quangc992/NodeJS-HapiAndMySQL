/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const { CronInstance, executeJob } = require('../ThirdParty/Cronjob/CronInstance');
const Logger = require('../utils/logging');

async function startSchedule() {
  Logger.info('startSchedule ', new Date());

  //do not run schedule on DEV environments
  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  //every 30 seconds
  setInterval(CustomerMessageJob.autoSendMessageForCustomer, 30 * 1000);
}

module.exports = {
  startSchedule,
};
