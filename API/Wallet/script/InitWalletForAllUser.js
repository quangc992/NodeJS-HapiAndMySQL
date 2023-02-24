/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const AppUserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const WalletFunctions = require('../WalletFunctions');

async function InitWalletForAllUser() {
  console.info(`Start InitWalletForAllUser`);
  let userCount = await AppUserResource.count({});
  if (userCount === undefined || userCount.length < 1) {
    console.info('There is no user to init wallet');
    return;
  }

  userCount = userCount[0].count;
  console.info(`Need to InitWalletForAllUser for ${userCount} users`);

  const MAX_PER_BATCH = 100;
  let batchCount = parseInt(userCount / MAX_PER_BATCH);
  if (batchCount * MAX_PER_BATCH < userCount) {
    batchCount = batchCount + 1;
  }

  const WalletResource = require('../resourceAccess/WalletResourceAccess');
  await WalletResource.initDB();

  for (let i = 0; i < batchCount; i++) {
    let userList = await AppUserResource.find({}, i * MAX_PER_BATCH, MAX_PER_BATCH);
    if (userList === undefined || userList.length < 1) {
      continue;
    }

    for (let j = 0; j < userList.length; j++) {
      const userData = userList[j];
      //Create wallet for user
      WalletFunctions.createWalletForUser(userData.appUserId);
    }
  }
}

InitWalletForAllUser();

module.exports = {
  InitWalletForAllUser,
};
