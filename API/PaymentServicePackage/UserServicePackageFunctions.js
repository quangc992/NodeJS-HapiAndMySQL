/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const moment = require('moment');

const WalletResource = require('../Wallet/resourceAccess/WalletResourceAccess');
const AppUserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
const { WALLET_TYPE } = require('../Wallet/WalletConstant');
const ServicePackageUser = require('./resourceAccess/PaymentServicePackageUserResourceAccess');
const ServicePackageResource = require('./resourceAccess/PaymentServicePackageResourceAccess');
const UserBonusPackageResource = require('./resourceAccess/UserBonusPackageResourceAccess');
const ServicePackageWalletViews = require('./resourceAccess/ServicePackageWalletViews');
const ServicePackageUserViews = require('./resourceAccess/ServicePackageUserViews');
const { ACTIVITY_STATUS, PACKAGE_CATEGORY, CLAIMABLE_STATUS, PACKAGE_TYPE, PACKAGE_STATUS } = require('./PaymentServicePackageConstant');
const PaymentRecordResource = require('./../PaymentRecord/resourceAccess/PaymentRecordResourceAccess');
const Logger = require('../../utils/logging');
const WalletRecordResoureAccess = require('../WalletRecord/resourceAccess/WalletRecordResoureAccess');
const BetRecordsResource = require('../BetRecords/resourceAccess/BetRecordsResourceAccess');
const { BET_STATUS } = require('../BetRecords/BetRecordsConstant');
const { WALLET_RECORD_TYPE } = require('../WalletRecord/WalletRecordConstant');

async function getCurrentStagePerformance(packageType) {
  const { getSystemConfig } = require('../SystemConfigurations/SystemConfigurationsFunction');
  const _config = await getSystemConfig();
  let _selectedType = '';
  if (PACKAGE_TYPE.A100FAC.type === packageType) {
    _selectedType = 'A100FAC';
  } else if (PACKAGE_TYPE.A1000FAC.type === packageType) {
    _selectedType = 'A1000FAC';
  } else if (PACKAGE_TYPE.A500FAC.type === packageType) {
    _selectedType = 'A500FAC';
  } else {
    return 0;
  }

  if (_config.packageCurrentStage) {
    return PACKAGE_TYPE[_selectedType][`stage${_config.packageCurrentStage}`];
  } else {
    return 0;
  }
}

async function _addBonusPackageForUser(appUserId, bonusPackageId) {
  //check if there is any existing bonus package that still enable
  //then skip this process, we do not allow to add duplicated bonus package at the same time
  let _existingBonusPackages = await UserBonusPackageResource.find({
    appUserId: appUserId,
    bonusPackageId: bonusPackageId,
    bonusPackageClaimable: CLAIMABLE_STATUS.ENABLE,
  });

  if (_existingBonusPackages && _existingBonusPackages.length > 0) {
    Logger.error(`_existingBonusPackages for appUserId ${appUserId} - bonusPackageId ${bonusPackageId}`);
    return;
  }

  let _newBonusPackageData = {
    appUserId: appUserId,
    bonusPackageId: bonusPackageId,
    bonusPackageClaimable: CLAIMABLE_STATUS.ENABLE,
  };
  let insertNewBonus = await UserBonusPackageResource.insert(_newBonusPackageData);
  if (!insertNewBonus) {
    Logger.error(`can not insertNewBonus for appUserId ${appUserId} - bonusPackageId ${bonusPackageId}`);
    return;
  }
}
async function checkBonusAvaibility(appUserId) {
  //count existing bonus package, if available then we will proceed, else we skip it
  let _existingBonusPackagesCount = await ServicePackageResource.count({
    packageCategory: PACKAGE_CATEGORY.BONUS_NORMAL,
    isDeleted: false,
  });

  if (!_existingBonusPackagesCount || _existingBonusPackagesCount.length <= 0) {
    return;
  }
  _existingBonusPackagesCount = _existingBonusPackagesCount[0].count;
  if (_existingBonusPackagesCount <= 0) {
    return;
  }

  //count userReferralCount, if available then we will proceed, else we skip it
  let _userReferralCount = await AppUserResource.count({
    referUserId: appUserId,
  });
  if (!_userReferralCount || _userReferralCount.length <= 0) {
    _userReferralCount = 0;
  } else {
    _userReferralCount = _userReferralCount[0].count;
  }

  //count number of package that user buy
  let _totalReferPayment = await ServicePackageUserViews.sum('packagePaymentAmount', {
    referUserId: appUserId,
  });
  if (!_totalReferPayment || _totalReferPayment.length <= 0) {
    _totalReferPayment = 0;
  } else {
    _totalReferPayment = _totalReferPayment[0].sumResult;
  }
  //find available bonus packages
  let _bonusPackages = await ServicePackageResource.countByReferral(
    {
      packageCategory: PACKAGE_CATEGORY.BONUS_NORMAL,
    },
    _userReferralCount,
    _totalReferPayment,
  );

  if (_bonusPackages && _bonusPackages.length > 0) {
    for (let i = 0; i < _bonusPackages.length; i++) {
      const _bonusPackage = _bonusPackages[i];
      await _addBonusPackageForUser(appUserId, _bonusPackage.paymentServicePackageId);
    }
  }
}

async function userBuyServicePackage(user, packageId) {
  const FUNC_FAILED = undefined;
  //find user selecting package
  let package = await ServicePackageResource.find(
    {
      paymentServicePackageId: packageId,
    },
    0,
    1,
  );
  if (package === undefined || package.length < 1) {
    Logger.error(`userBuyServicePackage invalid package ${packageId}`);
    return FUNC_FAILED;
  }
  package = package[0];

  //find user exisitng package
  let existingPackages = await ServicePackageUser.find(
    {
      paymentServicePackageId: packageId,
      appUserId: user.appUserId,
    },
    0,
    5,
  );
  if (existingPackages && existingPackages.length > 0) {
    for (let counter = 0; counter < existingPackages.length; counter++) {
      const _existedPackage = existingPackages[counter];
      if (_existedPackage.packageActivityStatus !== ACTIVITY_STATUS.COMPLETED) {
        Logger.error(`userBuyServicePackage existing package ${packageId}`);
        return FUNC_FAILED;
      }
    }
  }

  if (package.isHidden === 1) {
    Logger.error(`item is hidden ${packageId}`);
    return FUNC_FAILED;
  }
  if (package.packageStatus === PACKAGE_STATUS.SOLD) {
    Logger.error(`item is sold ${packageId}`);
    return FUNC_FAILED;
  }

  //retrieve wallet info to check balance
  let userWallet = await WalletResource.find(
    {
      appUserId: user.appUserId,
      walletType: WALLET_TYPE.USDT,
    },
    0,
    1,
  );
  if (userWallet === undefined || userWallet.length < 1) {
    Logger.error(`userBuyServicePackage can not wallet USDT ${user.appUserId}`);
    return FUNC_FAILED;
  }
  userWallet = userWallet[0];

  //check if wallet balance is enough to pay or not
  let paymentAmount = package.packageDiscountPrice === null ? package.packagePrice : package.packageDiscountPrice;
  if (userWallet.balance - paymentAmount < 0) {
    Logger.error(`userBuyServicePackage do not have enough balance`);
    throw 'NOT_ENOUGH_BALANCE';
  }

  //update wallet balance
  let updateWallet = await WalletResource.decrementBalance(userWallet.walletId, paymentAmount);
  if (updateWallet) {
    //store payment history record
    let paymentRecordData = {
      paymentUserId: user.appUserId,
      paymentTargetId: package.paymentServicePackageId,
      paymentTitle: `Purchase service package: ${package.packageName}`,
      paymentTargetType: 'SERVICE_PACKAGE',
      paymentAmount: paymentAmount,
      walletBalanceBefore: userWallet.balance,
      walletBalanceAfter: userWallet.balance - paymentAmount,
    };
    let newPaymentRecord = await PaymentRecordResource.insert(paymentRecordData);
    if (newPaymentRecord === undefined) {
      Logger.error(`userBuyServicePackage can not store payment record user ${user.appUserId} - packageId ${packageId} `);
    }

    //create new wallet follow balance unit if wallet is not existed
    let newUnitWallet = await WalletResource.find({
      appUserId: user.appUserId,
      walletType: WALLET_TYPE.FAC,
    });
    if (newUnitWallet && newUnitWallet.length > 0) {
      //if wallet existed, then do nothing
    } else {
      let createNewUnitWallet = await WalletResource.insert({
        appUserId: user.appUserId,
        walletType: WALLET_TYPE.FAC,
      });
      if (createNewUnitWallet === undefined) {
        Logger.error(`userBuyServicePackage can not create new wallet FAC user ${user.appUserId} - unitId ${package.packageUnitId}`);
      }
    }

    //store working package
    let userPackageData = {
      appUserId: user.appUserId,
      paymentServicePackageId: packageId,
      packageExpireDate: moment().add(package.packageDuration, 'days').toDate(),
      profitEstimate: package.packagePerformance * package.packageDuration,
      packagePrice: package.packagePrice,
      packageDiscountPrice: package.packageDiscountPrice,
      packagePaymentAmount: paymentAmount,
      packageLastActiveDate: new Date(),
      packageCurrentPerformance: package.packagePerformance,
      packageActivityStatus: ACTIVITY_STATUS.WORKING,
    };
    let newPackageResult = await ServicePackageUser.insert(userPackageData);
    if (newPackageResult) {
      //check to add bonus packages
      //Tam thoi chua can chuc nang nay
      // await checkBonusAvaibility(user.appUserId);
      // await checkBonusAvaibility(user.referUserId)

      // update package is sold
      await ServicePackageResource.updateById(packageId, { packageStatus: PACKAGE_STATUS.SOLD });

      return newPackageResult;
    } else {
      Logger.error(`userBuyServicePackage can not record user ${user.appUserId} - packageId ${packageId}`);
      return FUNC_FAILED;
    }
  } else {
    Logger.error(`userBuyServicePackage can not pay to wallet ${userWallet.walletId}, ${paymentAmount}`);
    return FUNC_FAILED;
  }
}

async function _increaseBalanceForWallet(userWallet, claimedAmount, packageId) {
  //update wallet balance BTC
  let updateWallet = await WalletResource.incrementBalance(userWallet.walletId, claimedAmount);

  if (updateWallet) {
    // store wallet balance change record
    await WalletRecordResoureAccess.insert({
      appUserId: userWallet.appUserId,
      walletId: userWallet.walletId,
      paymentAmount: claimedAmount,
      balanceBefore: userWallet.balance,
      balanceAfter: userWallet.balance + claimedAmount,
      WalletRecordType: WALLET_RECORD_TYPE.EARNED,
    });

    //store user play record
    await BetRecordsResource.insert({
      appUserId: userWallet.appUserId,
      betRecordAmountIn: claimedAmount,
      betRecordAmountOut: claimedAmount,
      betRecordWin: claimedAmount,
      betRecordStatus: BET_STATUS.COMPLETED,
      betRecordType: userWallet.walletType === WALLET_TYPE.FAC ? 10 : 20, //luu loai value FAC hay BTC, xem constant cua betRecord
      gameRecordId: packageId, //luu lai packageServiceUserId
      walletId: userWallet.walletId,
    });
  }
}

function getPerformanceBonusRateByMembership(appUsermembershipId) {
  if (appUsermembershipId === 0) {
    return 0;
  } else if (appUsermembershipId === 1) {
    return 0;
  } else if (appUsermembershipId === 2) {
    return 5 / 100; //- Sức mạnh khai thác tăng +5%
  } else if (appUsermembershipId === 3) {
    return 10 / 100; //- Sức mạnh khai thác tăng +10%
  } else if (appUsermembershipId === 4) {
    return 15 / 100; //- Sức mạnh khai thác tăng +15%
  } else if (appUsermembershipId === 5) {
    return 20 / 100; //- Sức mạnh khai thác tăng +20%
  }
  return 0;
}

async function userCollectServicePackage(user, packageId) {
  const FUNC_FAILED = undefined;
  //find user selecting package
  let userPackage = await ServicePackageUserViews.find(
    {
      paymentServicePackageUserId: packageId,
      appUserId: user.appUserId,
    },
    0,
    1,
  );
  if (userPackage === undefined || userPackage.length < 1) {
    Logger.error(`userCollectServicePackage invalid package ${packageId}`);
    return FUNC_FAILED;
  }
  userPackage = userPackage[0];

  let bonusPerformanceProfit = userPackage.packageCurrentPerformance * getPerformanceBonusRateByMembership(userPackage.appUsermembershipId);
  let collectAmount = userPackage.profitActual * 1 + bonusPerformanceProfit;
  let claimedAmount = userPackage.profitClaimed * 1 + collectAmount * 1;
  let bonusAmount = userPackage.profitBonus * 1;
  let profitBonusClaimed = userPackage.profitBonusClaimed * 1 + bonusAmount * 1;

  let updatedPackageData = {
    profitBonus: 0,
    profitBonusClaimed: profitBonusClaimed,
    profitActual: 0,
    profitClaimed: claimedAmount,
    packageActivityStatus: ACTIVITY_STATUS.WORKING,
    packageLastActiveDate: new Date(),
  };

  let collectUpdated = await ServicePackageUser.updateById(packageId, updatedPackageData);
  if (collectUpdated === undefined) {
    Logger.error(`userCollectServicePackage can not collect`);
    return FUNC_FAILED;
  }

  let userWallet = undefined;

  if (bonusAmount < 0.0000000001) {
    //retrieve wallet info to check balance
    userWallet = await WalletResource.find(
      {
        appUserId: user.appUserId,
        walletType: WALLET_TYPE.FAC,
      },
      0,
      1,
    );

    if (userWallet === undefined || userWallet.length < 1) {
      Logger.error(`userCollectServicePackage can not find wallet POINT ${appUserId}`);
      return FUNC_FAILED;
    }
    userWallet = userWallet[0];

    //update wallet balance FAC
    await _increaseBalanceForWallet(userWallet, collectAmount, packageId);
  }

  return {
    profitClaimed: collectAmount,
    profitBonus: bonusAmount,
  };
}

async function userActivateServicePackage(user, packageId) {
  const FUNC_FAILED = undefined;
  //find user selecting package
  let package = await ServicePackageWalletViews.find(
    {
      paymentServicePackageUserId: packageId,
      appUserId: user.appUserId,
      packageActivityStatus: ACTIVITY_STATUS.STANDBY,
    },
    0,
    1,
  );
  if (package === undefined || package.length < 1) {
    Logger.error(`userCollectServicePackage invalid package ${packageId}`);
    return FUNC_FAILED;
  }
  package = package[0];

  let _packageExpire = new Date(package.packageExpireDate) - 1;
  if (_packageExpire > new Date() - 1) {
    let collectUpdated = await ServicePackageUser.updateById(packageId, {
      packageActivityStatus: ACTIVITY_STATUS.WORKING,
      packageLastActiveDate: new Date(),
    });

    if (collectUpdated === undefined) {
      Logger.error(`userCollectServicePackage can not collect`);
      return FUNC_FAILED;
    } else {
      return collectUpdated;
    }
  } else {
    Logger.error(`_packageExpire - package ${packageId}`);
    return FUNC_FAILED;
  }
}

async function _completeUserServicePackage(userPackage, packageNote, staff) {
  //neu da complete thi se khong complete duoc nua
  if (userPackage.packageActivityStatus === ACTIVITY_STATUS.COMPLETED) {
    Logger.error(`package was completed before`);
    return FUNC_FAILED;
  }

  //% phi khi thanh ly
  ////phi thanh ly luon la 7%
  let _returnFeeRate = 7 / 100;

  //tim kiem thong tin vi cua user
  let usdtWallet = await WalletResource.find(
    {
      appUserId: userPackage.appUserId,
      walletType: WALLET_TYPE.USDT,
    },
    0,
    1,
  );

  if (!usdtWallet || usdtWallet.length < 1) {
    console.error('usdtWallet is invalid');
    return undefined;
  }
  usdtWallet = usdtWallet[0];

  let returnAmount = 0;

  //phi thanh ly luon la 7%
  returnAmount = userPackage.packagePrice - userPackage.packagePrice * _returnFeeRate;

  //cap nhat thong tin package
  let _userPackageUpdatedData = {
    packageActivityStatus: ACTIVITY_STATUS.COMPLETED,
    packageExpireDate: moment().toDate(),
  };

  //neu day la admin thu hoi thi su dung status khac
  if (staff) {
    _userPackageUpdatedData.packageActivityStatus = ACTIVITY_STATUS.CANCELED;
  }
  if (packageNote) {
    _userPackageUpdatedData.packageNote = packageNote;
  }

  let result = await ServicePackageUser.updateById(userPackage.paymentServicePackageUserId, _userPackageUpdatedData);
  if (result) {
    //cap nhat so du cua Vi
    let updateWalletResult = await WalletResource.incrementBalance(usdtWallet.walletId, returnAmount);
    if (updateWalletResult) {
      return updateWalletResult;
    } else {
      Logger.error(`WalletResource.incrementBalance usdtWallet.walletId ${usdtWallet.walletId}`);
      return undefined;
    }
  } else {
    Logger.error(`_completeUserServicePackage Failse`);
    return FUNC_FAILED;
  }
}

async function adminCompleteUserServicePackage(paymentServicePackageUserId, staff) {
  const FUNC_FAILED = undefined;

  let _filterData = {
    paymentServicePackageUserId: paymentServicePackageUserId,
  };

  let packageUser = await ServicePackageUserViews.find(_filterData, 0, 1);

  //khong tim thay package can xu ly
  if (packageUser === undefined || packageUser.length < 1) {
    Logger.error(`adminCompleteUserServicePackage invalid package ${paymentServicePackageUserId}`);
    return FUNC_FAILED;
  }
  packageUser = packageUser[0];

  let completeResult = await _completeUserServicePackage(packageUser, 'MACHINE_LIQUIDATION_BEFORE_EXPIRED', staff);

  return completeResult;
}

async function userCompleteUserServicePackage(paymentServicePackageUserId, user) {
  const FUNC_FAILED = undefined;

  let _filterData = {
    paymentServicePackageUserId: paymentServicePackageUserId,
  };

  //neu user chu dong Complete package nay thi se loc theo thong tin user
  //de dam bao khong complete package cua user khac
  if (user) {
    _filterData.appUserId = user.appUserId;
  }

  let packageUser = await ServicePackageUserViews.find(_filterData, 0, 1);

  //khong tim thay package can xu ly
  if (packageUser === undefined || packageUser.length < 1) {
    Logger.error(`userCompledServicePackage invalid package ${paymentServicePackageUserId}`);
    return FUNC_FAILED;
  }
  packageUser = packageUser[0];

  //user khong duoc tu complete package THUONG
  if (user && packageUser.packageCategory !== PACKAGE_CATEGORY.NORMAL) {
    Logger.error(`package is auto completed`);
    return FUNC_FAILED;
  }

  let completeResult = await _completeUserServicePackage(packageUser, 'MACHINE_LIQUIDATION_BEFORE_EXPIRED');
  return completeResult;
}

async function _rewardPaymentServicePackage(appUserId, packageCategory, packageType, packageDuration) {
  const { createPackagesByPackageType } = require('./PaymentServicePackageFunctions');
  let packageId = await createPackagesByPackageType(packageType, packageCategory, packageDuration);
  let _newPackage = await ServicePackageResource.findById(packageId);

  let data = {
    appUserId: appUserId,
    paymentServicePackageId: packageId,
    packageExpireDate: moment().add(_newPackage.packageDuration, 'days').toDate(),
    profitEstimate: _newPackage.packagePerformance * _newPackage.packageDuration,
    packagePrice: _newPackage.packagePrice,
    packageDiscountPrice: _newPackage.packageDiscountPrice,
    packagePaymentAmount: 0,
    packageLastActiveDate: new Date(),
    packageCurrentPerformance: _newPackage.packagePerformance,
    packageActivityStatus: ACTIVITY_STATUS.WORKING,
  };

  // tặng máy vừa tạo cho user
  let resultInsert = await ServicePackageUser.insert(data);
  if (resultInsert) {
    return resultInsert;
  } else {
    return undefined;
  }
}

// tặng máy 100 khi thành Hộ Kinh Doanh
async function rewardBusinessLevel(appUserId) {
  //- Được tặng 1 máy $100
  await _rewardPaymentServicePackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A100FAC.type);
}

// tặng máy 500 khi thành Công Ty
async function rewardCompanyLevel(appUserId) {
  //- Được tặng 1 máy $500
  await _rewardPaymentServicePackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A500FAC.type);
}

// tặng máy 1000 khi thành Doanh Nghiệp
async function rewardEnterpriseLevel(appUserId) {
  //- Được tặng 1 máy $1000
  await _rewardPaymentServicePackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A1000FAC.type);
}

// tặng máy 1000 khi thành Tập đoàn
async function rewardCorporationLevel(appUserId) {
  //- Được tặng 5 máy $1000
  await _rewardPaymentServicePackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A1000FAC.type);
  await _rewardPaymentServicePackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A1000FAC.type);
  await _rewardPaymentServicePackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A1000FAC.type);
}

async function _removeRewardedPackage(appUserId, packageCategory, packageType) {
  //thu hoi cac goi dang chay (WORKING)
  let _workingPackageList = await ServicePackageUserViews.findAllWorkingPackage(
    [ACTIVITY_STATUS.WORKING, ACTIVITY_STATUS.STANDBY],
    {
      appUserId: appUserId,
      packageCategory: packageCategory,
      packageType: packageType,
    },
    0,
    1,
  );

  const HAS_STAFF = 1;

  for (let i = 0; i < _workingPackageList.length; i++) {
    const _workingPackage = _workingPackageList[i];
    await adminCompleteUserServicePackage(_workingPackage.paymentServicePackageUserId, HAS_STAFF);
  }
}

// thu hoi  máy 100 khi thành Hộ Kinh Doanh bi giam cap
async function removeRewardBusinessLevel(appUserId) {
  //- Được thu hoi  1 máy $100
  await _removeRewardedPackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A100FAC.type);
}

// thu hoi  máy 500 khi thành Công Ty bi giam cap
async function removeRewardCompanyLevel(appUserId) {
  //- Được thu hoi  1 máy $500
  await _removeRewardedPackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A500FAC.type);
}

// thu hoi  máy 1000 khi thành Doanh Nghiệp bi giam cap
async function removeRewardEnterpriseLevel(appUserId) {
  //- Được thu hoi  1 máy $1000
  await _removeRewardedPackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A1000FAC.type);
}

// thu hoi máy 1000 khi thành Tập đoàn bi giam cap
async function removeRewardCorporationLevel(appUserId) {
  //- Được thu hoi  5 máy $1000
  await _removeRewardedPackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A1000FAC.type);
  await _removeRewardedPackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A1000FAC.type);
  await _removeRewardedPackage(appUserId, PACKAGE_CATEGORY.BONUS_RANK, PACKAGE_TYPE.A1000FAC.type);
}

async function rewardKYCReferrals(appUserId) {
  return await _rewardPaymentServicePackage(appUserId, PACKAGE_CATEGORY.BONUS_KYC, PACKAGE_TYPE.A100FAC.type);
}

module.exports = {
  userBuyServicePackage,
  userCollectServicePackage,
  userActivateServicePackage,
  checkBonusAvaibility,
  adminCompleteUserServicePackage,
  userCompleteUserServicePackage,
  rewardBusinessLevel,
  rewardCompanyLevel,
  rewardEnterpriseLevel,
  rewardCorporationLevel,
  rewardKYCReferrals,
  removeRewardBusinessLevel,
  removeRewardCompanyLevel,
  removeRewardEnterpriseLevel,
  removeRewardCorporationLevel,
};
