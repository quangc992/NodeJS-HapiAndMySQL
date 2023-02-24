/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Logger = require('../../../utils/logging');

const WalletResource = require('../../Wallet/resourceAccess/WalletResourceAccess');
// const AppUserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const ServicePackageUserViews = require('../resourceAccess/ServicePackageUserViews');
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');
async function InitCryptoWalletForAllUser() {
  console.info(`Start InitCryptoWalletForAllUser`);
  let userCount = await ServicePackageUserViews.count({});
  if (userCount === undefined || userCount.length < 1) {
    console.info('There is no user to init wallet');
    return;
  }

  userCount = userCount[0].count;
  console.info(`Need to InitCryptoWalletForAllUser for ${userCount} users`);

  const MAX_PER_BATCH = 100;
  let batchCount = parseInt(userCount / MAX_PER_BATCH);
  if (batchCount * MAX_PER_BATCH < userCount) {
    batchCount = batchCount + 1;
  }

  for (let i = 0; i < batchCount; i++) {
    let _userServicePackages = await ServicePackageUserViews.find({}, i * MAX_PER_BATCH, MAX_PER_BATCH);
    if (_userServicePackages === undefined || _userServicePackages.length < 1) {
      continue;
    }

    for (let j = 0; j < _userServicePackages.length; j++) {
      const userPackageData = _userServicePackages[j];
      //create new wallet follow balance unit if wallet is not existed
      let newUnitWallet = await WalletResource.find({
        appUserId: userPackageData.appUserId,
        walletType: WALLET_TYPE.CRYPTO,
        walletBalanceUnitId: userPackageData.packageUnitId,
      });
      if (newUnitWallet && newUnitWallet.length > 0) {
        //if wallet existed, then do nothing
        Logger.info(`newUnitWallet existed`);
      } else {
        let createNewUnitWallet = await WalletResource.insert({
          appUserId: userPackageData.appUserId,
          walletType: WALLET_TYPE.CRYPTO,
          walletBalanceUnitId: userPackageData.packageUnitId,
        });
        if (createNewUnitWallet === undefined) {
          Logger.error(`userBuyServicePackage can not create new wallet crypto user ${user.appUserId} - unitId ${package.packageUnitId}`);
        }
      }
    }
  }
  Logger.info(`End InitCryptoWalletForAllUser`);
}

InitCryptoWalletForAllUser();

module.exports = {
  InitCryptoWalletForAllUser,
};
