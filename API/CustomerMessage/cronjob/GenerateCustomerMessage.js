/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const CustomerMessage = require('../resourceAccess/CustomerMessageResourceAccess');
const GroupCustomerMessage = require('../resourceAccess/GroupCustomerMessageResourceAccess');
const AppUser = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');

const { MESSAGE_STATUS, MESSAGE_CATEGORY } = require('../CustomerMessageConstant');
const Logger = require('../../../utils/logging');

async function _createNewMessageForAllCustomer(groupMessage) {
  //cap nhat trang thai cua message thanh WAITING
  await GroupCustomerMessage.updateById(groupMessage.groupCustomerMessageId, {
    groupCustomerMessageStatus: MESSAGE_STATUS.SENDING,
  });

  //lay danh sach customer cua tung tram
  let _filter = {
    // stationsId: station.stationsId,
  };

  let _countCustomer = await AppUser.customCount(_filter);
  if (_countCustomer && _countCustomer.length > 0) {
    _countCustomer = _countCustomer[0].count;
  } else {
    _countCustomer = 0;
  }

  if (_countCustomer <= 0) {
    Logger.info(`No customer for station ${station.stationsId}`);
    resolve('OK');
    return;
  }

  for (let i = 0; i < _countCustomer; i++) {
    let customerList = await AppUser.find(_filter, 100 * i, 100);
    let _newMessageList = [];
    for (let j = 0; j < customerList.length; j++) {
      const _customer = customerList[j];
      const _newMessage = {
        customerMessageCategories: groupMessage.groupCustomerMessageCategories,
        customerMessageTopic: groupMessage.groupCustomerMessageTopic,
        customerMessageType: groupMessage.groupCustomerMessageType,
        customerMessageImage: groupMessage.customerMessageImage,
        customerMessageContent: groupMessage.groupCustomerMessageContent,
        customerMessageTitle: groupMessage.groupCustomerMessageTitle,
        customerMessagePhone: _customer.phoneNumber,
        customerMessageEmail: _customer.email,
        customerMessageIdentity: _customer.firstName + ' ' + _customer.lastName,
        customerStationId: groupMessage.stationsId,
        customerId: _customer.appUserId,
        staffId: groupMessage.staffId,
        groupCustomerMessageId: groupMessage.groupCustomerMessageId,
        templateCustomerMessageId: groupMessage.groupCustomerMessageTemplateId,
        customerMessageImage: groupMessage.groupCustomerMessageImage,
      };
      _newMessageList.push(_newMessage);
    }

    if (_newMessageList.length > 0) {
      await CustomerMessage.insert(_newMessageList);
    }

    if (100 * i > _countCustomer) {
      break;
    }
  }

  //cap nhat trang thai cua message thanh COMPLETED
  await GroupCustomerMessage.updateById(groupMessage.groupCustomerMessageId, {
    groupCustomerMessageStatus: MESSAGE_STATUS.COMPLETED,
  });
}

async function generateCustomerMessageFromGroupMessage(station) {
  return new Promise(async (resolve, reject) => {
    if (station) {
      Logger.info(`generateCustomerMessageFromGroupMessage ${station.stationsId}`);
    }
    //Skip TEST station
    if (station && station.stationsId === 0) {
      resolve('OK');
      return;
    }

    //count all NEW GroupCustomerMessage
    let _filter = {
      groupCustomerMessageStatus: MESSAGE_STATUS.NEW,
      // stationsId: station.stationsId
    };

    let _countGroupMessage = await GroupCustomerMessage.count(_filter);
    if (_countGroupMessage && _countGroupMessage.length > 0) {
      _countGroupMessage = _countGroupMessage[0].count;
    } else {
      _countGroupMessage = 0;
    }

    if (_countGroupMessage <= 0) {
      if (station) {
        Logger.info(`No NEW groupMessage for station ${station.stationsId}`);
      } else {
        Logger.info(`No NEW groupMessage`);
      }
      resolve('OK');
      return;
    }

    let messageList = await GroupCustomerMessage.find(_filter, 0, 100);

    if (messageList && messageList.length > 0) {
      for (let i = 0; i < messageList.length; i++) {
        const _groupCustomerMessage = messageList[i];
        _createNewMessageForAllCustomer(_groupCustomerMessage);
      }
      resolve('OK');
    } else {
      resolve('DONE');
    }
  });
}

module.exports = {
  generateCustomerMessageFromGroupMessage,
};
