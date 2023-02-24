/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */

const moment = require('moment');
const AppUsersResourceAccess = require('../resourceAccess/AppUsersResourceAccess');

const Logger = require('../../../utils/logging');
const { LEVER_MEMBERSHIP } = require('../../AppUserMembership/AppUserMembershipConstant');

const LEVEL_0 = LEVER_MEMBERSHIP.NONE;
const LEVEL_1 = LEVER_MEMBERSHIP.MEMBER;
const LEVEL_2 = LEVER_MEMBERSHIP.BUSINESS;
const LEVEL_3 = LEVER_MEMBERSHIP.COMPANY;
const LEVEL_4 = LEVER_MEMBERSHIP.ENTERPRISE;
const LEVEL_5 = LEVER_MEMBERSHIP.CORPORATION;

async function _getMembershipRequirement(memberLevel) {
  if (memberLevel === LEVER_MEMBERSHIP.MEMBER) {
    return {
      minTotalPaymentAmount: 100,
      maxTotalPaymentAmount: 999,
      totalPaymentAmountF1: 0,
      membershipId: LEVER_MEMBERSHIP.MEMBER,
    };
  }
  if (memberLevel === LEVER_MEMBERSHIP.BUSINESS) {
    return {
      minTotalPaymentAmount: 1000,
      maxTotalPaymentAmount: 2999,
      totalPaymentAmountF1: 5000,
      membershipId: LEVER_MEMBERSHIP.BUSINESS,
    };
  }
  if (memberLevel === LEVER_MEMBERSHIP.COMPANY) {
    return {
      minTotalPaymentAmount: 3000,
      maxTotalPaymentAmount: 9999,
      totalPaymentAmountF1: 10000,
      membershipId: LEVER_MEMBERSHIP.COMPANY,
    };
  }
  if (memberLevel === LEVER_MEMBERSHIP.ENTERPRISE) {
    return {
      minTotalPaymentAmount: 10000,
      maxTotalPaymentAmount: 29999,
      totalPaymentAmountF1: 30000,
      membershipId: LEVER_MEMBERSHIP.ENTERPRISE,
    };
  }
  if (memberLevel === LEVER_MEMBERSHIP.CORPORATION) {
    return {
      minTotalPaymentAmount: 30000,
      maxTotalPaymentAmount: undefined,
      totalPaymentAmountF1: 100000,
      membershipId: LEVER_MEMBERSHIP.CORPORATION,
    };
  } else {
    return undefined;
  }
}

function _getLevelBySystemTotalPayment(totalSystemBet) {
  if (totalSystemBet < 5000) {
    return LEVEL_1;
  }

  if (totalSystemBet < 10000) {
    return LEVEL_2;
  }

  if (totalSystemBet < 30000) {
    return LEVEL_3;
  }

  if (totalSystemBet < 100000) {
    return LEVEL_4;
  }

  if (totalSystemBet >= 100000) {
    return LEVEL_5;
  }

  return LEVEL_0;
}

function _getLevelByUserPayment(totalUserBet) {
  if (totalUserBet < 100) {
    return LEVEL_0;
  }

  if (totalUserBet < 1000) {
    return LEVEL_1;
  }

  if (totalUserBet < 3000) {
    return LEVEL_2;
  }

  if (totalUserBet < 10000) {
    return LEVEL_3;
  }

  if (totalUserBet < 30000) {
    return LEVEL_4;
  }

  if (totalUserBet >= 30000) {
    return LEVEL_5;
  }

  return LEVEL_0;
}

async function _calculateNewMemberLevel(appUserId) {
  console.log(`appUserId: ${appUserId}`);

  let lastWeekStart = moment().subtract(2, 'weeks').endOf('week').add(1, 'day').format();
  let lastWeekEnd = moment().subtract(1, 'weeks').endOf('week').add(1, 'day').format();

  console.info(`start _calculateNewMemberLevel ${lastWeekStart} -- ${lastWeekEnd}`);

  const ServicePackageUserViews = require('../../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  const { ACTIVITY_STATUS } = require('../../PaymentServicePackage/PaymentServicePackageConstant');

  //tinh tong tai san WORKING cua user
  let _totalUserBetRecordAmountInWORKING = await ServicePackageUserViews.customSum('packagePaymentAmount', {
    appUserId: appUserId,
    packageActivityStatus: ACTIVITY_STATUS.WORKING,
  });
  if (
    !_totalUserBetRecordAmountInWORKING ||
    _totalUserBetRecordAmountInWORKING.length <= 0 ||
    _totalUserBetRecordAmountInWORKING[0].sumResult === 0
  ) {
    _totalUserBetRecordAmountInWORKING = 0;
  } else {
    _totalUserBetRecordAmountInWORKING = _totalUserBetRecordAmountInWORKING[0].sumResult;
  }

  //tinh tong tai san STANDBY cua user
  let _totalUserBetRecordAmountInSTANDBY = await ServicePackageUserViews.customSum('packagePaymentAmount', {
    appUserId: appUserId,
    packageActivityStatus: ACTIVITY_STATUS.STANDBY,
  });
  if (
    !_totalUserBetRecordAmountInSTANDBY ||
    _totalUserBetRecordAmountInSTANDBY.length <= 0 ||
    _totalUserBetRecordAmountInSTANDBY[0].sumResult === 0
  ) {
    _totalUserBetRecordAmountInSTANDBY = 0;
  } else {
    _totalUserBetRecordAmountInSTANDBY = _totalUserBetRecordAmountInSTANDBY[0].sumResult;
  }

  let _levelByUserBet = _getLevelByUserPayment(_totalUserBetRecordAmountInSTANDBY + _totalUserBetRecordAmountInWORKING);
  console.log(`_totalUserBetRecordAmountIn: ${_totalUserBetRecordAmountInSTANDBY + _totalUserBetRecordAmountInWORKING}`);
  console.log(`_levelByUserBet: ${_levelByUserBet}`);

  //tinh tong tai san co dinh F1 WORKING
  let _totalReferBetRecordAmountInWORKING = await ServicePackageUserViews.sumReferedUserByUserId(
    {
      memberReferIdF1: appUserId,
      packageActivityStatus: ACTIVITY_STATUS.WORKING,
    },
    'packagePaymentAmount',
  );
  if (
    !_totalReferBetRecordAmountInWORKING ||
    _totalReferBetRecordAmountInWORKING.length <= 0 ||
    _totalReferBetRecordAmountInWORKING[0].sumResult === 0
  ) {
    _totalReferBetRecordAmountInWORKING = 0;
  } else {
    _totalReferBetRecordAmountInWORKING = _totalReferBetRecordAmountInWORKING[0].sumResult;
  }

  //tinh tong tai san co dinh F1 STANDBY
  let _totalReferBetRecordAmountInSTANDBY = await ServicePackageUserViews.sumReferedUserByUserId(
    {
      memberReferIdF1: appUserId,
      packageActivityStatus: ACTIVITY_STATUS.STANDBY,
    },
    'packagePaymentAmount',
  );
  if (
    !_totalReferBetRecordAmountInSTANDBY ||
    _totalReferBetRecordAmountInSTANDBY.length <= 0 ||
    _totalReferBetRecordAmountInSTANDBY[0].sumResult === 0
  ) {
    _totalReferBetRecordAmountInSTANDBY = 0;
  } else {
    _totalReferBetRecordAmountInSTANDBY = _totalReferBetRecordAmountInSTANDBY[0].sumResult;
  }

  let _levelBySystemPayment = _getLevelBySystemTotalPayment(_totalReferBetRecordAmountInSTANDBY + _totalReferBetRecordAmountInWORKING);

  console.log(`_totalReferBetRecordAmountIn: ${_totalReferBetRecordAmountInSTANDBY + _totalReferBetRecordAmountInWORKING}`);
  console.log(`_levelBySystemPayment: ${_levelBySystemPayment}`);

  //thong nhat lay level nho nhat (la level du dieu kien nhat)
  let _finalLevel = Math.min(_levelBySystemPayment, _levelByUserBet);
  console.log(`_finalLevel: ${_finalLevel}`);
  return _finalLevel;
}

async function updateMemberLevelName(appUserId, newLevel) {
  let newLevelName = '';
  if (newLevel === LEVEL_0) {
    newLevelName = 'LV0';
  } else if (newLevel === LEVEL_1) {
    newLevelName = 'LV1';
  } else if (newLevel === LEVEL_2) {
    newLevelName = 'LV2';
  } else if (newLevel === LEVEL_3) {
    newLevelName = 'LV3';
  } else if (newLevel === LEVEL_4) {
    newLevelName = 'LV4';
  } else if (newLevel === LEVEL_5) {
    newLevelName = 'LV5';
  }

  await AppUsersResourceAccess.updateById(appUserId, {
    memberLevelName: newLevelName,
  });
}

async function updateAppUserMembershipId(appUserId, newLevel) {
  await AppUsersResourceAccess.updateById(appUserId, {
    appUserMembershipId: newLevel,
  });
}

async function calculateMemberLevelForAllUser() {
  console.log('calculateMemberLevelForAllUser');

  let totalUser = await AppUsersResourceAccess.count({});

  if (totalUser !== undefined && totalUser.length > 0) {
    totalUser = totalUser[0].count;
    for (let i = 0; i < totalUser; i++) {
      const _userOrder = {
        key: 'createdAt',
        value: 'desc',
      };
      let _user = await AppUsersResourceAccess.find({}, i, 1, _userOrder);

      if (_user && _user.length > 0) {
        _user = _user[0];

        let newLevel = await _calculateNewMemberLevel(_user.appUserId);
        console.log(`_user.appUserId: ${_user.appUserId} - appUserMembershipId: ${_user.appUserMembershipId}`);
        console.log(`New Level: ${newLevel}`);

        const {
          rewardBusinessLevel,
          rewardCompanyLevel,
          rewardEnterpriseLevel,
          rewardCorporationLevel,
          removeRewardBusinessLevel,
          removeRewardCompanyLevel,
          removeRewardEnterpriseLevel,
          removeRewardCorporationLevel,
        } = require('../../PaymentServicePackage/UserServicePackageFunctions');

        //neu bi giam cap thi xoa phan thuong
        if (newLevel < _user.appUserMembershipId) {
          if (newLevel < LEVEL_5) {
            console.info('xoa phan thuong LEVEL_5');
            await removeRewardCorporationLevel(_user.appUserId);
          }

          if (newLevel < LEVEL_4) {
            console.info('xoa phan  thuong LEVEL_4');
            await removeRewardEnterpriseLevel(_user.appUserId);
          }

          if (newLevel < LEVEL_3) {
            console.info('xoa phan  thuong LEVEL_3');
            await removeRewardCompanyLevel(_user.appUserId);
          }

          if (newLevel < LEVEL_2) {
            console.info('xoa phan  thuong LEVEL_2');
            await removeRewardBusinessLevel(_user.appUserId);
          }
        } else if (_user.appUserMembershipId === null || newLevel > _user.appUserMembershipId) {
          //neu level hien tai khac voi level truoc do

          if (newLevel >= LEVEL_0) {
            console.info('thuong LEVEL_0');
          }

          if (newLevel >= LEVEL_1) {
            console.info('thuong LEVEL_1');
          }

          if (newLevel >= LEVEL_2) {
            console.info(' thuong LEVEL_2');
            await rewardBusinessLevel(_user.appUserId);
          }

          if (newLevel >= LEVEL_3) {
            console.info(' thuong LEVEL_3');
            await rewardCompanyLevel(_user.appUserId);
          }

          if (newLevel >= LEVEL_4) {
            console.info(' thuong LEVEL_4');
            await rewardEnterpriseLevel(_user.appUserId);
          }

          if (newLevel >= LEVEL_5) {
            console.info(' thuong LEVEL_5');
            await rewardCorporationLevel(_user.appUserId);
          }
        }

        if (newLevel === 0) {
          newLevel = null;
        }
        await updateAppUserMembershipId(_user.appUserId, newLevel);
        await updateMemberLevelName(_user.appUserId, newLevel);
      }
    }
  }
}

module.exports = {
  calculateMemberLevelForAllUser,
};
