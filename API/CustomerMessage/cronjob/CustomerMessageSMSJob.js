/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const Joi = require('joi');
// const MessageCustomerView = require('../resourceAccess/MessageCustomerView');
// const MessageCustomer = require('../resourceAccess/MessageCustomerResourceAccess');
const CustomerMessage = require('../resourceAccess/CustomerMessageResourceAccess');
const CustomerRecord = require('../../CustomerRecord/resourceAccess/CustomerRecordResourceAccess');
const { MESSAGE_STATUS, MESSAGE_CATEGORY } = require('../CustomerMessageConstant');
const SMSAPIClientFunctions = require('../../../ThirdParty/SMSAPIClient/SMSAPIClientFunctions');
const MessageFunction = require('../CustomerMessageFunctions');
const Logger = require('../../../utils/logging');

async function _cancelAllSMSMessage(station) {
  let messageList = await CustomerMessage.find({
    customerMessageCategories: MESSAGE_CATEGORY.SMS,
    customerMessageStatus: MESSAGE_STATUS.NEW,
  });

  for (let i = 0; i < messageList.length; i++) {
    const messageObj = messageList[i];
    let failureFilter = {
      messageSendStatus: MESSAGE_STATUS.NEW,
      messageId: messageObj.customerMessageId,
      customerStationId: station.stationsId,
    };

    let updatedMessageData = {
      messageSendStatus: MESSAGE_STATUS.CANCELED,
      messageNote: `Something wrong with SMS Config.`,
    };
    await MessageCustomer.updateAll(updatedMessageData, failureFilter);
    await CustomerMessage.updateById(messageObj.customerMessageId, {
      customerMessageStatus: MESSAGE_STATUS.CANCELED,
    });
  }
}

async function sendMessageSMSToCustomer(station) {
  console.log(`sendMessageSMSToCustomer ${station.stationsId}`);
  return new Promise(async (resolve, reject) => {
    //Skip TEST station
    if (station.stationsId === 0) {
      resolve('OK');
      return;
    }

    //Failure all message if station do not use SMS
    if (station.stationEnableUseSMS === 0) {
      await _cancelAllSMSMessage(station);
      resolve('OK');
      return;
    }

    let _customSMSClient = undefined;

    const ENABLED = 1;
    //Get sms client info if station use custom sms client
    if (station.stationUseCustomSMSBrand === ENABLED) {
      if (station.stationCustomSMSBrandConfig && station.stationCustomSMSBrandConfig !== null && station.stationCustomSMSBrandConfig.trim() !== '') {
        try {
          _customSMSClient = await SMSAPIClientFunctions.createClient(
            station.stationCustomSMSBrandConfig.smsUrl,
            station.stationCustomSMSBrandConfig.smsUserName,
            station.stationCustomSMSBrandConfig.smsPassword,
            station.stationCustomSMSBrandConfig.smsBrand,
          );
          if (_customSMSClient === undefined) {
            Logger.info(`station ${station.stationsId} enable custom but have wrong sms config`);
            await _cancelAllSMSMessage(station);
            resolve('OK');
            return;
          }
        } catch (error) {
          Logger.info(`station ${station.stationsId} enable custom but convert custom sms config failed`);
          await _cancelAllSMSMessage(station);
          resolve('OK');
          return;
        }
      }
    }

    let messageList = await MessageCustomerView.find(
      {
        messageSendStatus: MESSAGE_STATUS.NEW,
        customerMessageCategories: MESSAGE_CATEGORY.SMS,
        customerStationId: station.stationsId,
      },
      0,
      100,
    );

    if (messageList && messageList.length > 0) {
      for (let i = 0; i < messageList.length; i++) {
        const _customerMessage = messageList[i];
        let _templateId = _customerMessage.templateCustomerMessageId;
        let messageContent = _customerMessage.customerMessageContent;

        //if using template, then generate content based on template
        if (_templateId && _templateId !== null && _templateId !== '') {
          let customer = await CustomerRecord.findById(_customerMessage.customerId);
          if (customer) {
            let templateContent = await MessageFunction.getMessageContentByTemplate(_templateId, station, customer);
            if (templateContent) {
              messageContent = templateContent;
            }
          }
        }

        let updatedMessageData = {
          messageSendStatus: MESSAGE_STATUS.FAILED,
        };

        //if valid email then process
        if (Joi.string().validate(_customerMessage.customerMessagePhone).error === null) {
          //if we disable SMS
          if (process.env.SMS_ENABLE) {
            let sendResult = undefined;
            sendResult = await SMSAPIClientFunctions.sendSMS(messageContent, [_customerMessage.customerMessagePhone], _customSMSClient);

            //if send success
            if (sendResult !== undefined) {
              updatedMessageData.messageSendStatus = MESSAGE_STATUS.COMPLETED;
              updatedMessageData.messageNote = sendResult;
              await CustomerRecord.updateById(_customerMessage.customerId, {
                customerRecordSMSNotifyDate: new Date(),
              });
            } else {
              updatedMessageData.messageNote = `Send fail`;
            }
          }
        } else {
          updatedMessageData.messageNote = `wrong phonenumber format`;
        }

        //if we disable SMS
        if (!process.env.SMS_ENABLE) {
          updatedMessageData.messageSendStatus = MESSAGE_STATUS.CANCELED;
          updatedMessageData.messageNote = `SMS disabled`;
        }
        await MessageCustomer.updateById(_customerMessage.messageCustomerId, updatedMessageData);
      }

      resolve('OK');
    } else {
      resolve('DONE');
    }
  });
}

module.exports = {
  sendMessageSMSToCustomer,
};
