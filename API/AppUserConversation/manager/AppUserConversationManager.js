/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const AppUserConversationResource = require('../resourceAccess/AppUserConversationResourceAccess');
const AppUserConversationResourceView = require('../resourceAccess/AppUserConversationResourceView');
const Logger = require('../../../utils/logging');
const { createConversationToAdmin } = require('../AppUserConversationFunction');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let senderId = req.payload.receiverId;
      let _newConversation = await createConversationToAdmin(senderId);
      if (_newConversation) {
        return resolve(_newConversation);
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
      let order = {
        key: 'updatedAt',
        value: 'desc',
      };

      let data = await AppUserConversationResourceView.customSearch(filter, skip, limit, undefined, undefined, undefined, order);
      let dataCount = await AppUserConversationResourceView.customCount(filter);
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
      let result = await AppUserConversationResource.findById(id);
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

      let result = await AppUserConversationResource.updateById(id, data);
      if (result !== undefined) {
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

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await AppUserConversationResource.deleteById(id);
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

async function userCreateNewConversationWithAdmin(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let senderId = req.currentUser.appUserId;
      let _newConversation = await createConversationToAdmin(senderId);
      if (_newConversation) {
        return resolve(_newConversation);
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
  userCreateNewConversationWithAdmin,
};
