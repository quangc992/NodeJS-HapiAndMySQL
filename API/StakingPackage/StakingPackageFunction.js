/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const moment = require('moment');

const { STACKING_ACTIVITY_STATUS } = require('./StakingPackageConstant');
const { WALLET_TYPE } = require('../Wallet/WalletConstant');
const WalletResourceAccess = require('../Wallet/resourceAccess/WalletResourceAccess');
const StackingResoureAccess = require('./resourceAccess/StakingPackageResourceAccess');
const StakingPackageUserResourceAccess = require('./resourceAccess/StakingPackageUserResourceAccess');

const Logger = require('../../utils/logging');

async function requestStakingForUser(appUserId, stakingAmount, stakingPackage) {
  //lay thong tin vi cua user
  let wallet = await WalletResourceAccess.find(
    {
      appUserId: appUserId,
      walletType: WALLET_TYPE.FAC,
    },
    0,
    1,
  );
  if (!wallet || wallet.length < 1) {
    Logger.error(`invalid wallet for user ${appUserId}`);
    return undefined;
  }
  wallet = wallet[0];

  if (wallet.balance - stakingPackage.stakingPackagePrice < 0) {
    Logger.error(`wallet ${wallet.walletId} do not have enough balance`);
    return undefined;
  }

  //tru tien cua user
  let updateWalletResult = await WalletResourceAccess.decrementBalance(wallet.walletId, stakingAmount);

  if (!updateWalletResult) {
    Logger.error('wallet decrementBalance error for staking');
    return undefined;
  }

  //luu tru thong tin goi staking de bat dau thuc hien tinh lai
  let _startDate = new Date().toISOString();
  let _endDate = moment().add(stakingPackage.stakingPeriod, 'days').toISOString();

  let dataInsert = {
    appUserId: appUserId,
    stakingPackageId: stakingPackage.stakingPackageId,
    stakingPeriod: stakingPackage.stakingPeriod,
    stakingActivityStatus: STACKING_ACTIVITY_STATUS.STAKING,
    stakingPackagePrice: stakingPackage.stakingPackagePrice,
    stackingAmount: stakingAmount,
    stakingStartDate: _startDate,
    stakingEndDate: _endDate,
    stakingInterestRate: stakingPackage.stakingInterestRate,
    stakingPaymentType: stakingPackage.stakingPaymentType,
    stakingPaymentPeriod: stakingPackage.stakingPaymentPeriod,
    profitEstimate: (stakingAmount * stakingPackage.stakingInterestRate) / 100,
  };

  let resultStacking = await StakingPackageUserResourceAccess.insert(dataInsert);
  if (resultStacking) {
    return resultStacking;
  } else {
    Logger.error('stackingInterestRate error');
    return undefined;
  }
}

async function completeStakingPackage(stakingId) {
  let Result = await StackingResoureAccess.updateById(stakingId, {
    stakingStatus: STACKING_ACTIVITY_STATUS.COMPLETED,
  });
  if (Result) {
    return Result;
  } else {
    Logger.error('update error');
    return undefined;
  }
}

async function cancelStakingPackage(stakingId) {
  let Result = await StackingResoureAccess.updateById(stakingId, {
    stakingStatus: STACKING_ACTIVITY_STATUS.COMPLETED,
  });
  if (Result) {
    return Result;
  } else {
    Logger.error('update error');
    return undefined;
  }
}

module.exports = {
  requestStakingForUser,
  completeStakingPackage,
  cancelStakingPackage,
};
