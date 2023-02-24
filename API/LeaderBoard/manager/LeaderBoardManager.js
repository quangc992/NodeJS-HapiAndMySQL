/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const LeaderBoardResourAccess = require('../resourceAccess/LeaderBoardResourAccess');
const LeaderBoardViews = require('../resourceAccess/LeaderBoardViews');
const LeaderBoardFunction = require('../LeaderFunction');
async function userGetTopRank(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let order = {
        key: 'ranking',
        value: 'asc',
      };

      let result = await LeaderBoardViews.customSearch(undefined, 0, 3, undefined, undefined, undefined, order);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}
async function updateRanKingById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.payload.appUserId;
      let ranking = req.payload.ranking;
      let totalScore = req.payload.totalScore;

      let result = await LeaderBoardFunction.adminUpdateRanking(appUserId, ranking, totalScore);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}
async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = {
        key: 'ranking',
        value: 'asc',
      };
      let result = await LeaderBoardViews.customSearch(filter, skip, limit, undefined, undefined, undefined, order);
      if (result && result.length > 0) {
        let dataCount = await LeaderBoardViews.customCount(filter, undefined, undefined);
        resolve({ data: result, total: dataCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}
module.exports = {
  userGetTopRank,
  updateRanKingById,
  find,
};
