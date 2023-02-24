/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const GamePlayRecordsViews = require('../GamePlayRecords/resourceAccess/GamePlayRecordsView');
const LeaderBoardViews = require('./resourceAccess/LeaderBoardViews');
const LeaderBoardResourAccess = require('./resourceAccess/LeaderBoardResourAccess');
const moment = require('moment');
async function _calculatePlayScore(appUserId) {
  let lastWeekStart = moment().subtract(2, 'weeks').endOf('week').add(1, 'day').format();
  let lastWeekEnd = moment().subtract(1, 'weeks').endOf('week').add(1, 'day').format();

  console.info(`start _calculatePlayScore ${lastWeekStart} -- ${lastWeekEnd}`);

  let filter = {};
  filter.appUserId = appUserId;
  let result = await GamePlayRecordsViews.sumaryWinAmount(filter, lastWeekStart, lastWeekEnd);
  if (result && result.length) {
    let sumResult;
    if (result[0].sumResult === null) {
      return (sumResult = 0);
    }
    sumResult = result[0].sumResult;
    return sumResult;
  } else {
    return 0;
  }
}
async function _calculateReferScore(appUserId) {
  let lastWeekStart = moment().subtract(2, 'weeks').endOf('week').add(1, 'day').format();
  let lastWeekEnd = moment().subtract(1, 'weeks').endOf('week').add(1, 'day').format();

  console.info(`start _calculateReferScore ${lastWeekStart} -- ${lastWeekEnd}`);

  let filter = {};
  filter.memberReferIdF1 = appUserId;
  let result = await GamePlayRecordsViews.sumaryWinAmount(filter, lastWeekStart, lastWeekEnd);
  if (result && result.length > 0) {
    let sumResult;
    if (result[0].sumResult === null) {
      return (sumResult = 0);
    }
    sumResult = result[0].sumResult;
    return sumResult;
  } else {
    return 0;
  }
}

async function calculateRankingScoreByUserId(appUserId) {
  let data = {};
  let resultPlayScore = await _calculatePlayScore(appUserId);
  let resultReferScore = await _calculateReferScore(appUserId);
  data.totalPlayScore = resultPlayScore;
  data.totalReferScore = resultReferScore;
  data.totalScore = data.totalReferScore + data.totalPlayScore;
  return data;
}

async function updateRankingForAllUsers() {
  let order = {
    key: 'totalScore',
    value: 'desc',
  };
  let limit = 10;

  let lastWeekStart = moment().subtract(2, 'weeks').endOf('week').add(1, 'day').format();
  let lastWeekEnd = moment().subtract(1, 'weeks').endOf('week').add(1, 'day').format();

  console.info(`start updateRankingForAllUsers ${lastWeekStart} -- ${lastWeekEnd}`);

  let result = await LeaderBoardViews.customSearch(undefined, undefined, limit, lastWeekStart, lastWeekEnd, undefined, order);
  if (result && result.length > 0) {
    let dataUpdate = {};
    for (var i = 0; i < result.length; i++) {
      dataUpdate.ranking = i + 1;

      let resultUpdate = await LeaderBoardResourAccess.updateById(result[i].appUserId, dataUpdate);
      if (!resultUpdate) {
        continue;
      }
    }
    return result;
  } else {
    return undefined;
  }
}

async function adminUpdateRanking(appUserId, ranking, totalScore) {
  return new Promise(async (resolve, reject) => {
    try {
      let order = {
        key: 'ranking',
        value: 'asc',
      };
      let limit = 10;
      let dataUpdate = {
        ranking: ranking,
      };

      if (totalScore) {
        dataUpdate.totalScore = totalScore;
      }

      let resultUpdate = await LeaderBoardResourAccess.updateById(appUserId, dataUpdate);
      if (!resultUpdate) {
        reject('failed');
      } else {
        let resultFind = await LeaderBoardViews.customSearch(undefined, undefined, limit, undefined, undefined, ranking, order);
        if (resultFind && resultFind.length > 0) {
          let newArray = [];
          for (var i = 0; i < resultFind.length; i++) {
            if (resultFind[i].appUserId !== appUserId) {
              newArray.push(resultFind[i]);
            }
          }
          if (newArray.length > 0) {
            for (var i = 0; i < newArray.length; i++) {
              let resultUpdate = await LeaderBoardResourAccess.updateById(newArray[i].appUserId, {
                ranking: ranking + i + 1,
              });
              if (!resultUpdate) {
                continue;
              }
            }
          }
          resolve('update complete');
        }
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function rewardForTopRanking() {
  let order = {
    key: 'ranking',
    value: 'asc',
  };

  let topRankUsers = await LeaderBoardViews.customSearch(undefined, 0, 3, undefined, undefined, undefined, order);
  console.log(topRankUsers);
  const { addEventBonus } = require('../WalletRecord/WalletRecordFunction');
  const FIRST_PRIZE = 1000; //thuong 1000 USDT
  const SECOND_PRIZE = 300; //thuong 1000 USDT
  const THIRD_PRIZE = 100; //thuong 1000 USDT

  for (let i = 0; i < topRankUsers.length; i++) {
    const _topUser = topRankUsers[i];
    if (_topUser.ranking === 1) {
      await addEventBonus(_topUser.appUserId, FIRST_PRIZE);
    } else if (_topUser.ranking === 2) {
      await addEventBonus(_topUser.appUserId, SECOND_PRIZE);
    } else if (_topUser.ranking === 3) {
      await addEventBonus(_topUser.appUserId, THIRD_PRIZE);
    }
  }
}

module.exports = {
  calculateRankingScoreByUserId,
  updateRankingForAllUsers,
  adminUpdateRanking,
  rewardForTopRanking,
};
