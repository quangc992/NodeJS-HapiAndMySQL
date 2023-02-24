/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';

const Logger = require('../../../utils/logging');
const moment = require('moment');
const StaffTaskResourceAccess = require('../resourceAccess/StaffTaskResourceAccess');
const StaffTaskMappingResourceAccess = require('../resourceAccess/StaffTaskMappingResourceAccess');
const { UNKNOWN_ERROR } = require('../../Common/CommonConstant');
const { STAFF_TASK_ERROR, STAFF_TASK_STATUS, STAFF_TASK_PRIORITY } = require('../StaffTaskConstants');
const StaffTaskFunctions = require('../StaffTaskFunctions');
const StaffResourceAccess = require('../../Staff/resourceAccess/StaffResourceAccess');
const TaskUpdateHistoryFunctions = require('../../TaskUpdateHistory/TaskUpdateHistoryFunctions');
const StaffTaskConstants = require('../StaffTaskConstants');
const StationsResourceAccess = require('../../Stations/resourceAccess/StationsResourceAccess');
const { STATION_STATUS, STATION_TYPE } = require('../../Stations/StationsConstants');
const StaffNotificaitonFucntions = require('../../StaffNotification/StaffNotificationFunctions');

function _readData(req) {
  let data = {
    id: req.payload.id,
    taskData: req.payload.taskData,
    staffList: req.payload.staffList,
  };
  return data;
}

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = _readData(req);
      const staffId = req.currentUser.staffId;
      const stationsId = req.currentUser.stationsId;
      const staffName = req.currentUser.firstName;

      data.taskData.reportedStaffId = staffId;
      data.taskData.stationId = stationsId;

      _timeHandler(data.taskData);

      let addResult = await StaffTaskResourceAccess.insert(data.taskData);

      if (addResult === undefined) {
        return reject(STAFF_TASK_ERROR.STAFF_TASK_NOT_FOUND);
      } else {
        const [taskId] = addResult;
        const updateStaffNameResult = await StaffTaskResourceAccess.updateById(taskId, { taskName: `VR-${taskId}` });

        if (updateStaffNameResult === undefined) {
          Logger.error(__filename, STAFF_TASK_ERROR.AUTO_GENERATED_NAME_FAILED);
        }

        const createNotification = await StaffNotificaitonFucntions.notifyNewTaskToStaff(
          data.taskData.assignedStaffId,
          taskId,
          stationsId,
          staffName,
        );

        if (!createNotification) {
          Logger.error(__filename, STAFF_TASK_ERROR.CREATE_NOTIFICATION_FAILED);
        }

        return resolve(addResult);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

function _timeHandler(data) {
  let { taskStartDate, taskEndDate } = data;

  if (!taskEndDate) {
    if (taskStartDate) {
      taskEndDate = moment(taskStartDate).add(1, 'days').toDate();
    } else {
      taskEndDate = moment(new Date()).add(1, 'days').toDate();
    }
  }

  data.taskEndDate = taskEndDate;
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await StaffTaskResourceAccess.updateById(id, { isDeleted: 1 });
      let getResult = await StaffTaskMappingResourceAccess.updateAll({ isDeleted: 1 }, { taskId: id });
      if (result && getResult) {
        resolve(result);
      }
      reject(UNKNOWN_ERROR);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { staffId: createdByStaffId } = req.currentUser;
      let data = _readData(req);
      const currentTask = await StaffTaskResourceAccess.findById(data.id);

      if (!currentTask) {
        return reject(STAFF_TASK_ERROR.STAFF_TASK_NOT_FOUND);
      }

      let updateResult = await StaffTaskResourceAccess.updateById(data.id, data.taskData);

      if (updateResult) {
        const insertTaskHistory = await TaskUpdateHistoryFunctions.insertAllTaskUpdateHistory(createdByStaffId, data.id, currentTask, data.taskData);

        if (!insertTaskHistory) {
          Logger.error(__filename, STAFF_TASK_ERROR.INSERT_TASK_UPDATE_HISTORY_FAILED);
        }

        return resolve('SUCCESS');
      }

      return reject(UNKNOWN_ERROR);
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateStaffOnTask(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { staffId: createdByStaffId } = req.currentUser;
      const { taskId, staffId } = req.payload;

      const taskRecord = await StaffTaskResourceAccess.findById(taskId);
      const staffRecord = await StaffResourceAccess.findById(staffId);

      if (!taskRecord) {
        return reject('TASK_NOT_FOUND');
      }

      if (!staffRecord) {
        return reject('STAFF_NOT_FOUND');
      }

      const updateResult = await StaffTaskResourceAccess.updateById(taskId, { assignedStaffId: staffId });

      if (updateResult) {
        const oldAssignedStaffId = taskRecord.assignedStaffId;

        const insertTaskHistory = await TaskUpdateHistoryFunctions.insertTaskUpdateHistory(
          createdByStaffId,
          taskId,
          'assignedStaffId',
          oldAssignedStaffId,
          staffId,
        );

        if (!insertTaskHistory) {
          Logger.error(__filename, STAFF_TASK_ERROR.INSERT_TASK_UPDATE_HISTORY_FAILED);
        }

        return resolve('SUCCESS');
      } else {
        return reject('UPDATE_FAILED');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let staffTask = await StaffTaskResourceAccess.find({ staffTaskId: req.payload.id }, undefined, 1, undefined);
      let result = [];
      if (staffTask && staffTask.length > 0) {
        result = await StaffTaskFunctions.findStationAndStaffOnTask(staffTask[0]);
        return resolve(result);
      }
      reject(UNKNOWN_ERROR);
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const allowedStationIds = req.allowedStationIds;

      let filter = req.payload.filter || {};
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      //tam thoi chua phan quyen theo phong ban
      // filter.stationId = allowedStationIds || [];

      filter.reportedStaffId = req.currentUser.staffId;

      if (!filter.assignedStaffId) {
        filter.assignedStaffId = req.currentUser.staffId;
      }

      let staffTaskCount = await StaffTaskResourceAccess.customCount(filter, startDate, endDate, searchText, order);

      if (staffTaskCount && staffTaskCount.length > 0 && staffTaskCount[0].count > 0) {
        let _dataList = await StaffTaskFunctions.findByFilter(filter, skip, limit, startDate, endDate, searchText, order);
        return resolve({
          data: _dataList,
          total: staffTaskCount[0].count,
        });
      } else {
        return resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function statisticalWorkProgress(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationList = req.allowedStationIds;
      let filter = req.payload.filter ? req.payload.filter : { stationId: stationList };
      let date = moment().format();
      let taskStatusArr = [STAFF_TASK_STATUS.NEW, STAFF_TASK_STATUS.ASSIGNED, STAFF_TASK_STATUS.PROCESSING];
      let pStaffTaskPriorityNomal, pStaffTaskPriorityHigh, pStaffTaskPriorityLow;
      let fStaffTaskPriorityNomal, fStaffTaskPriorityHigh, fStaffTaskPriorityLow;
      let oStaffTaskPriorityNomal, oStaffTaskPriorityHigh, oStaffTaskPriorityLow;
      await Promise.all([
        (pStaffTaskPriorityNomal = await StaffTaskResourceAccess.customCount(
          { ...filter, taskStatus: STAFF_TASK_STATUS.PROCESSING, taskPriority: STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_NORMAL },
          undefined,
          undefined,
          undefined,
          undefined,
        )),
        (pStaffTaskPriorityHigh = await StaffTaskResourceAccess.customCount(
          { ...filter, taskStatus: STAFF_TASK_STATUS.PROCESSING, taskPriority: STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_HIGH },
          undefined,
          undefined,
          undefined,
          undefined,
        )),
        (pStaffTaskPriorityLow = await StaffTaskResourceAccess.customCount(
          { ...filter, taskStatus: STAFF_TASK_STATUS.PROCESSING, taskPriority: STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_LOW },
          undefined,
          undefined,
          undefined,
          undefined,
        )),
        (oStaffTaskPriorityNomal = await StaffTaskResourceAccess.customCount(
          { ...filter, taskPriority: STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_NORMAL, taskStatus: taskStatusArr },
          undefined,
          date,
          undefined,
          undefined,
        )),
        (oStaffTaskPriorityHigh = await StaffTaskResourceAccess.customCount(
          { ...filter, taskPriority: STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_HIGH, taskStatus: taskStatusArr },
          undefined,
          date,
          undefined,
          undefined,
        )),
        (oStaffTaskPriorityLow = await StaffTaskResourceAccess.customCount(
          { ...filter, taskPriority: STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_LOW, taskStatus: taskStatusArr },
          undefined,
          date,
          undefined,
          undefined,
        )),
        (fStaffTaskPriorityNomal = await StaffTaskResourceAccess.customCount(
          { ...filter, taskStatus: STAFF_TASK_STATUS.FINISHED, taskPriority: STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_NORMAL },
          undefined,
          undefined,
          undefined,
          undefined,
        )),
        (fStaffTaskPriorityHigh = await StaffTaskResourceAccess.customCount(
          { ...filter, taskStatus: STAFF_TASK_STATUS.FINISHED, taskPriority: STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_HIGH },
          undefined,
          undefined,
          undefined,
          undefined,
        )),
        (fStaffTaskPriorityLow = await StaffTaskResourceAccess.customCount(
          { ...filter, taskStatus: STAFF_TASK_STATUS.FINISHED, taskPriority: STAFF_TASK_PRIORITY.STAFF_TASK_PRIORITY_LOW },
          undefined,
          undefined,
          undefined,
          undefined,
        )),
      ]);
      let result = {
        processingTask: {
          staffTaskPriorityNomal: pStaffTaskPriorityNomal && pStaffTaskPriorityNomal.length > 0 ? pStaffTaskPriorityNomal[0].count : 0,
          staffTaskPriorityHigh: pStaffTaskPriorityHigh && pStaffTaskPriorityHigh.length > 0 ? pStaffTaskPriorityHigh[0].count : 0,
          staffTaskPriorityLow: pStaffTaskPriorityLow && pStaffTaskPriorityLow.length > 0 ? pStaffTaskPriorityLow[0].count : 0,
        },
        outOfDateTask: {
          staffTaskPriorityNomal: oStaffTaskPriorityNomal && oStaffTaskPriorityNomal.length > 0 ? oStaffTaskPriorityNomal[0].count : 0,
          staffTaskPriorityHigh: oStaffTaskPriorityHigh && oStaffTaskPriorityHigh.length > 0 ? oStaffTaskPriorityHigh[0].count : 0,
          staffTaskPriorityLow: oStaffTaskPriorityLow && oStaffTaskPriorityLow.length > 0 ? oStaffTaskPriorityLow[0].count : 0,
        },
        finishedTask: {
          staffTaskPriorityNomal: fStaffTaskPriorityNomal && fStaffTaskPriorityNomal.length > 0 ? fStaffTaskPriorityNomal[0].count : 0,
          staffTaskPriorityHigh: fStaffTaskPriorityHigh && fStaffTaskPriorityHigh.length > 0 ? fStaffTaskPriorityHigh[0].count : 0,
          staffTaskPriorityLow: fStaffTaskPriorityLow && fStaffTaskPriorityLow.length > 0 ? fStaffTaskPriorityLow[0].count : 0,
        },
      };

      return resolve(result);
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}
async function statisticalAmountOfWork(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationList = req.allowedStationIds;
      let filter = req.payload.filter ? req.payload.filter : { stationId: stationList };
      let result = [];
      let thisMonth = moment().get('month');
      for (let i = 0; i < 12; i++) {
        let startDate = moment()
          .startOf('month')
          .add(i - thisMonth, 'month')
          .format();
        let endDate = moment()
          .endOf('month')
          .add(i - thisMonth, 'month')
          .format();
        let totalTask, finishedTask;
        await Promise.all([
          (totalTask = await StaffTaskResourceAccess.customCount({ ...filter }, startDate, endDate, undefined, undefined)),
          (finishedTask = await StaffTaskResourceAccess.customCount(
            { ...filter, taskStatus: StaffTaskConstants.STAFF_TASK_STATUS.FINISHED },
            startDate,
            endDate,
            undefined,
            undefined,
          )),
        ]);
        let resultItem = {
          totalTask: totalTask && totalTask.length > 0 ? totalTask[0].count : 0,
          finishedTask: finishedTask && finishedTask.length > 0 ? finishedTask[0].count : 0,
        };
        result.push(resultItem);
      }
      return resolve(result);
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function statisticalOutOfWork(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let date = moment().format();
      let taskStatusArr = [
        StaffTaskConstants.STAFF_TASK_STATUS.NEW,
        StaffTaskConstants.STAFF_TASK_STATUS.ASSIGNED,
        StaffTaskConstants.STAFF_TASK_STATUS.PROCESSING,
      ];
      let stationList = req.allowedStationIds;
      let data = [];
      for (let i = 0; i < stationList.length; i++) {
        let station = await StationsResourceAccess.findById(stationList[i]);
        if (station) {
          let outOfDateTaskCount = await StaffTaskResourceAccess.customCount(
            { stationId: stationList[i], taskStatus: taskStatusArr },
            undefined,
            date,
            undefined,
            undefined,
          );
          let dataItem = {
            stationId: stationList[i],
            stationName: station.stationsName,
            outOfDateTaskCount: outOfDateTaskCount && outOfDateTaskCount.length > 0 ? outOfDateTaskCount : 0,
          };
          data.push(dataItem);
        }
      }
      let tolal = await StaffTaskResourceAccess.customCount(
        { stationId: stationList, taskStatus: taskStatusArr },
        undefined,
        date,
        undefined,
        undefined,
      );
      return resolve({ data: data, tolal: tolal });
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function generateTask(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const _content = req.payload.content;
      const _staff = req.currentUser;
      let _taskList = await StaffTaskFunctions.generateTaskFromContent(_content, [], [], _staff);
      return resolve(_taskList);
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

module.exports = {
  insert,
  deleteById,
  updateById,
  updateStaffOnTask,
  findById,
  find,
  generateTask,
  statisticalWorkProgress,
  statisticalAmountOfWork,
  statisticalOutOfWork,
};
