/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StakingPackageUserView = require('../resourceAccess/StakingPackageUserView');
const Logger = require('../../../utils/logging');
const StakingPackageFunction = require('../StakingPackageFunction');
const StakingPackageResourceAccess = require('../resourceAccess/StakingPackageResourceAccess');

async function userRequestStaking(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.currentUser.appUserId;
      let stakingId = req.payload.stakingId;
      let stakingAmount = req.payload.stackingAmount;

      let stakingPackage = await StakingPackageResourceAccess.find({
        stakingPackageId: stakingId,
      });
      if (stakingPackage && stakingPackage.length > 0) {
        stakingPackage = stakingPackage[0];
      } else {
        Logger.error(`can not find staking package ${stakingId} to userRequestStaking `);
        reject('failed');
        return; //make sure everything stop
      }

      let result = await StakingPackageFunction.requestStakingForUser(appUserId, stakingAmount, stakingPackage);
      if (result) {
        resolve(result);
      } else {
        Logger.error(`can not stacking`);
        reject('failed');
        return; //make sure everything stop
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function getUserStakingHistory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let appUserId = req.currentUser.appUserId;
      let filter = req.payload.filter;
      if (!filter) {
        filter = {};
      }
      filter.appUserId = appUserId;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let stakingList = await StakingPackageUserView.customSearch(filter, skip, limit, undefined, undefined, undefined, order);

      if (stakingList && stakingList.length > 0) {
        let stakingCount = await StakingPackageUserView.customCount(filter, undefined, undefined, undefined, order);
        resolve({
          data: stakingList,
          total: stakingCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
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
      if (!filter) {
        filter = {};
      }
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;
      let stakingList = await StakingPackageUserView.customSearch(filter, skip, limit, undefined, undefined, searchText, order);

      if (stakingList && stakingList.length > 0) {
        let stakingCount = await StakingPackageUserView.customCount(filter, undefined, undefined, searchText, order);
        resolve({
          data: stakingList,
          total: stakingCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

module.exports = {
  userRequestStaking,
  getUserStakingHistory,
  find,
};
