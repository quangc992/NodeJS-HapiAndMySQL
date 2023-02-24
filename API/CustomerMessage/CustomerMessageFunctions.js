/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const Handlebars = require('handlebars');

const CustomerMessageResourceAccess = require('./resourceAccess/CustomerMessageResourceAccess');
// const MessageCustomerResourceAccess = require('./resourceAccess/MessageCustomerResourceAccess');

const ApiUtilsFunctions = require('../ApiUtils/utilFunctions');
const { MESSAGE_STATUS, MESSAGE_TYPE, MESSAGE_TOPIC, MESSAGE_CATEGORY, MESSAGE_RECEIVER } = require('./CustomerMessageConstant');
const AppUsersResourceAccess = require('../AppUsers/resourceAccess/AppUsersResourceAccess');

const Logger = require('../../utils/logging');

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

function _importDataForMessage(customer) {
  return {
    customerMessageEmail: customer.customerRecordEmail,
    customerMessagePhone: customer.customerRecordPhone,
    customerMessagePlateNumber: customer.customerRecordPlatenumber,
    customerId: customer.customerRecordId,
  };
}

async function checkValidTemplateMessage(messageTemplateId) {
  //check if using template and template is valid
  let templateData = undefined;
  if (messageTemplateId) {
    for (let i = 0; i < messageTemplate.length; i++) {
      const template = messageTemplate[i];
      if (messageTemplateId * 1 === template.messageTemplateId * 1) {
        templateData = template;
        break;
      }
    }

    if (templateData === undefined) {
      console.error(`there is no template with id ${messageTemplateId}`);
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
  let templateData = await checkValidTemplateMessage(messageTemplateId);
  if (templateData === undefined) {
    console.error(`there is no template with id ${messageTemplateId}`);
    return FUNC_FAILED;
  }

  //generate content by template & customer data
  let templateParams = {
    ...customer,
    ...station,
  };

  const CustomerSchedule = require('../CustomerSchedule/resourceAccess/CustomerScheduleResourceAccess');

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

async function _createNewMessage(stationsId, customerMessageContent, customerMessageCategories, templateCustomerMessageId) {
  let _enableUsingTemplate = false;

  let templateContent = await checkValidTemplateMessage(templateCustomerMessageId);
  if (templateContent) {
    _enableUsingTemplate = true;
  }

  const StationsResource = require('../Stations/resourceAccess/StationsResourceAccess');

  //get station info
  let station = await StationsResource.findById(stationsId);
  if (station === undefined) {
    return FUNC_FAILED;
  }

  //create data for message
  let dataMessage = {
    customerMessageCategories: customerMessageCategories,
    customerMessageContent: customerMessageContent,
    customerStationId: stationsId,
    customerMessageTitle: `Thông báo hệ thống từ ${station.stationsName}`,
  };

  if (_enableUsingTemplate) {
    dataMessage.customerMessageContent = templateContent.messageTemplateContent;
    dataMessage.templateCustomerMessageId = templateCustomerMessageId;
  }

  let messageId = await CustomerMessageResourceAccess.insert(dataMessage);
  if (messageId) {
    messageId = messageId[0];
    return messageId;
  } else {
    return undefined;
  }
}

//Send message to many customer
async function sendMessageToManyCustomer(customerList, stationsId, customerMessageContent, customerMessageCategories, templateCustomerMessageId) {
  if (customerList.length <= 0) {
    return FUNC_SUCCESS;
  }

  //create new MessageCustomer object
  let messageId = await _createNewMessage(stationsId, customerMessageContent, customerMessageCategories, templateCustomerMessageId);
  if (messageId === undefined) {
    console.error(`can not create new message`);
    return FUNC_FAILED;
  }

  let messageList = [];
  let listTopicUser = [];
  let listUserToken = [];

  //get Message content and split into 1 message for each customer
  for (var i = 0; i < customerList.length; i++) {
    const customer = customerList[i];
    let customerMessage = {
      ..._importDataForMessage(customer),
      messageId: messageId,
      customerStationId: stationsId,
    };
    // let customerMessage = {
    //   customerId: customerList[i].appUserId,
    //   messageId: customerMessageId,
    //   messageNote: messageNote,
    //   messageTimeReceive: new Date().toISOString(),
    //   messageCustomerData: data ? JSON.stringify(data) : null,
    //   isRead: 0,
    //   messageType: messageType
    // }
    // messageList.push(customerMessage);
    // listTopicUser.push(`USER_${customerList[i].appUserId}`);
    // if(customerList[i].firebaseToken) {
    //   listUserToken.push(customerList[i].firebaseToken);
    // }
  }

  //Chunk messageList array into multiple batches of 100 to prevent DB Crash
  if (messageList.length > 100) {
    let batches = await ApiUtilsFunctions.chunkArray(messageList, 100);
    for (var i = 0; i < batches.length; i++) {
      await MessageCustomerResourceAccess.insert(batches[i]);
    }
  } else {
    await MessageCustomerResourceAccess.insert(messageList);
  }

  let sendMessageResult;
  const { pushNotificationByTopic, pushNotificationByTokens } = require('../../ThirdParty/FirebaseNotification/FirebaseNotificationFunctions');

  if (customerMessageCategories === MESSAGE_TYPE.GENERAL) {
    sendMessageResult = await pushNotificationByTopic(customerMessageCategories, customerMessageTitle, customerMessageContent, data, messageType);
  } else {
    for (let i = 0; i < listTopicUser.length; i++) {
      await pushNotificationByTopic(listTopicUser[i], customerMessageTitle, customerMessageContent, data, messageType);
    }
  }
  await pushNotificationByTokens(listUserToken, customerMessageTitle, customerMessageContent, data, messageType);
  if (sendMessageResult) {
    await CustomerMessageResourceAccess.updateById(customerMessageId, {
      customerMessageSendStatus: MESSAGE_STATUS.COMPLETED,
      customerMessageTimeSent: new Date().toISOString(),
      isHidden: hiddenAfterSend ? 1 : 0,
    });
    return FUNC_SUCCESS;
  } else {
    await CustomerMessageResourceAccess.updateById(customerMessageId, {
      customerMessageSendStatus: MESSAGE_STATUS.FAILED,
      customerMessageTimeSent: new Date().toISOString(),
      isHidden: hiddenAfterSend ? 1 : 0,
    });
    return FUNC_FAILED;
  }
}

async function getTemplateMessages() {
  return messageTemplate;
}

async function handleSendMessage(appUserId, POST, data, messageType) {
  return new Promise(async resolve => {
    try {
      let listUserId = [];
      if (!appUserId) {
        return;
      }
      if (typeof appUserId === 'number') {
        listUserId = [appUserId];
      }
      if (typeof appUserId === 'object') {
        listUserId = appUserId;
      }
      let insertMessage = await CustomerMessageResourceAccess.insert(POST);
      let customerList = [];
      if (insertMessage) {
        //retrieve info for customer list
        for (var i = 0; i < listUserId.length; i++) {
          let customer = await AppUsersResourceAccess.findById(listUserId[i]);
          if (customer) {
            customerList.push(customer);
          }
        }
        const HIDDEN_AFTER_SEND = 1;
        sendMessageToManyCustomer(customerList, 'Hệ thống tự động', insertMessage[0], messageType, data, HIDDEN_AFTER_SEND);
      }
      resolve();
    } catch (e) {
      console.log('error', e);
      resolve();
    }
  });
}

async function handleSendMessageUser(messageData, data, receiverId, moreData) {
  let msg = messageData;
  if (data) {
    const template = Handlebars.compile(JSON.stringify(messageData));
    msg = JSON.parse(template(data));
  }
  await handleSendMessage(receiverId, msg, moreData, MESSAGE_TYPE.USER);
}

async function handleSendMessageToFollower(messageData, data, realEstateData) {
  if (realEstateData) {
    let follwerData = await RealEstateUserSavedResourceAccess.find({
      realEstateId: realEstateData.realEstateId,
    });
    if (follwerData && follwerData.length > 0) {
      let arrayUserId = [];
      for (let user of follwerData) {
        arrayUserId.push(user.appUserIdSaved);
      }
      const template = Handlebars.compile(JSON.stringify(messageData));
      const message = JSON.parse(template(data));
      await handleSendMessage(
        arrayUserId,
        message,
        {
          realEstateId: realEstateData.realEstateId,
          agency: realEstateData.agency,
          systemRecordType: realEstateData.systemRecordType,
          realEstatePostTypeId: realEstateData.realEstatePostTypeId,
        },
        MESSAGE_TYPE.REALESTATE,
      );
    }
  }
}

async function handleSendMessageNewRealEstate(appUserId, messageData, realEstateData, filterUser) {
  return new Promise(async resolve => {
    try {
      let insertMessage = await CustomerMessageResourceAccess.insert(messageData);
      if (insertMessage) {
        let customerList = await AppUsersResourceAccess.customSearch(filterUser, undefined, undefined, undefined);
        if (customerList) {
          customerList = customerList.filter(item => item.appUserId !== appUserId);

          sendMessageToManyCustomer(
            customerList,
            'Hệ thống tự động',
            insertMessage[0],
            MESSAGE_TYPE.REALESTATE,
            {
              realEstateId: realEstateData.realEstateId,
              agency: realEstateData.agency,
              systemRecordType: realEstateData.systemRecordType,
              realEstatePostTypeId: realEstateData.realEstatePostTypeId,
              hiddenAfterSend: 1,
            },
            1,
          );
        }
      }
      resolve();
    } catch (e) {
      console.log('handleSendMessageNewRealEstate error', e);
      resolve();
    }
  });
}

async function handleSendMessageRealEstate(messageData, data, realEstateData) {
  const template = Handlebars.compile(JSON.stringify(messageData));
  const message = JSON.parse(template(data));
  await handleSendMessage(
    realEstateData.appUserId,
    message,
    {
      realEstateId: realEstateData.realEstateId,
      agency: realEstateData.agency,
      systemRecordType: realEstateData.systemRecordType,
      realEstatePostTypeId: realEstateData.realEstatePostTypeId,
    },
    messageData.customerMessageCategories,
  );
}

async function _handleFirebasePushMessage(messageData, messageType, additionData) {
  let messageDataList = [];

  let userMessageData = {
    ...messageData,
    receiverType: MESSAGE_RECEIVER.USER,
  };

  //luon luon co 1 thong bao vi danh sach thong bao dang chay theo firebase push (cho du ko push)
  userMessageData.customerMessageCategories = MESSAGE_CATEGORY.FIREBASE_PUSH;

  //neu co agency thi gui them message cho agency
  if (additionData.agencyId) {
    let agencyMessageData = {
      ...userMessageData,
      receiverType: MESSAGE_RECEIVER.AGENCY,
      customerId: additionData.agencyId,
    };
    messageDataList.push(agencyMessageData);
  }

  messageDataList.push(userMessageData);

  //store message into database
  let storeFirebasePushResult = await CustomerMessageResourceAccess.insert(messageDataList);
  if (!storeFirebasePushResult) {
    Logger.error(`can not storeFirebasePushResult sendMessageConfirmSchedule`);
    return FUNC_FAILED;
  }

  let GOOGLE_FIREBASE_PUSH_ENABLE = process.env.GOOGLE_FIREBASE_PUSH_ENABLE;
  if (GOOGLE_FIREBASE_PUSH_ENABLE) {
    //push cho user
    if (userMessageData.appUserId) {
      let pushUserNotificationResult = await pushNotificationByTopic(
        `${MESSAGE_TOPIC.USER}_${userMessageData.appUserId}`,
        userMessageData.customerMessageContent,
        userMessageData.customerMessageTitle,
        additionData,
        messageType,
      );
      if (pushUserNotificationResult === undefined) {
        Logger.error(`can not send pushNotificationResult for ${MESSAGE_TOPIC.USER}_${userMessageData.appUserId}`);
      }
    }

    if (additionData.agencyId) {
      //push notification cho agency
      let pushUserNotificationResult = await pushNotificationByTopic(
        `${MESSAGE_TOPIC.AGENCY}_${additionData.agencyId}`,
        userMessageData.customerMessageContent,
        userMessageData.customerMessageTitle,
        additionData,
        messageType,
      );
      if (pushUserNotificationResult === undefined) {
        Logger.error(`can not send pushNotificationResult ${MESSAGE_TOPIC.AGENCY}_${additionData.agencyId}`);
      }
    }
  }
  return FUNC_SUCCESS;
}

async function _handleSMSMessage(messageData, additionData) {
  let SMS_ENABLE = process.env.SMS_ENABLE;
  if (SMS_ENABLE) {
    messageData.customerMessageCategories = MESSAGE_CATEGORY.SMS;

    //store message into database
    let storeSMSResult = await CustomerMessageResourceAccess.insert(messageData);

    if (!storeSMSResult) {
      Logger.error(`can not storeSMSResult sendMessageConfirmSchedule`);
    } else {
      const SMSClientFunctions = require('../../ThirdParty/SMSAPIClient/SMSAPIClientFunctions');

      let smsResult = await SMSClientFunctions.sendSMS(messageData.customerMessageContent, messageData.customerMessagePhone);
      if (smsResult === undefined) {
        Logger.error(`can not send sms to ${messageData.customerMessagePhone}`);
      }
    }
  }
  return FUNC_SUCCESS;
}

//xu ly tao thong tin message theo tat ca cac phuong thuc gui message
async function _sendMessage(scheduleData, messageTitle, messageContent, messageType) {
  let userMessageData = {
    customerMessageCategories: MESSAGE_CATEGORY.EMAIL,
    receiverType: MESSAGE_RECEIVER.USER,
    customerMessageType: messageType,
    customerMessagePhone: scheduleData.customerPhone,
    customerMessageEmail: scheduleData.customerEmail,
    customerMessageIdentity: scheduleData.customerIdentity,
    customerMessageImage: '',
    customerMessageContent: messageContent,
    customerMessageTitle: messageTitle,
    customerStationId: scheduleData.stationsId,
    customerScheduleId: scheduleData.customerScheduleId,
    customerId: scheduleData.appUserId,
    staffId: scheduleData.staffId,
  };

  //xu ly tao thong bao trong DB va gui qua push notification
  await _handleFirebasePushMessage(userMessageData, messageType, scheduleData);

  //xu ly gui thong bao qua sms
  await _handleSMSMessage(userMessageData, userMessageData);

  return FUNC_SUCCESS;
}

//gui message cho lich hen da duoc xac nhan
async function sendMessageConfirmSchedule(scheduleData, stationData) {
  let _messageTitle = `Lịch hẹn được xác nhận`;
  let _messageContent = '';
  if (stationData) {
    _messageContent = `Lịch hẹn của bạn tại ${stationData.stationsName} đã được xác nhận. 
    *** LƯU Ý: Mọi thông tin cần hỗ trợ qua số hotline ${stationData.stationsHotline}. Xin cảm ơn`;
  } else {
    _messageContent = `Lịch hẹn của bạn đã được xác nhận. 
    *** LƯU Ý: Mọi thông tin cần hỗ trợ qua số hotline. Xin cảm ơn`;
  }
  return await _sendMessage(scheduleData, _messageTitle, _messageContent, MESSAGE_TYPE.CUSTOMER_SCHEDULE_APPROVED);
}

//gui message cho lich hen moi
async function sendMessageNewSchedule(scheduleData, stationData) {
  let _messageTitle = `Lịch hẹn mới`;
  let _messageContent = '';
  if (stationData) {
    _messageContent = `Bạn có 1 lịch hẹn mới tại ${stationData.stationsName}. 
    *** LƯU Ý: Mọi thông tin cần hỗ trợ qua số hotline ${stationData.stationsHotline}. Xin cảm ơn`;
  } else {
    _messageContent = `Bạn có 1 lịch hẹn mới. 
    *** LƯU Ý: Mọi thông tin cần hỗ trợ qua số hotline. Xin cảm ơn`;
  }
  return await _sendMessage(scheduleData, _messageTitle, _messageContent, MESSAGE_TYPE.CUSTOMER_SCHEDULE_NEW);
}

module.exports = {
  getTemplateMessages,
  sendMessageToManyCustomer,
  getMessageContentByTemplate,
  handleSendMessage,
  handleSendMessageUser,
  handleSendMessageToFollower,
  handleSendMessageNewRealEstate,
  handleSendMessageRealEstate,
  sendMessageConfirmSchedule,
  sendMessageNewSchedule,
};
