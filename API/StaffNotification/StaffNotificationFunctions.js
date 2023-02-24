/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const StaffNotificationResourceAccess = require('./resourceAccess/StaffNotificationResourceAccess');
const GroupStaffNotificationResourceAccess = require('./resourceAccess/GroupStaffNotificationResourceAccess');
const {
  NOTIFICATION_METHOD,
  NOTIFICATION_STATUS,
  NOTIFICATION_RECEIVER,
  NOTIFICATION_TYPE,
  NOTIFICATION_TOPIC,
} = require('./StaffNotificationConstants');

async function insertManyNotificationByMethod(notiData, notiMethodList) {
  notiMethodList = notiMethodList ? notiMethodList : Object.values(NOTIFICATION_METHOD);

  const promiseList = notiMethodList.map(async method => {
    return await StaffNotificationResourceAccess.insert({ ...notiData, notificationMethod: method });
  });

  const result = await Promise.all(promiseList);

  if (result && result.length === notiMethodList.length) {
    return true;
  }
  return false;
}

function insertGroupNotification(groupNotificationData) {
  return GroupStaffNotificationResourceAccess.insert(groupNotificationData);
}

function notifyExpiredTaskToStaff(receiverId, staffTaskId, stationsId) {
  const notifyData = {
    notificationSendStatus: NOTIFICATION_STATUS.NEW,
    receiverType: NOTIFICATION_RECEIVER.STAFF,
    notificationType: NOTIFICATION_TYPE.GENERAL,
    notificationTopic: NOTIFICATION_TOPIC.STAFF,
    receiverId,
    stationsId,
    staffTaskId,
    notificationTitle: 'Bạn có nhiệm hết hạn vào ngày mai !',
    notificationContent: `Bạn có một nhiệm vụ phải hoàn thành vào ngày mai, bấm để xem chi tiết ! `,
  };

  return insertManyNotificationByMethod(notifyData);
}

function notifyNewTaskToStaff(receiverId, staffTaskId, stationsId, assigneeName) {
  const notifyData = {
    notificationSendStatus: NOTIFICATION_STATUS.NEW,
    receiverType: NOTIFICATION_RECEIVER.STAFF,
    notificationType: NOTIFICATION_TYPE.GENERAL,
    notificationTopic: NOTIFICATION_TOPIC.STAFF,
    receiverId,
    stationsId,
    staffTaskId,
    notificationTitle: 'Bạn có nhiệm vụ mới !',
    notificationContent: `${assigneeName} đã giao cho bạn một nhiệm vụ mới, bấm để xem chi tiết ! `,
  };

  return insertManyNotificationByMethod(notifyData);
}

module.exports = {
  insertManyNotificationByMethod,
  insertGroupNotification,
  notifyExpiredTaskToStaff,
  notifyNewTaskToStaff,
};
