/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const PaymentServicePackageResourceAccess = require('./resourceAccess/PaymentServicePackageResourceAccess');
const ServicePackageUser = require('./resourceAccess/PaymentServicePackageUserResourceAccess');
const { PACKAGE_TYPE, PACKAGE_STATUS, PACKAGE_CATEGORY, ACTIVITY_STATUS } = require('./PaymentServicePackageConstant');
const Logger = require('../../utils/logging');
const UtilsFuntions = require('../ApiUtils/utilFunctions');
const SystemConfigurationsResourceAccess = require('../SystemConfigurations/resourceAccess/SystemConfigurationsResourceAccess');

function _getPackageTypeDetail(packageType) {
  let packageTypeList = Object.keys(PACKAGE_TYPE);

  for (let i = 0; i < packageTypeList.length; i++) {
    const _packageType = PACKAGE_TYPE[packageTypeList[i]];

    if (_packageType.type === packageType) {
      return _packageType;
    }
  }
  return undefined;
}

const DEFAULT_PACKAGE_DURATION = 360; //mac dinh la 360 ngay
async function createPackagesByPackageType(
  packageType,
  packageCategory = PACKAGE_CATEGORY.NORMAL,
  packageDuration = DEFAULT_PACKAGE_DURATION,
  isHidden = 0,
) {
  let _packageTypeDetail = _getPackageTypeDetail(packageType);
  if (!_packageTypeDetail) {
    Logger.error(`can not find package type ${packageType} to createPackagesByPackageType`);
    return undefined;
  }

  let _currentStage = await SystemConfigurationsResourceAccess.getCurrentStage();
  let _stagePerformance = _packageTypeDetail[`stage${_currentStage}`];

  let newPackage = {
    packageName: 'A100FAC',
    packageType: _packageTypeDetail.type,
    packagePrice: _packageTypeDetail.defaultPrice,
    packagePerformance: _stagePerformance,
    packageUnitId: 1,
    packageStatus: PACKAGE_STATUS.NEW,
    packageCategory: packageCategory,
    packageDuration: packageDuration,
    isHidden: isHidden,
  };
  //mac dinh package 1000$ se ko duoc mo ban
  if (packageType === PACKAGE_TYPE.A1000FAC.type) {
    newPackage.isHidden = 1;
  }

  let createResult = await PaymentServicePackageResourceAccess.insert(newPackage);
  if (createResult) {
    let hexId = createResult[0];
    hexId = hexId.toString(16);
    const MAX_PACKAGE_NAME_LENGTH = 5;

    //make new package name
    let _newPackageName = UtilsFuntions.padLeadingZeros(hexId, MAX_PACKAGE_NAME_LENGTH, '0');

    //generate name by type
    _newPackageName = _packageTypeDetail.type + _newPackageName;

    //apply prefix by stage
    let _currentPrefix = 'A'; //prefix of stage 1
    if (_currentStage === 5) {
      _currentPrefix = 'V';
    } else if (_currentStage === 4) {
      _currentPrefix = 'S';
    } else if (_currentStage === 3) {
      _currentPrefix = 'D';
    } else if (_currentStage === 2) {
      _currentPrefix = 'C';
    }

    _newPackageName = _newPackageName.slice(1, _newPackageName.length);
    _newPackageName = _currentPrefix + _newPackageName;

    //make all character to uppercase to be "CODE LIKE"
    _newPackageName = _newPackageName.toUpperCase();

    let _newPackageId = createResult[0];
    await PaymentServicePackageResourceAccess.updateById(_newPackageId, {
      packageName: _newPackageName,
    });

    return _newPackageId;
  } else {
    Logger.error(`failed to createPackagesByPackageType with ${packageType}`);
  }

  return undefined;
}

//we will generate presale packages follow maxNumberOfPackages
//total count of packages with "packageType" will be equal to maxNumberOfPackages
async function generatePresalePackages(packageType, maxNumberOfPackages, isHidden) {
  Logger.info(`generatePresalePackages ${packageType}`);
  //dem so luong presale package hien tai
  let presaleListCount = await PaymentServicePackageResourceAccess.count({
    packageType: packageType,
    isDeleted: 0,
    packageStatus: PACKAGE_STATUS.NEW,
    packageCategory: PACKAGE_CATEGORY.NORMAL,
  });

  if (presaleListCount && presaleListCount.length > 0) {
    presaleListCount = presaleListCount[0].count;
  } else {
    presaleListCount = 0;
  }

  if (presaleListCount >= maxNumberOfPackages) {
    //neu so luong presale da du roi thi ko can generate nua
    return;
  }

  let needToGenerate = parseInt(maxNumberOfPackages - presaleListCount);

  let _isHidden = 0;
  if (packageType === PACKAGE_TYPE.A1000FAC.type) {
    _isHidden = 1;
  }
  for (let i = 0; i < needToGenerate; i++) {
    await createPackagesByPackageType(packageType, undefined, undefined, _isHidden);
  }
}

//luon luon khoi tao 10 package khi he thong khoi dong
//he thong luon ton tai 10 package cho moi loai package type de san cho user mua
generatePresalePackages(PACKAGE_TYPE.A100FAC.type, 20);
generatePresalePackages(PACKAGE_TYPE.A500FAC.type, 20);
generatePresalePackages(PACKAGE_TYPE.A1000FAC.type, 20);

async function addBonusPackageForUser(appUserId, packageType) {
  //tao ra 1 goi thuong cho user
  let _newPackageId = await createPackagesByPackageType(packageType, PACKAGE_CATEGORY.BONUS_NORMAL);
  if (!_newPackageId) {
    Logger.error(`addBonusPackageForUser error whencreatePackagesByPackageType ${packageType} for user ${appUserId}`);
    return;
  }

  //lay chi tiet thong tin goi dao
  let _newPackage = await PaymentServicePackageResourceAccess.findById(_newPackageId);
  if (!_newPackage) {
    Logger.error(`addBonusPackageForUser error when find package _newPackageId ${_newPackageId}`);
    return;
  }

  //update package thanh SOLD de cac user khac khong thay
  let _updatedResult = await PaymentServicePackageResourceAccess.updateById(_newPackageId, {
    packageStatus: PACKAGE_STATUS.SOLD,
  });
  if (_updatedResult) {
    Logger.error(`addBonusPackageForUser error when update package _newPackageId ${_newPackageId} to SOLD`);
    return;
  }

  //khoi dong may dao
  let userPackageData = {
    appUserId: appUserId,
    paymentServicePackageId: _newPackageId,
    packageExpireDate: moment().add(_newPackage.packageDuration, 'days').toDate(),
    profitEstimate: _newPackage.packagePerformance * _newPackage.packageDuration,
    packagePrice: _newPackage.packagePrice,
    packageDiscountPrice: _newPackage.packageDiscountPrice,
    packagePaymentAmount: 0, // goi thuong khong can thanh toan
    packageLastActiveDate: new Date(),
    packageCurrentPerformance: _newPackage.packagePerformance,
    packageActivityStatus: ACTIVITY_STATUS.WORKING,
  };
  let newPackageResult = await ServicePackageUser.insert(userPackageData);
  if (!newPackageResult) {
    Logger.error(`addBonusPackageForUser error when active package ${JSON.stringify(userPackageData)}`);
  }
}

async function regenerateAllPresalePackage() {
  let presaleListCount = await PaymentServicePackageResourceAccess.find({
    isDeleted: 0,
    packageStatus: PACKAGE_STATUS.NEW,
    packageCategory: PACKAGE_CATEGORY.NORMAL,
  });

  for (let i = 0; i < presaleListCount.length; i++) {
    const _package = presaleListCount[i];
    await PaymentServicePackageResourceAccess.updateById(_package.paymentServicePackageId, {
      isDeleted: 1,
    });
  }
  await generatePresalePackages(PACKAGE_TYPE.A100FAC.type, 20);
  await generatePresalePackages(PACKAGE_TYPE.A500FAC.type, 20);
  await generatePresalePackages(PACKAGE_TYPE.A1000FAC.type, 20);
}

module.exports = {
  addBonusPackageForUser,
  generatePresalePackages,
  createPackagesByPackageType,
  regenerateAllPresalePackage,
};
