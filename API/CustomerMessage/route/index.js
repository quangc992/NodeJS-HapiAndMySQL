/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const CustomerMessage_User = require('./CustomerMessage_UserRoute');
const CustomerMessage_Staff = require('./CustomerMessage_StaffRoute');
const GroupCustomerMessage = require('../route/GroupCustomerMessageRoute');

module.exports = [
  //Api CustomerSchedule
  {
    method: 'POST',
    path: '/GroupCustomerMessage/insert',
    config: GroupCustomerMessage.insert,
  },
  // { method: 'POST', path: '/GroupCustomerMessage/updateById', config: GroupCustomerMessage.updateById },
  {
    method: 'POST',
    path: '/GroupCustomerMessage/findById',
    config: GroupCustomerMessage.findById,
  },
  {
    method: 'POST',
    path: '/GroupCustomerMessage/find',
    config: GroupCustomerMessage.find,
  },
  // { method: 'POST', path: '/GroupCustomerMessage/deleteById', config: GroupCustomerMessage.deleteById },
  {
    method: 'POST',
    path: '/GroupCustomerMessage/user/getList',
    config: GroupCustomerMessage.userGetListGroupCustomerMessage,
  },

  {
    method: 'POST',
    path: '/CustomerMessage/user/getListNotification',
    config: CustomerMessage_User.userGetListNotificationMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/user/getDetailMessage',
    config: CustomerMessage_User.userGetDetailMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/user/getUnreadNotificationCount',
    config: CustomerMessage_User.userGetUnreadNotificationMessageCount,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/user/readAllNotification',
    config: CustomerMessage_User.userReadAllNotificationMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/user/readNotification',
    config: CustomerMessage_User.userReadNotificationMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/user/deleteAllNotification',
    config: CustomerMessage_User.userDeleteAllNotificationMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/user/deleteNotification',
    config: CustomerMessage_User.userDeleteNotificationMessage,
  },

  {
    method: 'POST',
    path: '/CustomerMessage/staff/getListNotification',
    config: CustomerMessage_Staff.staffGetListNotificationMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/staff/getDetailMessage',
    config: CustomerMessage_Staff.staffGetDetailMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/staff/getUnreadNotificationCount',
    config: CustomerMessage_Staff.staffGetUnreadNotificationMessageCount,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/staff/readAllNotification',
    config: CustomerMessage_Staff.staffReadAllNotificationMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/staff/readNotification',
    config: CustomerMessage_Staff.staffReadNotificationMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/staff/deleteAllNotification',
    config: CustomerMessage_Staff.staffDeleteAllNotificationMessage,
  },
  {
    method: 'POST',
    path: '/CustomerMessage/staff/deleteNotification',
    config: CustomerMessage_Staff.staffDeleteNotificationMessage,
  },
];
