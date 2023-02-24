/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const REFERRAL_F1 = 'F1';
const REFERRAL_F2 = 'F2';
const REFERRAL_F3 = 'F3';
const REFERRAL_F4 = 'F4';

async function addBonusForUserByLevel(appUserId, totalBetAmount, referalLevel, referUserId) {
  console.info(`start addBonusForUserByLevel`);
  let _userDetail = await AppUserResource.findById(appUserId);
  if (_userDetail === undefined) {
    console.error(`can not find user ${appUserId} addBonusForUserByLevel`);
    return;
  }

  const { MEMBER_LEVEL } = require('../../AppUsers/AppUserConstant');
  let bonusAmount = 0;
  if (_userDetail.memberLevelName === MEMBER_LEVEL.LV0) {
    // Cấp 0	0.6%	0.18%	0.18%	0.18%
    if (referalLevel === REFERRAL_F1) {
      bonusAmount = (totalBetAmount * 0.6) / 100;
    } else if (referalLevel === REFERRAL_F2) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    } else if (referalLevel === REFERRAL_F3) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    } else if (referalLevel === REFERRAL_F4) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    }
  } else if (_userDetail.memberLevelName === MEMBER_LEVEL.LV1) {
    // Cấp 1	0.7%	0.21%	0.18%	0.18%
    if (referalLevel === REFERRAL_F1) {
      bonusAmount = (totalBetAmount * 0.7) / 100;
    } else if (referalLevel === REFERRAL_F2) {
      bonusAmount = (totalBetAmount * 0.21) / 100;
    } else if (referalLevel === REFERRAL_F3) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    } else if (referalLevel === REFERRAL_F4) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    }
  } else if (_userDetail.memberLevelName === MEMBER_LEVEL.LV2) {
    // Cấp 2	0.75%	0.225%	0.18%	0.18%
    if (referalLevel === REFERRAL_F1) {
      bonusAmount = (totalBetAmount * 0.75) / 100;
    } else if (referalLevel === REFERRAL_F2) {
      bonusAmount = (totalBetAmount * 0.225) / 100;
    } else if (referalLevel === REFERRAL_F3) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    } else if (referalLevel === REFERRAL_F4) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    }
  } else if (_userDetail.memberLevelName === MEMBER_LEVEL.LV3) {
    // Cấp 3	0.8%	0.24%	0.18%	0.18%
    if (referalLevel === REFERRAL_F1) {
      bonusAmount = (totalBetAmount * 0.8) / 100;
    } else if (referalLevel === REFERRAL_F2) {
      bonusAmount = (totalBetAmount * 0.24) / 100;
    } else if (referalLevel === REFERRAL_F3) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    } else if (referalLevel === REFERRAL_F4) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    }
  } else if (_userDetail.memberLevelName === MEMBER_LEVEL.LV4) {
    // Cấp 4	0.85%	0.255%	0.18%	0.18%
    if (referalLevel === REFERRAL_F1) {
      bonusAmount = (totalBetAmount * 0.85) / 100;
    } else if (referalLevel === REFERRAL_F2) {
      bonusAmount = (totalBetAmount * 0.255) / 100;
    } else if (referalLevel === REFERRAL_F3) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    } else if (referalLevel === REFERRAL_F4) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    }
  } else if (_userDetail.memberLevelName === MEMBER_LEVEL.LV5) {
    // Cấp 5	0.9%	0.27%	0.18%	0.18%
    if (referalLevel === REFERRAL_F1) {
      bonusAmount = (totalBetAmount * 0.9) / 100;
    } else if (referalLevel === REFERRAL_F2) {
      bonusAmount = (totalBetAmount * 0.27) / 100;
    } else if (referalLevel === REFERRAL_F3) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    } else if (referalLevel === REFERRAL_F4) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    }
  } else if (_userDetail.memberLevelName === MEMBER_LEVEL.LV6) {
    // Cấp 6	1%	0.3%	0.18%	0.18%
    if (referalLevel === REFERRAL_F1) {
      bonusAmount = (totalBetAmount * 1) / 100;
    } else if (referalLevel === REFERRAL_F2) {
      bonusAmount = (totalBetAmount * 0.3) / 100;
    } else if (referalLevel === REFERRAL_F3) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    } else if (referalLevel === REFERRAL_F4) {
      bonusAmount = (totalBetAmount * 0.18) / 100;
    }
  }

  const WalletRecordFunction = require('../WalletRecord/WalletRecordFunction');
  await WalletRecordFunction.addReferralBonus(appUserId, bonusAmount);
}

async function payBonusForReferralUsers(selectedUser, totalBetAmount) {
  if (selectedUser && selectedUser.memberReferIdF1 && selectedUser.memberReferIdF1 !== null) {
    await addBonusForUserByLevel(selectedUser.memberReferIdF1, totalBetAmount, REFERRAL_F1, selectedUser.appUserId);
  }

  if (selectedUser && selectedUser.memberReferIdF2 && selectedUser.memberReferIdF2 !== null) {
    await addBonusForUserByLevel(selectedUser.memberReferIdF2, totalBetAmount, REFERRAL_F2, selectedUser.appUserId);
  }

  if (selectedUser && selectedUser.memberReferIdF3 && selectedUser.memberReferIdF3 !== null) {
    await addBonusForUserByLevel(selectedUser.memberReferIdF3, totalBetAmount, REFERRAL_F3, selectedUser.appUserId);
  }

  if (selectedUser && selectedUser.memberReferIdF4 && selectedUser.memberReferIdF4 !== null) {
    await addBonusForUserByLevel(selectedUser.memberReferIdF4, totalBetAmount, REFERRAL_F4, selectedUser.appUserId);
  }

  // if (selectedUser && selectedUser.memberReferIdF5 && selectedUser.memberReferIdF5 !== null) {
  //   await addBonusForUserByLevel(selectedUser.memberReferIdF5, bonusAmount);
  // }

  // if (selectedUser && selectedUser.memberReferIdF6 && selectedUser.memberReferIdF6 !== null) {
  //   await addBonusForUserByLevel(selectedUser.memberReferIdF6, bonusAmount);
  // }

  // if (selectedUser && selectedUser.memberReferIdF7 && selectedUser.memberReferIdF7 !== null) {
  //   await addBonusForUserByLevel(selectedUser.memberReferIdF7, bonusAmount);
  // }

  // if (selectedUser && selectedUser.memberReferIdF8 && selectedUser.memberReferIdF8 !== null) {
  //   await addBonusForUserByLevel(selectedUser.memberReferIdF8, bonusAmount);
  // }

  // if (selectedUser && selectedUser.memberReferIdF9 && selectedUser.memberReferIdF9 !== null) {
  //   await addBonusForUserByLevel(selectedUser.memberReferIdF9, bonusAmount);
  // }

  // if (selectedUser && selectedUser.memberReferIdF10 && selectedUser.memberReferIdF10 !== null) {
  //   await addBonusForUserByLevel(selectedUser.memberReferIdF10, bonusAmount);
  // }
}
module.exports = {
  payBonusForReferralUsers,
};
