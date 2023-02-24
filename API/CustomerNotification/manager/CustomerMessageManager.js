/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const CustomerMessageResourceAccess = require('../resourceAccess/CustomerMessageResourceAccess');
const MessageCustomerResourceAccess = require('../resourceAccess/MessageCustomerResourceAccess');
const MessageCustomerView = require('../resourceAccess/MessageCustomerView');
const Logger = require('../../../utils/logging');
const SMSAPIFunctions = require('../../../ThirdParty/SMSAPIClient/SMSAPIClientFunctions');
const AppUsersResourceAccess = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const SystemAppLogFunctions = require('../../SystemAppChangedLog/SystemAppChangedLogFunctions');
const CustomerMessageFunctions = require('../CustomerMessageFunctions');
const { MESSAGE_TYPE } = require('../CustomerMessageConstant');

// admin send message => topic "GENERAL", type: "GENERAL"

async function sendsms(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let message = req.payload.message;
      let phoneNumber = req.payload.phoneNumber;
      let result = await SMSAPIFunctions.sendSMS(message, phoneNumber);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerMessageData = req.payload;
      let result = await CustomerMessageResourceAccess.insert(customerMessageData);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      if (startDate) {
        // startDate = formatDate.FormatDate(startDate)
      }
      if (endDate) {
        // endDate = formatDate.FormatDate(endDate)
      }
      //only get data of current station

      let customerMessage = await CustomerMessageResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let customerMessageCount = await CustomerMessageResourceAccess.customCount(filter, startDate, endDate, searchText, order);
      if (customerMessage && customerMessageCount) {
        resolve({
          data: customerMessage,
          total: customerMessageCount[0].count,
        });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let customerMessage = await MessageCustomerView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let customerMessageCount = await MessageCustomerView.customCount(filter, startDate, endDate, searchText, order);
      if (customerMessage && customerMessageCount) {
        resolve({
          data: customerMessage,
          total: customerMessageCount[0].count,
        });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findMessagesSent(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      let customerMessage = await MessageCustomerView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let customerMessageCount = await MessageCustomerView.customCount(filter, startDate, endDate, searchText, order);
      if (customerMessage && customerMessageCount) {
        resolve({
          data: customerMessage,
          total: customerMessageCount[0].count,
        });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getDetailById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let messageCustomerId = req.payload.messageCustomerId;
      await MessageCustomerResourceAccess.updateById(messageCustomerId, {
        isRead: 1,
      });
      let result = await MessageCustomerView.find({
        messageCustomerId: messageCustomerId,
      });
      if (result) {
        resolve(result[0]);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerMessageId = req.payload.id;
      let customerMessageData = req.payload.data;
      let dataBefore = await CustomerMessageResourceAccess.findById(customerMessageId);
      let result = await CustomerMessageResourceAccess.updateById(customerMessageId, customerMessageData);

      if (result) {
        SystemAppLogFunctions.logCustomerRecordChanged(dataBefore, customerMessageData, req.currentUser);
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerMessageId = req.payload.id;
      let result = await CustomerMessageResourceAccess.findById(customerMessageId);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function sendMessageByFilter(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let messageNote = req.payload.messageNote;
      let customerMessageId = req.payload.customerMessageId;

      //retrieve info for customer list filter, skip, limit, startDate, endDate, searchText, order
      let customerList = await AppUsersResourceAccess.customSearch(filter, undefined, undefined, undefined);
      // Send message to many customer
      let result = await CustomerMessageFunctions.sendMessageToManyCustomer(customerList, messageNote, customerMessageId, MESSAGE_TYPE.GENERAL);
      if (result) {
        resolve('success');
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function sendMessageByCustomerList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let customerList = [];
      let customerRecordIdList = req.payload.customerRecordIdList;
      let messageNote = req.payload.messageNote;
      let customerMessageId = req.payload.customerMessageId;
      let messageType = req.payload.messageType;
      if (!messageType) {
        messageType = MESSAGE_TYPE.GENERAL;
      }
      //retrieve info for customer list
      for (var i = 0; i < customerRecordIdList.length; i++) {
        let customer = await AppUsersResourceAccess.findById(customerRecordIdList[i]);
        if (customer) {
          customerList.push(customer);
        }
      }

      //Send message to many customer
      let result = await CustomerMessageFunctions.sendMessageToManyCustomer(customerList, messageNote, customerMessageId, messageType);
      if (result) {
        resolve('success');
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findMessages(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;

      let messages = await CustomerMessageResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      let messagesCount = await CustomerMessageResourceAccess.customCount(filter, startDate, endDate, searchText, order);
      if (messages) {
        resolve({ data: messages, total: messagesCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findDetailMessageById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let message = await CustomerMessageResourceAccess.findById(req.payload.customerMessageId);
      if (message) {
        resolve(message);
      } else {
        reject('do not have any message');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateMessageById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = req.payload.data;
      const id = req.payload.customerMessageId;
      let message = await CustomerMessageResourceAccess.updateById(id, data);
      if (message) {
        resolve(message);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteMessageById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.payload.customerMessageId;
      let message = await CustomerMessageResourceAccess.updateById(id, {
        isDeleted: 1,
      });
      if (message) {
        resolve(message);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  sendsms,
  sendMessageByFilter,
  sendMessageByCustomerList,
  findMessages,
  getList,
  getDetailById,
  updateMessageById,
  findDetailMessageById,
  deleteMessageById,
  findMessagesSent,
};
