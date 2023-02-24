/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const moment = require('moment');

const AppUserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const BonusFunctions = require('../UserServicePackageFunctions');

async function InitBonusForAllUser() {
  console.info(`Start InitBonusForAllUser`);
  let userCount = await AppUserResource.count({});
  if (userCount === undefined || userCount.length < 1) {
    console.info('There is no user to init wallet');
    return;
  }

  userCount = userCount[0].count;
  console.info(`Need to InitBonusForAllUser for ${userCount} users`);

  const MAX_PER_BATCH = 100;
  let batchCount = parseInt(userCount / MAX_PER_BATCH);
  if (batchCount * MAX_PER_BATCH < userCount) {
    batchCount = batchCount + 1;
  }

  for (let i = 0; i < batchCount; i++) {
    let userList = await AppUserResource.find({}, i * MAX_PER_BATCH, MAX_PER_BATCH);
    if (userList === undefined || userList.length < 1) {
      continue;
    }

    for (let j = 0; j < userList.length; j++) {
      const userData = userList[j];
      //Create wallet for user
      BonusFunctions.checkBonusAvaibility(userData.appUserId);
    }
  }
}

InitBonusForAllUser();

module.exports = {
  InitBonusForAllUser,
};
