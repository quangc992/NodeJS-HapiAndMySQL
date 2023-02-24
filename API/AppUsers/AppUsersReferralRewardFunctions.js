/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const AppUsersResourceAccess = require('./resourceAccess/AppUsersResourceAccess');
const Logger = require('../../utils/logging');

// - nếu f1 đăng kí và kyc thành công thì người giới thiệu nhận được 10 FAC và f1 đó cũng nhận được 10FAC,
// - Tiền hoa hồng sẽ chuyển về ví hoa hồng.
async function rewardForVerifiedInfo(appUserId, referUserId) {
  const VERIFIED_INFO_REWARD_AMOUNT = 10; //10 FAC
  let _rewardAmount = VERIFIED_INFO_REWARD_AMOUNT;

  const WalletRecordFunctions = require('../WalletRecord/WalletRecordFunction');

  //thuong cho user verify thanh cong
  let rewardUserResult = WalletRecordFunctions.addReferralBonus(appUserId, _rewardAmount);
  if (!rewardUserResult) {
    Logger.error(`rewardForVerifiedInfo Failed for user ${appUserId}`);
  }

  //thuong cho nguoi gioi thieu
  if (referUserId && referUserId !== null) {
    let rewardReferalResult = WalletRecordFunctions.addReferralBonus(referUserId, _rewardAmount);
    if (!rewardReferalResult) {
      Logger.error(`rewardForVerifiedInfo Failed for referUserId ${appUserId}`);
    }
  }
}

async function rewardByTotalReferalUser(appUserId) {
  //gioi thieu 100 nguoi thi duoc thuong
  const REQUIRED_TOTAL_REFERAL_USER = 100;

  if (!appUserId || appUserId === null) {
    Logger.info(`do not rewardByTotalReferalUser for null user`);
    return;
  }

  let _totalReferredUser = await AppUsersResourceAccess.count({
    referUserId: appUserId,
  });

  if (!_totalReferredUser || _totalReferredUser[0].count !== REQUIRED_TOTAL_REFERAL_USER) {
    //khong du 100 nguoi hoac hon 100 nguoi
    //chi thuong 1 lan duy nhat
    return;
  }

  //cho nay bat buoc phai re-use function nay
  //xu ly de tang goi thuong cho user
  const { rewardKYCReferrals } = require('../PaymentServicePackage/UserServicePackageFunctions');
  await rewardKYCReferrals(appUserId);
}

module.exports = {
  rewardForVerifiedInfo,
  rewardByTotalReferalUser,
};
