/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'user strict';

const Logger = require('../../../utils/logging');
const TaskUpdateHistoryResourceAccess = require('../resourceAccess/TaskUpdateHistoryResourceAccess');
const TaskUpdateHistoryView = require('../resourceAccess/TaskUpdateHistoryView');
const StaffResourceAccess = require('../../Staff/resourceAccess/StaffResourceAccess');
const { UNKNOWN_ERROR } = require('../../Common/CommonConstant');

const _tableName = 'TaskUpdateHistory';

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { filter, skip, limit, order } = req.payload;

      const taskUpdateHistoryCount = await TaskUpdateHistoryResourceAccess.count(filter);

      if (taskUpdateHistoryCount) {
        const taskUpdateHistoryRecords = await TaskUpdateHistoryView.find(filter, skip, limit, order);

        if (taskUpdateHistoryRecords) {
          await _putStaffInfoToHistoryRecord(taskUpdateHistoryRecords);

          return resolve({ data: taskUpdateHistoryRecords, total: taskUpdateHistoryCount });
        } else {
          return resolve({ data: [], total: 0 });
        }
      } else {
        return resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(_tableName, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function _putStaffInfoToHistoryRecord(taskUpdateHistoryRecords) {
  for (let i = 0; i < taskUpdateHistoryRecords.length; i++) {
    const taskUpdateHistoryRecord = taskUpdateHistoryRecords[i];

    if (['assignedStaffId', 'reportedStaffId'].includes(taskUpdateHistoryRecord.updatedColumnName)) {
      const fromStaffId = parseInt(taskUpdateHistoryRecord.fromValue);
      const toStaffId = parseInt(taskUpdateHistoryRecord.toValue);

      if (fromStaffId) {
        const fromStaffInfo = await StaffResourceAccess.findById(fromStaffId);
        if (fromStaffInfo) {
          taskUpdateHistoryRecord.fromStaffInfo = {
            staffName: fromStaffInfo.firstName,
            staffAvatar: fromStaffInfo.userAvatar,
          };
        }
      }

      if (toStaffId) {
        const toStaffInfo = await StaffResourceAccess.findById(toStaffId);
        if (toStaffInfo) {
          taskUpdateHistoryRecord.toStaffInfo = {
            staffName: toStaffInfo.firstName,
            staffAvatar: toStaffInfo.userAvatar,
          };
        }
      }
    }
  }
}

module.exports = { find };
