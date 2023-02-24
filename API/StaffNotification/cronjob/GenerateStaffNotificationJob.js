/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const Logger = require('../../../utils/logging');
const GroupStaffNotificationResourceAccess = require('../resourceAccess/GroupStaffNotificationResourceAccess');
const StaffResourceAccess = require('../../Staff/resourceAccess/StaffResourceAccess');
const StaffNotificationFunctions = require('../StaffNotificationFunctions');
const StaffTaskFunctions = require('../../StaffTask/StaffTaskFunctions');

const { NOTIFICATION_STATUS } = require('../StaffNotificationConstants');

async function _createAllNotificationByGroup(groupNotification, staffList) {
  await GroupStaffNotificationResourceAccess.updateById(groupNotification.groupStaffNotificationId, {
    groupStaffNotificationStatus: NOTIFICATION_STATUS.SENDING,
  });

  const promiseList = staffList.map(({ staffId }) => {
    const notificationData = {
      notificationSendStatus: NOTIFICATION_STATUS.NEW,
      notificationTopic: groupNotification.groupStaffNotificationTopic,
      notificationType: groupNotification.groupStaffNotificationType,
      receiverId: staffId,
      stationsId: groupNotification.stationsId,
      notificationImage: groupNotification.groupStaffNotificationImage,
      notificationTitle: groupNotification.groupStaffNotificationTitle,
      notificationContent: groupNotification.groupStaffNotificationContent,
      groupStaffNotificationId: groupNotification.groupStaffNotificationId,
    };
    return StaffNotificationFunctions.insertManyNotificationByMethod(notificationData);
  });

  await Promise.all(promiseList);

  await GroupStaffNotificationResourceAccess.updateById(groupNotification.groupStaffNotificationId, {
    groupStaffNotificationStatus: NOTIFICATION_STATUS.COMPLETED,
  });
}

async function generateNotificationFromGroupNotification() {
  const filterGroupHaveStatusNew = {
    groupStaffNotificationStatus: NOTIFICATION_STATUS.NEW,
  };

  const countGroupNotification = await GroupStaffNotificationResourceAccess.count(filterGroupHaveStatusNew);

  if (!countGroupNotification) {
    return Logger.info('DONE');
  }

  const groupNotificationList = await GroupStaffNotificationResourceAccess.find(filterGroupHaveStatusNew, 0, 100);

  if (groupNotificationList && groupNotificationList.length > 0) {
    for (const groupNotification of groupNotificationList) {
      const stationsId = groupNotification.stationsId;
      const filter = stationsId ? { stationsId } : {};

      const staffList = await StaffResourceAccess.find(filter);

      await _createAllNotificationByGroup(groupNotification, staffList || []);
    }

    Logger.info('OK');
  } else {
    Logger.info('DONE');
  }
}

async function checkExpiredTask() {
  const expiredTaskList = await StaffTaskFunctions.getListTaskExpiredAtTomorrow();

  if (!expiredTaskList || expiredTaskList.length <= 0) {
    return Logger.info('DONE');
  }

  for (const staffTask of expiredTaskList) {
    const { staffTaskId, assignedStaffId, stationId } = staffTask;

    if (assignedStaffId) {
      await StaffNotificationFunctions.notifyExpiredTaskToStaff(assignedStaffId, staffTaskId, stationId);
    }
  }
  Logger.info('NOTIFY EXPIRED TASK TO STAFF SUCCESSFULLY !');
}

module.exports = {
  generateNotificationFromGroupNotification,
  checkExpiredTask,
};
