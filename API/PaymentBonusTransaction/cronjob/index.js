/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const { CronInstance, executeJob } = require('../../../ThirdParty/Cronjob/CronInstance');

async function _startCronSchedule() {
  console.info('_startCronSchedule ', new Date());
}

async function startSchedule() {
  console.info('startSchedule PaymentBonusTransaction');

  _startCronSchedule();
}

module.exports = {
  startSchedule,
};
