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
const EmailClient = require('../../../ThirdParty/Email/EmailClient');
const MessageFunction = require('../CustomerMessageFunctions');
const Logger = require('../../../utils/logging');

async function _cancelAllEmailMessage(station) {
  let messageList = await CustomerMessage.find({
    customerMessageCategories: MESSAGE_CATEGORY.EMAIL,
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
      messageNote: `Something wrong with Email Config.`,
    };
    await MessageCustomer.updateAll(updatedMessageData, failureFilter);
    await CustomerMessage.updateById(messageObj.customerMessageId, {
      customerMessageStatus: MESSAGE_STATUS.CANCELED,
    });
  }
}

async function sendMessageEmailToCustomer(station) {
  console.log(`sendMessageEmailToCustomer ${station.stationsId}`);
  return new Promise(async (resolve, reject) => {
    //Skip TEST station
    if (station.stationsId === 0) {
      resolve('OK');
      return;
    }

    const ENABLED = 1;
    //default - no custom client
    let customEmailClient = undefined;
    if (station.stationUseCustomSMTP === ENABLED) {
      //check if use custom smtp but wrong smtp info
      if (station.stationCustomSMTPConfig && station.stationCustomSMTPConfig !== '' && station.stationCustomSMTPConfig !== null) {
        try {
          let _smtpConfig = JSON.parse(stationConfigs.stationCustomSMTPConfig);
          customEmailClient = await EmailClient.createNewClient(
            _smtpConfig.smtpHost,
            _smtpConfig.smtpPort,
            _smtpConfig.smtpSecure,
            _smtpConfig.smtpAuth.user,
            _smtpConfig.smtpAuth.pass,
          );
          if (customEmailClient === undefined || customEmailClient === null) {
            await _cancelAllEmailMessage(station);
            Logger.error(`Station ${station.stationsId} enable use Custom SMTP but can not create new smtp client`);
            resolve('OK');
            return;
          }
        } catch (error) {
          await _cancelAllEmailMessage(station);
          Logger.error(`Station ${station.stationsId} enable use Custom SMTP but can not convert stationCustomSMTPConfig`);
          resolve('OK');
          return;
        }
      } else {
        await _cancelAllEmailMessage(station);
        Logger.error(`Station ${station.stationsId} enable use Custom SMTP but do not have stationCustomSMTPConfig`);
        resolve('OK');
        return;
      }
    }

    let messageList = await MessageCustomerView.find(
      {
        messageSendStatus: MESSAGE_STATUS.NEW,
        customerMessageCategories: MESSAGE_CATEGORY.EMAIL,
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
        if (Joi.string().email().validate(_customerMessage.customerMessageEmail).error === null) {
          let sendResult = undefined;
          sendResult = await EmailClient.sendEmail(
            _customerMessage.customerMessageEmail,
            _customerMessage.customerMessageTitle,
            messageContent,
            customEmailClient,
          );

          //if send success
          if (sendResult !== undefined) {
            updatedMessageData.messageSendStatus = MESSAGE_STATUS.COMPLETED;
            updatedMessageData.messageNote = sendResult;
            await CustomerRecord.updateById(_customerMessage.customerId, {
              customerRecordEmailNotifyDate: new Date(),
            });
          } else {
            updatedMessageData.messageNote = `Send fail`;
          }
        } else {
          updatedMessageData.messageNote = `wrong email format`;
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
  sendMessageEmailToCustomer,
};
