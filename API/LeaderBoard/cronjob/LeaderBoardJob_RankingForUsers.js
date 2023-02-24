/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const LeaderBoardFunction = require('../LeaderFunction');
const UserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const Logger = require('../../../utils/logging');
const LeaderBoardResourAccess = require('../resourceAccess/LeaderBoardResourAccess');
async function calculateScoreForAllUsers() {
  Logger.info(`start calculateScoreForAllUsers ${new Date()}`);
  return new Promise(async (resolve, reject) => {
    try {
      let dataInsert = {};
      let countAllIUser = await UserResource.count();
      if (countAllIUser && countAllIUser.length > 0) {
        countAllIUser = countAllIUser[0].count;
      }
      if (countAllIUser < 1) {
        Logger.info(`There is no User in-progress`);
        resolve('OK');
        return;
      } else {
        Logger.info(`There is ${countAllIUser} user in-progress`);
      }

      //split into batch
      const MAX_PER_BATCH = 100;
      let batchCount = parseInt(countAllIUser / MAX_PER_BATCH);
      if (batchCount * MAX_PER_BATCH < countAllIUser) {
        batchCount = batchCount + 1;
      }

      //generate all user into LeaderBoard table
      await LeaderBoardResourAccess.cleanAllData();

      //calculate score for all user
      for (let i = 0; i < batchCount; i++) {
        let resultUser = await UserResource.find({}, MAX_PER_BATCH * i, MAX_PER_BATCH);
        if (resultUser && resultUser.length > 0) {
          for (let userCounter = 0; userCounter < resultUser.length; userCounter++) {
            const _user = resultUser[userCounter];
            let resultTotal = await LeaderBoardFunction.calculateRankingScoreByUserId(_user.appUserId);

            dataInsert.appUserId = _user.appUserId;
            dataInsert.totalPlayScore = resultTotal.totalPlayScore;
            dataInsert.totalReferScore = resultTotal.totalReferScore;
            dataInsert.totalScore = resultTotal.totalScore;

            let resultInsert = await LeaderBoardResourAccess.insert(dataInsert);
            if (!resultInsert) {
              Logger.error(`can not calculateRankingScoreByUserId for user ${_user.appUserId}`);
            }
          }
        }
      }
      Logger.info(`end calculateScoreForAllUsers ${new Date()}`);
      resolve('OK');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function updateLeaderboardRanks() {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await LeaderBoardFunction.updateRankingForAllUsers();
      if (!result) {
        resolve('updateRankingForAllUsers failed');
      } else {
        resolve('Complete update');
        Logger.info(`Complete update Ranking LeaderBoard ${new Date()}`);
      }
    } catch (e) {
      Logger.error(e);
      resolve('failed');
    }
  });
}

async function rewardRankingBonusForAllUser() {
  await LeaderBoardFunction.rewardForTopRanking();
}
module.exports = {
  calculateScoreForAllUsers,
  updateLeaderboardRanks,
  rewardRankingBonusForAllUser,
};
