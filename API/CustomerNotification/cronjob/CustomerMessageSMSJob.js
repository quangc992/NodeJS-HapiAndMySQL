/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const Joi = require('joi');
const MessageCustomerView = require('../resourceAccess/MessageCustomerView');
const MessageCustomer = require('../resourceAccess/MessageCustomerResourceAccess');
const { MESSAGE_STATUS, MESSAGE_CATEGORY } = require('../CustomerMessageConstant');
const SMSAPIClientFunctions = require('../../../ThirdParty/SMSAPIClient/SMSAPIClientFunctions');
const MessageFunction = require('../CustomerMessageFunctions');

async function sendMessageSMSToCustomer(station) {
  console.log(`sendMessageSMSToCustomer ${station.stationsId}`);
  return new Promise(async (resolve, reject) => {
    //Skip TEST station
    if (station.stationsId === 0) {
      resolve('OK');
      return;
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
        let _templateId = _customerMessage.customerMessageTemplateId;
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
            let sendResult = await SMSAPIClientFunctions.sendSMS(messageContent, [_customerMessage.customerMessagePhone]);

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
