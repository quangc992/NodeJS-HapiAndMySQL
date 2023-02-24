/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Logger = require('../../../utils/logging');
const PaymentGatewayFunctions = require('../PaymentGatewayFunctions');
const PaymentDepositResource = require('../../PaymentDepositTransaction/resourceAccess/PaymentDepositTransactionResourceAccess');
const PaymentServicePackage = require('../../PaymentServicePackage/resourceAccess/PaymentServicePackageResourceAccess');
const WalletResource = require('../../Wallet/resourceAccess/WalletResourceAccess');
const { PAYMENT_METHOD } = require('../../PaymentMethod/PaymentMethodConstant');
const { WALLET_TYPE } = require('../../Wallet/WalletConstant');

async function _createNewDepositRecord(user, servicePackage, paymentMethodId = PAYMENT_METHOD.CASH) {
  let _paymentAmount = servicePackage.rechargePackage;
  if (servicePackage.promotion && servicePackage.promotion !== null && servicePackage.promotion !== '') {
    _paymentAmount = _paymentAmount - (servicePackage.rechargePackage * servicePackage.promotion) / 100;
  }

  let userWallet = await WalletResource.find(
    {
      appUserId: user.appUserId,
      walletType: WALLET_TYPE.POINT,
    },
    0,
    1,
  );

  if (!userWallet || userWallet.length <= 0) {
    Logger.error(`can not find wallet for user ${user.appUserId} to _createNewDepositRecord`);
    return undefined;
  }

  let depositData = {
    appUserId: user.appUserId,
    walletId: userWallet[0].walletId,
    paymentMethodId: paymentMethodId,
    paymentAmount: _paymentAmount,
    paymentRewardAmount: servicePackage.rechargePackage,
  };

  let createResult = await PaymentDepositResource.insert(depositData);
  if (createResult) {
    return createResult[0];
  } else {
    Logger.error(`can not _createNewDepositRecord ${user.appUserId} - amount ${amount}`);
    return undefined;
  }
}
async function receivePaymentVNPAY(req) {
  let params = req.query;
  let transactionResult = await PaymentGatewayFunctions.receiveVNPAYPaymentRequest(params);
  if (transactionResult) {
    return transactionResult.result;
  } else {
    //default response for VNPAY
    return { RspCode: '00', Message: 'Confirm Success' };
  }
}

function makePaymentRequestVNPAY(req) {
  return new Promise(async (resolve, reject) => {
    let servicePackageId = req.payload.servicePackageId;
    //find service package to get package info
    let _servicePackage = await PaymentServicePackage.findById(servicePackageId);
    if (!_servicePackage) {
      Logger.error(`can not PaymentServicePackage.findById ${servicePackageId}`);
      reject('failed');
    }

    let _paymentAmount = _servicePackage.rechargePackage;
    if (_servicePackage.promotion && _servicePackage.promotion !== null && _servicePackage.promotion !== '') {
      _paymentAmount = _paymentAmount - (_servicePackage.rechargePackage * _servicePackage.promotion) / 100;
    }

    let newTransactionId = await _createNewDepositRecord(req.currentUser, _servicePackage, PAYMENT_METHOD.VNPAY);
    if (!newTransactionId) {
      Logger.error(`can not create new transaction record`);
      reject('failed');
    }

    let transactionResult = await PaymentGatewayFunctions.createVNPAYPaymentRequest(newTransactionId, _paymentAmount);

    resolve({
      ...transactionResult,
      transactionId: newTransactionId,
    });
  });
}

//This API is used for mobile only with payment method app-to-app via ATM card
//with this redirect URL, SDK from VNPAY will callback to our app
function finishVNPAYPayment(req) {
  return `<head><meta http-equiv='refresh' content='0; URL=http://sdk.merchantbackapp'></head>`;
}

function verifyVNPAYPayment(req) {
  return new Promise((resolve, reject) => {
    const data = req.payload;

    const result = PaymentGatewayFunctions.verifyVNPAYPayment(data);
    resolve(result);
  });
}

async function receivePaymentMOMO(req) {
  let paymentData = req.payload;

  return new Promise(async (resolve, reject) => {
    try {
      let transactionResult = await PaymentGatewayFunctions.receiveMOMOPaymentRequest(paymentData);
      if (transactionResult) {
        resolve(transactionResult);
      } else {
        reject('transaction failed');
      }
    } catch (error) {
      console.error(error);
      reject('transaction error');
    }
  });
}

function makePaymentRequestMOMO(req) {
  return new Promise(async (resolve, reject) => {
    let servicePackageId = req.payload.servicePackageId;

    //find service package to get package info
    let _servicePackage = await PaymentServicePackage.findById(servicePackageId);
    if (!_servicePackage) {
      Logger.error(`can not PaymentServicePackage.findById ${servicePackageId}`);
      reject('failed');
    }

    let _paymentAmount = _servicePackage.rechargePackage;
    if (_servicePackage.promotion && _servicePackage.promotion !== null && _servicePackage.promotion !== '') {
      _paymentAmount = _paymentAmount - (_servicePackage.rechargePackage * _servicePackage.promotion) / 100;
    }

    let newTransactionId = await _createNewDepositRecord(req.currentUser, _servicePackage, PAYMENT_METHOD.MOMO);
    if (!newTransactionId) {
      Logger.error(`can not create new transaction record`);
      reject('failed');
    }

    let transactionResult = PaymentMOMOGatewayFunctions.makePaymentRequestMOMO(data);
    resolve(transactionResult);
  });
}

module.exports = {
  receivePaymentVNPAY,
  makePaymentRequestVNPAY,
  verifyVNPAYPayment,
  finishVNPAYPayment,
  makePaymentRequestMOMO,
  receivePaymentMOMO,
};
