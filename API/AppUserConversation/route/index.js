/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const AppUserChatLog = require('./AppUserChatLogRoute');
const AppUserConversation = require('./AppUserConversationRoute');
module.exports = [
  //AppUserConversation APIs
  { method: 'POST', path: '/AppUserConversation/insert', config: AppUserConversation.insert },
  { method: 'POST', path: '/AppUserConversation/find', config: AppUserConversation.find },
  { method: 'POST', path: '/AppUserConversation/updateById', config: AppUserConversation.updateById },
  { method: 'POST', path: '/AppUserConversation/deleteById', config: AppUserConversation.deleteById },
  { method: 'POST', path: '/AppUserConversation/user/readConversation', config: AppUserConversation.userReadConversation },
  {
    method: 'POST',
    path: '/AppUserConversation/user/createNewConversationWithAdmin',
    config: AppUserConversation.userCreateNewConversationWithAdmin,
  },

  //AppUserChatLog APIs
  {
    method: 'POST',
    path: '/AppUserChatLog/insert',
    config: AppUserChatLog.insert,
  },
  {
    method: 'POST',
    path: '/AppUserChatLog/find',
    config: AppUserChatLog.find,
  },
  {
    method: 'POST',
    path: '/AppUserChatLog/user/getList',
    config: AppUserChatLog.userGetList,
  },
  {
    method: 'POST',
    path: '/AppUserChatLog/user/sendNewMessageToAdmin',
    config: AppUserChatLog.userSendNewMessageToAdmin,
  },
];
