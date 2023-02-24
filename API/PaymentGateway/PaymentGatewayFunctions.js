/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const VNPAYFunctions = require('../../ThirdParty/PaymentGatewayVNPAYQR/VNPAYGatewayFunctions');
const MOMOFunctions = require('../../ThirdParty/PaymentGatewayMOMO/MOMOFunctions');
const PaymentDepositResource = require('../PaymentDepositTransaction/resourceAccess/PaymentDepositTransactionResourceAccess');
const WalletResource = require('../Wallet/resourceAccess/WalletResourceAccess');
const { DEPOSIT_TRX_STATUS } = require('../PaymentDepositTransaction/PaymentDepositTransactionConstant');
const { WALLET_TYPE } = require('../Wallet/WalletConstant');

async function createVNPAYPaymentRequest(transactionId, paymentAmount, ipAddr) {
  return await VNPAYFunctions.makePaymentRequestVNPAY(transactionId, transactionId, paymentAmount, ipAddr);
}

async function _failureTransaction(transactionData) {
  //update transaction record status
  let updatedResult = await PaymentDepositResource.updateById(transactionData.paymentDepositTransactionId, {
    paymentStatus: DEPOSIT_TRX_STATUS.CANCELED,
    paymentApproveDate: new Date(),
  });

  return updatedResult;
}

async function _succeedTransaction(transactionData) {
  const FUNC_FAILED = undefined;
  const VND_TO_POINT = process.env.VND_TO_POINT || 1; //1 VND = 1 point

  //update transaction record status
  let updatedResult = await PaymentDepositResource.updateById(transactionData.paymentDepositTransactionId, {
    paymentStatus: DEPOSIT_TRX_STATUS.COMPLETED,
    paymentApproveDate: new Date(),
  });
  if (updatedResult) {
    //find POINT wallet to update
    let pointWallet = await WalletResource.find({
      appUserId: transactionData.appUserId,
      walletType: WALLET_TYPE.POINT,
    });
    if (!pointWallet) {
      return FUNC_FAILED;
    }
    pointWallet = pointWallet[0];
    pointWallet.balance = parseInt(pointWallet.balance + (transactionData.paymentAmount + transactionData.paymentRewardAmount) / VND_TO_POINT);

    //update wallet balance
    let updateBalanceResult = await WalletResource.updateBalanceTransaction([pointWallet]);
    if (updateBalanceResult) {
      return updateBalanceResult;
    }
  }
  return FUNC_FAILED;
}

async function receiveVNPAYPaymentRequest(vnpayData) {
  let transactionCode = vnpayData.vnp_TxnRef;

  let confirmResult = undefined;

  if (!transactionCode) {
    return confirmResult;
  }

  let transactionData = await PaymentDepositResource.find(
    {
      paymentTransactionCode: transactionCode,
    },
    0,
    1,
  );
  if (transactionData && transactionData.length > 0) {
    transactionData = transactionData[0];

    let paymentStatus = transactionData.paymentStatus;
    let paymentAmount = transactionData.paymentAmount;

    confirmResult = await VNPAYFunctions.verifyPaymentFromVNPAY(vnpayData, transactionCode, paymentAmount, paymentStatus);

    //check payment result
    if (confirmResult && confirmResult.result && confirmResult.result.RspCode === '00' && confirmResult.paymentStatus === 'Success') {
      await _succeedTransaction(transactionData);
    } else {
      await _failureTransaction(transactionData);
    }
  }
  return confirmResult;
}

async function createMOMOPaymentRequest(transactionId, paymentAmount) {
  return await MOMOFunctions.makePaymentRequestMOMO(transactionId, transactionId, paymentAmount);
}

async function receiveMOMOPaymentRequest(momoData) {
  let transactionCode = momoData.extraData;

  let confirmResult = undefined;

  if (!transactionCode) {
    return confirmResult;
  }

  let transactionData = await PaymentDepositResource.find(
    {
      paymentTransactionCode: transactionCode,
    },
    0,
    1,
  );

  if (transactionData && transactionData.length > 0) {
    transactionData = transactionData[0];

    let paymentStatus = transactionData.paymentStatus;
    let paymentAmount = transactionData.paymentAmount;

    confirmResult = await MOMOFunctions.verifyPaymentFromMOMO(momoData, transactionCode, paymentAmount, paymentStatus);

    //check payment result
    if (confirmResult && confirmResult.result && confirmResult.result.RspCode === '00' && confirmResult.paymentStatus === 'Success') {
      await _succeedTransaction(transactionData);
    } else {
      await _failureTransaction(transactionData);
    }
  }
  return confirmResult;
}

module.exports = {
  createVNPAYPaymentRequest,
  receiveVNPAYPaymentRequest,
  createMOMOPaymentRequest,
  receiveMOMOPaymentRequest,
};
