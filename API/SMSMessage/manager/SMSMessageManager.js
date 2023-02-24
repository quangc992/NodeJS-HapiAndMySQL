/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Logger = require('../../../utils/logging');
const SMSMessageFunctions = require('../SMSMessageFunctions');
const SMSMessageResourceAccess = require('../resourceAccess/SMSMessageResourceAccess');
const PaymentDepositTransactionFunctions = require('../../PaymentDepositTransaction/PaymentDepositTransactionFunctions');
const { SMS_MESSAGE_STATUS } = require('../SMSMessageConstants');
const { ERROR } = require('../../Common/CommonConstant');
async function insert(req) {
  return await _createSMSMessage(req);
}

async function create(req) {
  return await _createSMSMessage(req);
}

async function _createSMSMessage(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      await SMSMessageFunctions.verifySMS(data);
      // get informations from message
      let formattedData = await SMSMessageFunctions.handleDetectSMSMessage(data.smsMessageContent);

      // create payment deposit
      let paymentDepositId = null;
      if (formattedData && formattedData.smsMessageBalanceAmount && formattedData.smsMessageAppUserId) {
        paymentDepositId = await PaymentDepositTransactionFunctions.createDepositTransaction(
          { appUserId: formattedData.smsMessageAppUserId },
          formattedData.smsMessageBalanceAmount,
          null,
        );
        if (paymentDepositId && paymentDepositId.length > 0) {
          paymentDepositId = paymentDepositId[0];
        } else {
          console.error(`error SMS Message create faild: ${ERROR}`);
          reject('failed');
          return;
        }
        // auto approve transaction
        await PaymentDepositTransactionFunctions.approveDepositTransaction(paymentDepositId, null, 'SYSTEM_AUTO_APPROVE');
      } else {
        formattedData = {};
        data.smsMessageStatus = SMS_MESSAGE_STATUS.SKIP;
      }

      let insertMsgRes = await SMSMessageResourceAccess.insert({
        smsMessageContent: data.smsMessageContent,
        smsMessageNote: data.smsMessageNote,
        smsMessageOrigin: data.smsMessageOrigin,
        smsMessageStatus: data.smsMessageStatus,
        smsReceiveTime: data.smsReceiveTime,
        smsReceiveDate: data.smsReceiveDate,
        smsReceiveMessageTime: formattedData.smsReceiveMessageTime,
        smsReceiveMessageDate: formattedData.smsReceiveMessageDate,
        smsHash: data.smsHash,
        smsMessageBalanceAmount: formattedData.smsMessageBalanceAmount,
        smsMessageAppUserId: formattedData.smsMessageAppUserId,
        smsMessageRef: paymentDepositId, // store ref sms message
      });
      if (insertMsgRes) {
        resolve(insertMsgRes[0]);
      } else {
        console.error(`error SMS Message create faild: ${ERROR}`);
        reject('failed');
      }
    } catch (error) {
      Logger.error('insert sms message error', error);
      reject('failed');
    }
  });
}

async function find(req) {
  return await _find(req);
}

async function getList(req) {
  req.payload.smsMessageStationId = req.currentUser.stationId;
  return await _find(req);
}

async function _find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      let listSMSMessage = await SMSMessageResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      if (listSMSMessage) {
        let count = await SMSMessageResourceAccess.customCount(filter, undefined, undefined, startDate, endDate, searchText);
        resolve({ data: listSMSMessage, count: count[0].count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error('find sms message list error', error);
      reject('failed');
    }
  });
}

async function findById(req) {
  return await _findDetailById(req);
}

async function getDetailById(req) {
  return await _findDetailById(req);
}

async function _findDetailById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      if (!data.id) {
        reject('INVALID_SMS_MESSAGE_ID');
        return;
      }
      let existSMSMessage = await SMSMessageResourceAccess.findById(data.id);
      if (existSMSMessage) {
        resolve(existSMSMessage);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error('find sms message detail error', error);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let data = req.payload.data;
      let updateResult = await SMSMessageResourceAccess.updateById(id, data);
      if (updateResult) {
        resolve(updateResult);
      } else {
        console.error(`error SMS Message updateById with id ${id}: ${ERROR}`);
        reject('failed');
      }
    } catch (error) {
      Logger.error('update sms message detail error', error);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  create,
  findById,
  getDetailById,
  find,
  getList,
  updateById,
};
