/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */

const moment = require('moment');

const StakingPackageUserView = require('../resourceAccess/StakingPackageUserView');
const StakingPackageUserResourceAccess = require('../resourceAccess/StakingPackageUserResourceAccess');

const { STACKING_ACTIVITY_STATUS, STAKING_PAYMENT_TYPE } = require('../StakingPackageConstant');

const Logger = require('../../../utils/logging');

async function collectStakingPackage(packageId) {
  const WalletResource = require('../../Wallet/resourceAccess/WalletResourceAccess');
  const { WALLET_TYPE } = require('../../Wallet/WalletConstant');

  const FUNC_FAILED = undefined;
  //find user selecting package
  let package = await StakingPackageUserResourceAccess.find(
    {
      userStakingPackageId: packageId,
    },
    0,
    1,
  );
  if (package === undefined || package.length < 1) {
    Logger.error(`collectStakingPackage invalid package ${packageId}`);
    return FUNC_FAILED;
  }
  package = package[0];

  //retrieve wallet info to check balance
  let userWallet = await WalletResource.find(
    {
      appUserId: package.appUserId,
      walletType: WALLET_TYPE.FAC, //vi fac
    },
    0,
    1,
  );

  if (userWallet === undefined || userWallet.length < 1) {
    Logger.error(`collectStakingPackage can not find wallet POINT ${package.appUserId}`);
    return FUNC_FAILED;
  }
  userWallet = userWallet[0];

  let collectAmount = package.profitActual;
  let claimedAmount = package.profitClaimed * 1 + collectAmount * 1;
  let updatedPackageData = {
    profitActual: 0,
    profitClaimed: claimedAmount,
    stakingActivityStatus: STACKING_ACTIVITY_STATUS.STAKING,
  };

  //neu da nhan du tien thi close package
  if (package.profitEstimate <= claimedAmount) {
    updatedPackageData.stakingActivityStatus = STACKING_ACTIVITY_STATUS.COMPLETED;
  }

  let collectUpdated = await StakingPackageUserResourceAccess.updateById(packageId, updatedPackageData);
  if (collectUpdated === undefined) {
    Logger.error(`collectStakingPackage can not collect`);
    return FUNC_FAILED;
  }

  //update wallet balance
  let updateWallet = await WalletResource.incrementBalance(userWallet.walletId, collectAmount);
  if (updateWallet) {
    //neu da nhan du tien thi close package va hoan tra tien goc cho user
    if (package.profitEstimate <= claimedAmount) {
      let updateWallet = await WalletResource.incrementBalance(userWallet.walletId, package.stackingAmount);
      if (updateWallet) {
        return collectAmount;
      } else {
        Logger.error(`collectStakingPackage can not pay to wallet ${userWallet.walletId}, ${paymentAmount}`);
      }
    }
    return collectAmount;
  } else {
    Logger.error(`collectStakingPackage can not pay to wallet ${userWallet.walletId}, ${paymentAmount}`);
    return FUNC_FAILED;
  }
}

async function calculateProfit() {
  Logger.info(`start calculateProfit ${new Date()}`);

  let _packagesFilter = {
    stakingActivityStatus: STACKING_ACTIVITY_STATUS.STAKING,
  };

  let userCount = await StakingPackageUserView.count(_packagesFilter);
  if (userCount === undefined || userCount.length < 1) {
    console.info('There is no user to init wallet');
    return;
  }

  userCount = userCount[0].count;
  console.info(`Need to RefreshAllprogressForWorkingPackages for ${userCount} users`);

  const MAX_PER_BATCH = 100;
  let batchCount = parseInt(userCount / MAX_PER_BATCH);
  if (batchCount * MAX_PER_BATCH < userCount) {
    batchCount = batchCount + 1;
  }

  for (let i = 0; i < batchCount; i++) {
    let _userServicePackages = await StakingPackageUserView.find(_packagesFilter, i * MAX_PER_BATCH, MAX_PER_BATCH);

    if (_userServicePackages === undefined || _userServicePackages.length < 1) {
      continue;
    }
    for (let j = 0; j < _userServicePackages.length; j++) {
      const _package = _userServicePackages[j];

      let today = new Date();

      //today = moment().add(361,'days').toDate();
      //console.log(today);

      //tinh so ngay da thuc hien staking
      let _actualDuration = moment(today).diff(new Date(_package.packageLastActiveDate), 'days');
      console.info(_actualDuration);
      console.info(`_package.stakingPaymentPeriod: ${_package.stakingPaymentPeriod}`);
      //kiem tra xem da du chu ky chua
      if (_actualDuration < _package.stakingPaymentPeriod) {
        continue;
      }

      //ti le hoan thanh staking
      let _percentCompleted = _actualDuration / _package.stakingPeriod;
      if (_percentCompleted >= 1) {
        _percentCompleted = 1;
      }
      console.info(`_percentCompleted: ${_percentCompleted}`);

      console.info(_package.stakingInterestRate);
      //loi nhuan du kien theo so ngay da staking
      let _planedProfit = (_percentCompleted * _package.stackingAmount * _package.stakingInterestRate * 1) / 100;

      //neu tra lai cuoi ky thi khong can xu ly loi nhuan giua ky
      //neu du so ngay tra lai cuoi ky thi thuc hien tra lai
      if (_package.stakingPaymentType === STAKING_PAYMENT_TYPE.FULL_PERIOD) {
        if (_actualDuration < _package.stakingPeriod) {
          _planedProfit = 0;
        } else {
          _planedProfit = _package.profitEstimate;
        }
      }

      console.info(`_planedProfit: ${_planedProfit}`);
      //loi nhuan thuc te user da nhan
      let _actualProfit = _package.profitActual + _package.profitClaimed;
      console.info(`_actualProfit: ${_actualProfit}`);

      //loi nhuan nen cong them vao (neu can thiet)
      let _shouldBeMoreProfit = 0;

      let _updateData = {};

      if (_package.stakingPaymentType === STAKING_PAYMENT_TYPE.PERIODICALLY) {
        //tinh toan loi nhuan nen cong them vao (neu can thiet)
        if (_planedProfit > _actualProfit) {
          _shouldBeMoreProfit = _planedProfit - _actualProfit;
        }

        //uoc tinh chu ky hien tai
        let _estimatePeriod = _actualDuration / _package.stakingPaymentPeriod;

        //uoc tinh % cua chu ky hien tai, lay theo decimal
        let _currentPeriod = _estimatePeriod - (_estimatePeriod - parseInt(_estimatePeriod));

        //tinh toan so ngay da qua tinh den lan cuoi cung tinh toan
        let _lastedDuration = _currentPeriod * _package.stakingPaymentPeriod;

        let _planActiveDate = moment(new Date(_package.createdAt)).add(_lastedDuration, 'days').toDate();

        _updateData.packageLastActiveDate = _planActiveDate;
      }

      _updateData.profitActual = _shouldBeMoreProfit;

      let updateProfitResult = await StakingPackageUserResourceAccess.updateById(_package.userStakingPackageId, _updateData);
      if (!updateProfitResult) {
        Logger.error(`can not updateProfitResult package ${userPackage.paymentServicePackageId} for user ${userPackage.appUserId}`);
      }

      await collectStakingPackage(_package.userStakingPackageId);
    }
  }
  Logger.info(`End calculateProfit ${new Date()}`);
}

module.exports = {
  calculateProfit,
};
