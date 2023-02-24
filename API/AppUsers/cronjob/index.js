/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const { CronInstance, executeJob } = require('../../ThirdParty/Cronjob/CronInstance');

const weeklyScheduler = () => {
  CronInstance.schedule('1 0 * * 1', async function () {
    executeJob('./User/cronjob/updateMemberLevelForAllUser.js');
  });
};

async function startSchedule() {
  console.log('start UserSchedule');
  weeklyScheduler();
}

module.exports = {
  startSchedule,
};
