/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Logger = require('../../utils/logging');

async function countTotalUser() {
  const AppUserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
  let countAll = await AppUserResource.customCount({});
  if (countAll) {
    return countAll[0].count;
  }

  return 0;
}

async function countTotalServicePackage() {
  const ServicePackageResource = require('../PaymentServicePackage/resourceAccess/PaymentServicePackageResourceAccess');
  let countAll = await ServicePackageResource.count({});
  if (countAll) {
    return countAll[0].count;
  }

  return 0;
}

async function sumTotalAmountCompletedUserServicePackage(startDate, endDate) {
  const ServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  const { PACKAGE_CATEGORY, ACTIVITY_STATUS } = require('../PaymentServicePackage/PaymentServicePackageConstant');

  let countAll = 0;
  let countAllCompleted = await ServicePackageUserViews.customSum(
    'packagePaymentAmount',
    {
      packageCategory: PACKAGE_CATEGORY.NORMAL,
      packageActivityStatus: ACTIVITY_STATUS.COMPLETED,
    },
    undefined,
    startDate,
    endDate,
  );
  if (countAllCompleted) {
    countAll += countAllCompleted[0].sumResult;
  }

  return countAll;
}

async function countTotalCompletedUserServicePackage(startDate, endDate) {
  const ServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  const { PACKAGE_CATEGORY, ACTIVITY_STATUS } = require('../PaymentServicePackage/PaymentServicePackageConstant');

  let countAll = 0;
  let countAllCompleted = await ServicePackageUserViews.customCount(
    {
      packageCategory: PACKAGE_CATEGORY.NORMAL,
      packageActivityStatus: ACTIVITY_STATUS.COMPLETED,
    },
    undefined,
    startDate,
    endDate,
  );
  if (countAllCompleted) {
    countAll += countAllCompleted[0].count;
  }

  let countAllCanceled = await ServicePackageUserViews.customCount(
    {
      packageCategory: PACKAGE_CATEGORY.NORMAL,
      packageActivityStatus: ACTIVITY_STATUS.CANCELED,
    },
    undefined,
    startDate,
    endDate,
  );
  if (countAllCanceled) {
    countAll += countAllCanceled[0].count;
  }

  return countAll;
}

async function countTotalUserServicePackage(startDate, endDate) {
  const ServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  const { PACKAGE_CATEGORY } = require('../PaymentServicePackage/PaymentServicePackageConstant');

  let countAll = await ServicePackageUserViews.customCount(
    {
      packageCategory: PACKAGE_CATEGORY.NORMAL,
    },
    undefined,
    startDate,
    endDate,
  );
  if (countAll) {
    return countAll[0].count;
  }

  return 0;
}

async function countTotalUserBonusServicePackage(startDate, endDate) {
  const ServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  const { PACKAGE_CATEGORY } = require('../PaymentServicePackage/PaymentServicePackageConstant');

  let countAll = 0;
  let countAllRank = await ServicePackageUserViews.customCount(
    {
      packageCategory: PACKAGE_CATEGORY.BONUS_RANK,
    },
    undefined,
    startDate,
    endDate,
  );

  if (countAllRank) {
    countAll += countAllRank[0].count;
  }

  let countAllBonusNormal = await ServicePackageUserViews.customCount(
    {
      packageCategory: PACKAGE_CATEGORY.BONUS_NORMAL,
    },
    undefined,
    startDate,
    endDate,
  );

  if (countAllBonusNormal) {
    countAll += countAllBonusNormal[0].count;
  }

  let countAllBonusKYC = await ServicePackageUserViews.customCount(
    {
      packageCategory: PACKAGE_CATEGORY.BONUS_KYC,
    },
    undefined,
    startDate,
    endDate,
  );

  if (countAllBonusKYC) {
    countAll += countAllBonusKYC[0].count;
  }

  return countAll;
}

async function countTotalBalanceUnit() {
  const BalanceUnitResource = require('../WalletBalanceUnit/resourceAccess/WalletBalanceUnitResourceAccess');
  let countAll = await BalanceUnitResource.count({});
  if (countAll) {
    return countAll[0].count;
  }

  return 0;
}

async function sumTotalUserPaymentDeposit(startDate, endDate) {
  const PaymentDepositResource = require('../PaymentDepositTransaction/resourceAccess/PaymentDepositTransactionResourceAccess');
  let sumAll = await PaymentDepositResource.customSum({}, startDate, endDate);
  if (sumAll) {
    return sumAll[0].sumResult;
  }

  return 0;
}

async function sumTotalUserPaymentWithdraw(startDate, endDate) {
  const WithdrawTransactionUserView = require('../PaymentWithdrawTransaction/resourceAccess/WithdrawTransactionUserView');
  const { WALLET_TYPE } = require('../Wallet/WalletConstant');

  let sumAll = await WithdrawTransactionUserView.customSum(
    'paymentAmount',
    {
      walletType: WALLET_TYPE.USDT,
    },
    startDate,
    endDate,
  );
  if (sumAll) {
    return sumAll[0].sumResult;
  }

  return 0;
}

async function sumTotalUserPaymentExchange(startDate, endDate) {
  const PaymentExchangeResource = require('../PaymentExchangeTransaction/resourceAccess/PaymentExchangeTransactionResourceAccess');
  const { WALLET_TYPE } = require('../Wallet/WalletConstant');
  const filter = {};
  filter.walletTypeBefore = WALLET_TYPE.FAC;
  filter.walletTypeAfter = WALLET_TYPE.USDT;

  let sumAll = await PaymentExchangeResource.customSum(filter, startDate, endDate);
  if (sumAll) {
    return sumAll[0].sumResult;
  }

  return 0;
}

async function sumTotalUserPaymentService(startDate, endDate) {
  const ServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  let sumAll = await ServicePackageUserViews.customSum('packagePaymentAmount', {}, undefined, startDate, endDate);
  if (sumAll) {
    return sumAll[0].sumResult;
  }

  return 0;
}

async function sumTotalUserSellRecord(startDate, endDate) {
  // let sumAll = await PaymentDepositResource.customSum({}, startDate, endDate);
  // if (sumAll) {
  //   return sumAll[0].sumResult;
  // }

  return 0;
}

async function summaryWalletBalanceUnit(startDate, endDate) {
  const ServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  let distinctFields = ['walletBalanceUnitDisplayName', 'walletBalanceUnitCode', 'walletBalanceUnitAvatar'];

  let sumAll = await ServicePackageUserViews.customSumCountDistinct(distinctFields, {}, startDate, endDate);
  console.log(sumAll);
  if (sumAll) {
    return sumAll;
  }

  return [];
}

async function summaryUserPaymentServicePackage(startDate, endDate) {
  let distinctFields = ['packageName'];

  const ServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  let sumAll = await ServicePackageUserViews.customSumCountDistinct(distinctFields, {}, startDate, endDate);

  if (sumAll) {
    return sumAll;
  }

  return [];
}

async function countTotalNewUsers(startDate, endDate) {
  const AppUserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
  let countAll = await AppUserResource.customCount({}, undefined, startDate, endDate);
  if (countAll) {
    return countAll[0].count;
  }

  return 0;
}
async function CountMemberShip(startDate, endDate) {
  const AppUserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
  let countAll = await AppUserResource.customCountMemberShip({}, undefined, startDate, endDate);
  if (countAll) {
    return countAll[0].count;
  }

  return 0;
}
async function countTotalAgency() {
  const StaffResource = require('../Staff/resourceAccess/StaffResourceAccess');
  const AGENCY_ROLE = 5;
  let countAll = await StaffResource.count({
    roleId: AGENCY_ROLE,
  });
  if (countAll) {
    return countAll[0].count;
  }

  return 0;
}
function _extractCreatedDate(createdDateList, newListData) {
  if (newListData) {
    for (let i = 0; i < newListData.length; i++) {
      const _newDate = newListData[i];
      if (createdDateList.indexOf(_newDate.createdDate) < 0) {
        createdDateList.push(_newDate.createdDate);
      }
    }
  }
  return createdDateList;
}

function _extractSummaryResult(createdDate, summaryResultList) {
  if (summaryResultList) {
    for (let i = 0; i < summaryResultList.length; i++) {
      const _result = summaryResultList[i];
      if (createdDate === _result.createdDate) {
        return _result.totalSum;
      }
    }
  }

  return 0;
}

async function summaryUserPayment(appUserId, startDate, endDate) {
  const DepositTransactionUserView = require('../PaymentDepositTransaction/resourceAccess/PaymentDepositTransactionUserView');
  let summaryDeposit = await DepositTransactionUserView.sumAmountDistinctByDate({ appUserId: appUserId }, startDate, endDate);

  const WithdrawTransactionUserView = require('../PaymentWithdrawTransaction/resourceAccess/WithdrawTransactionUserView');
  let summaryWithdraw = await WithdrawTransactionUserView.sumAmountDistinctByDate({ appUserId: appUserId }, startDate, endDate);

  const ExchangeTransactionUserView = require('../PaymentExchangeTransaction/resourceAccess/ExchangeTransactionUserView');
  let summaryBuy = await ExchangeTransactionUserView.sumAmountDistinctByDate({ appUserId: appUserId }, startDate, endDate);

  let summarySell = await ExchangeTransactionUserView.sumAmountDistinctByDate({ referId: appUserId }, startDate, endDate);

  let createdDateList = [];
  createdDateList = _extractCreatedDate(createdDateList, summaryDeposit);
  createdDateList = _extractCreatedDate(createdDateList, summaryWithdraw);
  createdDateList = _extractCreatedDate(createdDateList, summaryBuy);
  createdDateList = _extractCreatedDate(createdDateList, summarySell);
  createdDateList = createdDateList.sort();

  let summaryResultList = [];
  for (let i = 0; i < createdDateList.length; i++) {
    const _createdDate = createdDateList[i];
    let _newSummaryResult = {
      createdDate: _createdDate,
      totalDeposit: _extractSummaryResult(_createdDate, summaryDeposit),
      totalWithdraw: _extractSummaryResult(_createdDate, summaryWithdraw),
      totalSell: _extractSummaryResult(_createdDate, summaryBuy),
      totalBuy: _extractSummaryResult(_createdDate, summarySell),
    };
    summaryResultList.push(_newSummaryResult);
  }

  return summaryResultList;
}

async function summaryReferUser(appUserId, skip = 0, limit = 5) {
  const AppUserResource = require('../AppUsers/resourceAccess/AppUsersResourceAccess');

  const SummaryServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/SummaryPaymentServicePackageUserView');
  const SummaryDepositUserViews = require('../PaymentDepositTransaction/resourceAccess/SummaryUserPaymentDepositTransactionView');
  const SummaryWithdrawUserViews = require('../PaymentWithdrawTransaction/resourceAccess/SummaryUserWithdrawTransactionView');
  const SummaryExchangeUserViews = require('../PaymentExchangeTransaction/resourceAccess/SummaryUserExchangeTransactionView');

  const DEPOSIT_TRX_STATUS = require('../PaymentDepositTransaction/PaymentDepositTransactionConstant').DEPOSIT_TRX_STATUS;
  const WITHDRAW_TRX_STATUS = require('../PaymentWithdrawTransaction/PaymentWithdrawTransactionConstant').WITHDRAW_TRX_STATUS;
  const EXCHANGE_TRX_STATUS = require('../PaymentExchangeTransaction/PaymentExchangeTransactionConstant').EXCHANGE_TRX_STATUS;

  let summaryResult = {
    summaryData: [],
    summaryCountTotal: 0,
    summaryTotalDeposit: 0,
    summaryTotalWithdraw: 0,
    summaryTotalBuy: 0,
    summaryTotalSell: 0,
  };
  let totalCountReferUser = await AppUserResource.count({
    referUserId: appUserId,
  });

  if (!totalCountReferUser || totalCountReferUser.length <= 0) {
    Logger.info(`There is no data to summary refer user for appUserId ${appUserId}`);
    //No data to summary
    return summaryResult;
  }

  const _order = {
    key: 'appUserId',
    value: 'desc',
  };
  let _userList = await AppUserResource.find(
    {
      referUserId: appUserId,
    },
    skip,
    limit,
    _order,
  );

  if (!_userList) {
    Logger.info(`There is no data to summary refer user for appUserId ${appUserId}`);
    //No data to summary
    return summaryResult;
  }
  let userSummaryRecords = [];
  for (let i = 0; i < _userList.length; i++) {
    const _userData = _userList[i];
    let summaryDeposit = await SummaryDepositUserViews.find(
      {
        appUserId: _userData.appUserId,
        paymentStatus: DEPOSIT_TRX_STATUS.COMPLETED,
      },
      0,
      1,
      _order,
    );

    let summaryWithdraw = await SummaryWithdrawUserViews.find(
      {
        appUserId: _userData.appUserId,
        paymentStatus: WITHDRAW_TRX_STATUS.COMPLETED,
      },
      0,
      1,
      _order,
    );

    let summaryBuy = await SummaryServicePackageUserViews.find(
      {
        appUserId: _userData.appUserId,
      },
      0,
      1,
      _order,
    );

    let summarySell = await SummaryExchangeUserViews.find(
      {
        appUserId: _userData.appUserId,
        paymentStatus: EXCHANGE_TRX_STATUS.COMPLETED,
      },
      0,
      1,
      _order,
    );

    let _summaryRecord = {
      totalWithdraw: 0,
      totalDeposit: 0,
      totalBuy: 0,
      totalSell: 0,
      username: _userData.username,
      appUserId: _userData.appUserId,
    };

    if (summaryDeposit && summaryDeposit.length > 0) {
      _summaryRecord.totalDeposit = summaryDeposit[0].totalSum;
    }

    if (summaryWithdraw && summaryWithdraw.length > 0) {
      _summaryRecord.totalWithdraw = summaryWithdraw[0].totalSum;
    }

    if (summaryBuy && summaryBuy.length > 0) {
      _summaryRecord.totalBuy = summaryBuy[0].totalSum;
    }

    if (summarySell && summarySell.length > 0) {
      _summaryRecord.totalSell = summarySell[0].totalSum;
    }

    userSummaryRecords.push(_summaryRecord);
  }

  //summaryTotalDeposit
  let _summaryTotalDeposit = await SummaryDepositUserViews.sum('totalSum', {
    paymentStatus: DEPOSIT_TRX_STATUS.COMPLETED,
    referUserId: appUserId,
  });

  if (_summaryTotalDeposit && _summaryTotalDeposit.length > 0) {
    summaryResult.summaryTotalDeposit = _summaryTotalDeposit[0].sumResult;
  }

  //_summaryTotalWithdraw
  let _summaryTotalWithdraw = await SummaryWithdrawUserViews.sum('totalSum', {
    paymentStatus: WITHDRAW_TRX_STATUS.COMPLETED,
    referUserId: appUserId,
  });

  if (_summaryTotalWithdraw && _summaryTotalWithdraw.length > 0) {
    summaryResult.summaryTotalWithdraw = _summaryTotalWithdraw[0].sumResult;
  }

  //summaryTotalBuy
  let _summaryTotalBuy = await SummaryServicePackageUserViews.sum('totalSum', {
    referUserId: appUserId,
  });

  if (_summaryTotalBuy && _summaryTotalBuy.length > 0) {
    summaryResult.summaryTotalBuy = _summaryTotalBuy[0].sumResult;
  }

  //_summaryTotalSell
  let _summaryTotalSell = await SummaryExchangeUserViews.sum('totalSum', {
    paymentStatus: EXCHANGE_TRX_STATUS.COMPLETED,
    referUserId: appUserId,
  });

  if (_summaryTotalSell && _summaryTotalSell.length > 0) {
    summaryResult.summaryTotalSell = _summaryTotalSell[0].sumResult;
  }

  summaryResult.summaryData = userSummaryRecords;
  summaryResult.summaryCountTotal = totalCountReferUser[0].count;

  return summaryResult;
}
async function countTotalMiningUser(startDate, endDate, distinctFields) {
  const UserServicePackage = require('../PaymentServicePackage/resourceAccess/PaymentServicePackageUserResourceAccess');
  let countResult = await UserServicePackage.customCountDistinct({}, distinctFields, startDate, endDate);
  if (countResult) {
    return countResult[0].CountResult;
  }
  return 0;
}
async function sumTotal(firstFields, secondFields, startDate, endDate) {
  const UserServicePackage = require('../PaymentServicePackage/resourceAccess/PaymentServicePackageUserResourceAccess');
  let sumFirstFields = await UserServicePackage.customSum({}, firstFields, startDate, endDate);
  let sumSecondFields = await UserServicePackage.customSum({}, secondFields, startDate, endDate);
  let sumAll = 0;
  let sumFirstFieldsResult;
  let sumSecondFieldsResult;
  if (sumFirstFields && sumFirstFields.length > 0) {
    sumFirstFieldsResult = sumFirstFields[0].sumResult;
  } else {
    sumFirstFieldsResult = 0;
  }
  if (sumSecondFields && sumSecondFields.length > 0) {
    sumSecondFieldsResult = sumSecondFields[0].sumResult;
  } else {
    sumSecondFieldsResult = 0;
  }
  return (sumAll = sumFirstFieldsResult + sumSecondFieldsResult);
}

async function countTotalPaymentServicePackageUser(filter, startDate, endDate) {
  const UserServicePackage = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  let countResult = await UserServicePackage.customCount(filter, undefined, startDate, endDate);
  if (countResult) {
    return countResult[0].count;
  }
  return 0;
}

async function countTotalPaymentServicePackageUserView(filter, startDate, endDate) {
  const ServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  let countResult = await ServicePackageUserViews.customCount(filter, startDate, endDate);
  if (countResult) {
    return countResult[0].count;
  }
  return 0;
}

async function sumTotalProfitServicePackageUser(filter, startDate, endDate) {
  const ServicePackageUserViews = require('../PaymentServicePackage/resourceAccess/ServicePackageUserViews');
  let sumResult = await ServicePackageUserViews.customSumProfit(filter, startDate, endDate);
  if (sumResult) {
    return sumResult[0];
  }

  return undefined;
}

module.exports = {
  countTotalNewUsers,
  countTotalAgency,
  summaryUserPaymentServicePackage,
  summaryWalletBalanceUnit,
  sumTotalUserSellRecord,
  sumTotalUserPaymentService,
  sumTotalUserPaymentWithdraw,
  sumTotalUserPaymentDeposit,
  sumTotalUserPaymentExchange,
  countTotalBalanceUnit,
  countTotalServicePackage,
  countTotalUser,
  summaryUserPayment,
  summaryReferUser,
  sumTotal,
  countTotalMiningUser,
  CountMemberShip,
  countTotalPaymentServicePackageUser,
  countTotalPaymentServicePackageUserView,
  sumTotalProfitServicePackageUser,
  countTotalUserServicePackage,
  countTotalUserBonusServicePackage,
  countTotalCompletedUserServicePackage,
  sumTotalAmountCompletedUserServicePackage,
};
