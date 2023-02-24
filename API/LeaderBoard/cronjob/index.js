/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const { CronInstance, executeJob } = require('../../../ThirdParty/Cronjob/CronInstance');

async function startSchedule() {
  console.log('start LeaderBoardSchedule');
  //every 23h chủ nhật
  CronInstance.schedule('* 23 * * 0', async function () {
    executeJob('./API/LeaderBoard/cronjob/Job_CalculateScoreForAllUsers.js');
  });

  //every 1h thứ 2 (sau do admin co quyen chinh sua)
  CronInstance.schedule('* 1 * * 1', async function () {
    executeJob('./API/LeaderBoard/cronjob/Job_UpdateLeaderboardRanks.js');
  });
}

module.exports = {
  startSchedule,
};
