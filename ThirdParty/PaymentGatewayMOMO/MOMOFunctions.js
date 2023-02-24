/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

require('dotenv').config();

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const CONFIRM_ROLLBACK = 'revertAuthorize'; //huy bo giao dich
const CONFIRM_CAPTURE = 'capture'; //xac nhan giao dich

async function _sendPaymentRequestToMoMo(data) {
  const hostUrl = process.env.MOMO_URL;
  let input = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    partnerRefId: data.orderId.toString(),
    customerNumber: data.customerNumber,
    appData: data.appData,
    hash: data.hash,
    version: 2,
    payType: 3,
    description: `Thanh toan don hang <${data.orderId}>`,
  };

  return new Promise((resolve, reject) => {
    chai
      .request(hostUrl)
      .post('/pay/app')
      .send(input)
      .end((err, res) => {
        if (err) {
          console.log(err);
          resolve('');
          return;
        }
        resolve(res.body);
      });
  });
}

async function _sendConfirmRequestToMoMo(data, confirmation, rollbackReason) {
  if (!confirmation && confirmation !== '') {
    confirmation = CONFIRM_ROLLBACK;
  }

  const hostUrl = process.env.MOMO_URL;

  var rawSignature =
    'partnerCode=' +
    process.env.MOMO_PARTNER_CODE +
    '&partnerRefId=' +
    data.partnerRefId +
    '&requestType=' +
    confirmation +
    '&requestId=' +
    data.partnerTransId +
    '&momoTransId=' +
    data.momoTransId;

  //puts raw signature
  let hash = makeMOMOHash(rawSignature);

  let input = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    // customerNumber: data.customerNumber,
    partnerRefId: data.partnerRefId,
    requestType: confirmation,
    requestId: data.partnerTransId,
    momoTransId: data.momoTransId,
    signature: hash,
    description: rollbackReason,
  };
  console.log(input);
  return new Promise((resolve, reject) => {
    chai
      .request(hostUrl)
      .post('/pay/confirm')
      .send(input)
      .end((err, res) => {
        if (err) {
          console.log(err);
          resolve('');
          return;
        }
        resolve(res.body);
      });
  });
}

function makeMOMORSA(orderId, paymentId, paymentAmount) {
  // npm install node-rsa
  const NodeRSA = require('node-rsa');

  // using your public key get from https://business.momo.vn/
  //const fs = require('fs');
  //const pubKey = fs.readFileSync('rsa.pub');
  const pubKey = '' + '-----BEGIN PUBLIC KEY-----' + process.env.MOMO_PUB_KEY + '-----END PUBLIC KEY-----';

  const key = new NodeRSA(pubKey, { encryptionScheme: 'pkcs1' });
  let jsonData = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    partnerRefId: orderId.toString(),
    partnerTransId: paymentId.toString(),
    amount: paymentAmount,
  };
  const encrypted = key.encrypt(JSON.stringify(jsonData), 'base64');

  return encrypted;
}

function makeMOMOHash(text) {
  console.log('makeMOMOHash');
  //signature
  const crypto = require('crypto');
  var signature = crypto.createHmac('sha256', process.env.MOMO_SECRET).update(text).digest('hex');
  console.log('--------------------SIGNATURE----------------');
  console.log(signature);
  return signature;
}

//this API was call to make payment url
async function makePaymentRequestMOMO(appData, orderId, paymentId, transactionAmount, transactionStatus, customerPhoneNumber) {
  try {
    let paymentAmount = transactionAmount;

    if (orderId === undefined || orderId === null) {
      console.error('Order is invalid');
      return undefined;
    }

    if (transactionAmount === undefined || transactionAmount === null || transactionAmount < 1) {
      console.error('Order payment does not match');
      return undefined;
    }

    //check if order is paid or not
    if (paymentId || (paymentId !== null && paymentId !== '')) {
      console.error('Order have invalid paymentId');
      return undefined;
    }

    if (transactionStatus !== STATUS_PENDING) {
      console.error('Order was paid already');
      return undefined;
    }

    //Make Hash for transaction request
    //puts raw signature
    let hash = makeMOMORSA(orderId, paymentId, paymentAmount);

    let paymentData = {
      orderId: orderId,
      hash: hash,
      paymentId: paymentId,
      customerNumber: customerPhoneNumber || '',
      appData: appData,
    };

    let requestPaymentResult = await _sendPaymentRequestToMoMo(paymentData);
    if (requestPaymentResult.status === 0) {
      return {
        statusCode: 200,
        message: 'Success',
      };
    } else {
      console.error('Failed to pay order');
      return undefined;
    }
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

//this function was call by MOMO via our registered webhooks
//output:
//--result: we will response this result to MOMO
//--paymentStatus: this is payment status after verification
//BEWARE !! After call this method to verify payment,
//we also need to check again updated status of transaction in our Database
//before response "success" to MOMO
//Somehow, sometimes, we can not update transaction in our database
//then please response failure to MOMO webhooks
async function verifyPaymentFromMOMO(paymentData, transactionId, transactionAmount, transactionStatus) {
  const FAILED_PAYMENT = 'Failed';

  var rawSignature =
    `amount=${paymentData.amount}` +
    `&message=${paymentData.message}` +
    `&momoTransId=${paymentData.momoTransId}` +
    `&partnerRefId=${paymentData.partnerRefId}` +
    `&status=${paymentData.status}`;

  //puts raw signature
  let hash = makeMOMOHash(rawSignature);

  //always response to MOMO when receive IPN calls
  let result = {
    status: 0,
    message: paymentData.message,
    partnerRefId: paymentData.partnerRefId,
    momoTransId: paymentData.momoTransId,
    amount: paymentData.amount,
    signature: hash,
  };

  if (paymentData === undefined) {
    return {
      result,
      paymentStatus: FAILED_PAYMENT,
    };
  }

  try {
    let paymentId = paymentData.partnerTransId;

    if (transactionId === undefined || transactionId !== paymentId) {
      console.info(`Payment id ${paymentId} not found`);
      await _sendConfirmRequestToMoMo(paymentData, CONFIRM_ROLLBACK, 'Ma giao dich khong dung');
      result.status = 99;
      result.message = 'Ma giao dich khong dung';
      return {
        result,
        paymentStatus: FAILED_PAYMENT,
      };
    }

    if (paymentData.status !== 0) {
      console.info(`Payment id ${paymentId} ,order was paid`);
      await _sendConfirmRequestToMoMo(paymentData, CONFIRM_ROLLBACK, 'order da duoc thanh toan');
      result.status = 98;
      result.message = 'order da duoc thanh toan';
      return {
        result,
        paymentStatus: FAILED_PAYMENT,
      };
    }

    let paymentAmount = paymentData.amount * 1;
    if (paymentAmount === undefined || paymentAmount < 10000) {
      console.info('paymentAmount is invalid with ' + paymentAmount);
      await _sendConfirmRequestToMoMo(paymentData, CONFIRM_ROLLBACK, 'So tien thanh toan khong dung');
      result.status = 97;
      result.message = 'So tinh thanh toan khong dung';
      return {
        result,
        paymentStatus: FAILED_PAYMENT,
      };
    }

    if (transactionAmount && transactionAmount * 1 !== paymentAmount * 1) {
      console.info('transaction is invalid amount, PaymentId ' + paymentId);
      await _sendConfirmRequestToMoMo(paymentData, CONFIRM_ROLLBACK, 'so tien thanh toan khong chinh xac');
      result.status = 96;
      result.message = 'So tien thanh toan khong chinh xac';
      return {
        result,
        paymentStatus: FAILED_PAYMENT,
      };
    }

    const STATUS_PENDING = 'pending';
    if (transactionStatus && transactionStatus !== STATUS_PENDING) {
      console.info('transaction is confirmed before, PaymentId ' + paymentId);
      await _sendConfirmRequestToMoMo(paymentData, CONFIRM_ROLLBACK, 'order da duoc xu ly truoc do');
      result.status = 1;
      result.message = 'giao dich da duoc xu ly truoc do';
      return {
        result,
        paymentStatus: FAILED_PAYMENT,
      };
    }

    let confirmMomoResult = await _sendConfirmRequestToMoMo(paymentData, CONFIRM_CAPTURE, 'giao dich thanh cong');
    if (confirmMomoResult !== '' && confirmMomoResult.status === 0) {
      transactionCode = paymentData.momoTransId;
      const SUCCESS_PAYMENT = 'Success';
      return {
        result,
        paymentStatus: SUCCESS_PAYMENT,
      };
    } else {
      console.info('transaction is not confirmed by MOMO');
      return {
        result,
        paymentStatus: FAILED_PAYMENT,
      };
    }
  } catch (e) {
    console.error(e);
    return {
      result,
      paymentStatus: FAILED_PAYMENT,
    };
  }
}

module.exports = {
  verifyPaymentFromMOMO,
  makePaymentRequestMOMO,
};
