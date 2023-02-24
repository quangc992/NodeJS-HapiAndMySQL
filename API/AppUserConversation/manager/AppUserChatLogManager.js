/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const AppUserChatLog = require('../resourceAccess/AppUserChatLogResourceAccess');
const Logger = require('../../../utils/logging');
const AppUserChatLogFunction = require('../AppUserChatLogFunction');
const { CHAT_DIRECTION } = require('../AppUserChatLogConstant');
async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let _content = req.payload.appUserChatLogContent;
      let _conversationId = req.payload.appUserConversationId;

      let result = await AppUserChatLogFunction.sendMessageToConversation(_content, _conversationId, CHAT_DIRECTION.ADMIN_TO_USER);
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

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let data = await AppUserChatLog.customSearch(filter, skip, limit, order);
      let dataCount = await AppUserChatLog.customCount(filter, order);
      if (data && dataCount) {
        resolve({ data: data, total: dataCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await AppUserChatLog.findById(id);
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

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let data = req.payload.data;
      let result = await AppUserChatLog.updateById(id, data);
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

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await AppUserChatLog.deleteById(id);
      if (result) {
        resolve(result);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      if (!filter) {
        filter = {};
      }
      filter.receiverId = req.currentUser.appUserId;

      let data = await AppUserChatLog.customSearch(filter, skip, limit, order);

      if (data && data.length > 0) {
        let dataCount = await AppUserChatLog.customCount(filter, order);
        resolve({ data: data, total: dataCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userSendNewMessageToAdmin(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let _content = req.payload.appUserChatLogContent;
      let _conversationId = req.payload.appUserConversationId;

      let result = await AppUserChatLogFunction.sendMessageToConversation(_content, _conversationId);
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
module.exports = {
  insert,
  find,
  findById,
  updateById,
  deleteById,
  userGetList,
  userSendNewMessageToAdmin,
};
