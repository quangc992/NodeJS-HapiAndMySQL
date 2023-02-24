/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const AppUserConversationResource = require('./resourceAccess/AppUserConversationResourceAccess');

async function createConversationToAdmin(senderId) {
  if (!senderId) {
    return undefined;
  }

  let receiverId = 1;
  //if there is no one then superadmin will take this
  if (!receiverId) {
    receiverId = 1;
  }

  let _existingConversation = await AppUserConversationResource.find({
    senderId: receiverId, //luon luon quy dinh admin la "NGUOI GUI"
    receiverId: senderId, //luon luon quy dinh admin la "NGUOI NHAN"
  });

  if (_existingConversation && _existingConversation.length > 0) {
    return _existingConversation[0];
  } else {
    let result = await AppUserConversationResource.insert({
      senderId: receiverId, //luon luon quy dinh admin la "NGUOI GUI"
      receiverId: senderId, //luon luon quy dinh admin la "NGUOI NHAN"
    });
    if (result) {
      return {
        appUserConversationId: result[0],
      };
    }
  }

  return undefined;
}
module.exports = {
  createConversationToAdmin,
};
