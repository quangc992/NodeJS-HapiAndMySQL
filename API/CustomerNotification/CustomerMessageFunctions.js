/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const Handlebars = require('handlebars');

const CustomerMessageResourceAccess = require('./resourceAccess/CustomerMessageResourceAccess');
const MessageCustomerResourceAccess = require('./resourceAccess/MessageCustomerResourceAccess');
const ApiUtilsFunctions = require('../ApiUtils/utilFunctions');
const { MESSAGE_STATUS } = require('./CustomerMessageConstant');
const { pushNotificationByTopic } = require('../../ThirdParty/FirebaseNotification/FirebaseNotificationFunctions');
const FUNC_SUCCESS = 1;
const FUNC_FAILED = undefined;

const messageTemplate = [
  {
    messageTemplateId: 1,
    messageTemplateContent: 'Mời bạn đăng ký đăng kiểm tại {{stationsAddress}} cho ô tô BKS số {{customerRecordPlatenumber}}',
    messageTemplateName: 'CSKH',
    // messageTemplateScope: [CustomerRecord.modelName]
  },
  {
    messageTemplateId: 2,
    messageTemplateName: 'Nhắc đăng kiểm',
    messageTemplateContent:
      'Ô tô BKS số {{customerRecordPlatenumber}} hết hạn đăng kiểm vào {{customerRecordCheckExpiredDate}}. Mời bạn đăng ký đăng kiểm tại {{stationsAddress}}',
    // messageTemplateScope: [CustomerRecord.modelName]
  },
];

async function checkValidMessage(customerMessageId) {
  //check if using template and template is valid
  let templateData = undefined;
  if (customerMessageId) {
    templateData = await CustomerMessageResourceAccess.findById(customerMessageId);

    if (!templateData) {
      console.error(`there is no message with id ${customerMessageId}`);
      return FUNC_FAILED;
    }
  }
  return templateData;
}

async function getMessageContentByTemplate(messageTemplateId, station, customer) {
  //check if station / customer data is valid
  if (station === undefined || customer === undefined) {
    return FUNC_FAILED;
  }

  //check if using template and template is valid
  let templateData = await checkValidMessage(messageTemplateId);
  if (templateData === undefined) {
    console.error(`there is no template with id ${messageTemplateId}`);
    return FUNC_FAILED;
  }

  //generate content by template & customer data
  let templateParams = {
    ...customer,
    ...station,
  };

  //if this message is "REMIND SCHEDULE" message
  //else default is "CUSTOMER SERVICE" message
  if (templateData.messageTemplateScope.indexOf(CustomerSchedule.modelName) > -1) {
    let scheduleData = CustomerSchedule.find({
      licensePlates: customer.customerRecordPlatenumber,
    });
    if (scheduleData && scheduleData.length > 0) {
      scheduleData = scheduleData[0];
      templateParams = {
        ...templateParams,
        ...scheduleData,
      };
    }
  }

  let customerMessageContent = Handlebars.compile(templateData.messageTemplateContent)(templateParams);
  return customerMessageContent;
}

//Send message to many customer
async function sendMessageToManyCustomer(customerList, messageNote, customerMessageId, messageType) {
  if (customerList === 0) {
    return FUNC_FAILED;
  }

  //find message content
  let message = await checkValidMessage(customerMessageId);
  if (message === undefined) {
    console.error(`can not create new message`);
    return FUNC_FAILED;
  }

  // message list
  let messageList = [];
  for (var i = 0; i < customerList.length; i++) {
    let customerMessage = {
      customerId: customerList[i].appUserId,
      messageId: customerMessageId,
      messageNote: messageNote,
      messageSendStatus: MESSAGE_STATUS.COMPLETED,
      messageTimeSent: new Date().toISOString(),
      isRead: 0,
    };
    messageList.push(customerMessage);
  }

  //Chunk array into multiple batches of 100
  if (messageList.length > 100) {
    let batches = await ApiUtilsFunctions.chunkArray(messageList, 100);
    for (var i = 0; i < batches.length; i++) {
      await MessageCustomerResourceAccess.insert(batches[i]);
    }
  } else {
    await MessageCustomerResourceAccess.insert(messageList);
  }

  const { customerMessageCategories, customerMessageTitle, customerMessageContent } = message;
  let sendMessageResult = await pushNotificationByTopic(
    customerMessageCategories,
    customerMessageTitle,
    customerMessageContent,
    undefined,
    messageType,
  );
  if (sendMessageResult) {
    await CustomerMessageResourceAccess.updateById(customerMessageId, {
      messageSendStatus: MESSAGE_STATUS.COMPLETED,
      messageTimeSent: new Date().toISOString(),
    });
    return FUNC_SUCCESS;
  } else {
    await CustomerMessageResourceAccess.updateById(customerMessageId, {
      messageSendStatus: MESSAGE_STATUS.FAILED,
      messageTimeSent: new Date().toISOString(),
    });
    return FUNC_FAILED;
  }
}

async function getTemplateMessages() {
  return messageTemplate;
}

module.exports = {
  getTemplateMessages,
  sendMessageToManyCustomer,
  getMessageContentByTemplate,
};
