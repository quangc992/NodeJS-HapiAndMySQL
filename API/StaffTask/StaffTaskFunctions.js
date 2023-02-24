/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StaffResourceAccess = require('../Staff/resourceAccess/StaffResourceAccess');
const StationsResourceAccess = require('../Stations/resourceAccess/StationsResourceAccess');
const StaffTaskMappingResourceAccess = require('./resourceAccess/StaffTaskMappingResourceAccess');
const StaffTaskResourceAccess = require('./resourceAccess/StaffTaskResourceAccess');
const moment = require('moment');

async function _countTotalSubTaskCount(taskId) {
  //dem so task con
  let _countAll = await StaffTaskResourceAccess.count({ parentTaskId: taskId }, 0, 100);
  if (_countAll) {
    return _countAll;
  } else {
    return 0;
  }
}

async function mappingStaffIdListToTask(staffIdList, taskId) {
  let staffListTask = [];
  if (staffIdList === undefined) {
    return;
  } else {
    for (let i = 0; i < staffIdList.length; i++) {
      staffListTask.push({
        staffId: staffIdList[i],
        taskId: taskId,
      });
    }
    await StaffTaskMappingResourceAccess.insert(staffListTask);
  }
}

async function deleteTaskForStaffList(staffList) {
  for (let i = 0; i < staffList.length; i++) {
    await StaffTaskMappingResourceAccess.deleteByFilter({ staffTaskMappingId: staffList[i].staffTaskMappingId });
  }
}
async function findByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let staffTasks = await StaffTaskResourceAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
  let _promiseList = [];
  for (let i = 0; i < staffTasks.length; i++) {
    _promiseList.push(findStationAndStaffOnTask(staffTasks[i]));
  }

  let _taskList = await Promise.all(_promiseList);
  return _taskList;
}

async function findStationAndStaffOnTask(staffTask) {
  let station = await StationsResourceAccess.find({ stationsId: staffTask.stationId }, undefined, 1, undefined);
  if (station.length !== 0) {
    staffTask.station = station[0];
  }

  //nguoi bao cao
  let staffTaskManager = await StaffResourceAccess.find({ staffId: staffTask.reportedStaffId }, undefined, 1, undefined);
  if (staffTaskManager.length !== 0) {
    staffTask.staffTaskManagerName = staffTaskManager[0].firstName;
    staffTask.reportedStaff = staffTaskManager[0];
  }

  //nguoi thuc hien
  let staffTaskAssignor = await StaffResourceAccess.find({ staffId: staffTask.assignedStaffId }, undefined, 1, undefined);
  if (staffTaskAssignor.length !== 0) {
    staffTask.staffTaskAssignorName = staffTaskAssignor[0].firstName;
    staffTask.assignedStaff = staffTaskAssignor[0];
  }

  //dem danh sach task con
  staffTask.totalSubTaskCount = 0;
  staffTask.totalSubTaskCount = await _countTotalSubTaskCount(staffTask.staffTaskId);

  return staffTask;
}

async function generateTaskFromContent(content, stationList, staffList, currentStaff) {
  let _generatedList = [];
  let _taskContentList = [];

  if (content.indexOf('\r\n') >= 0) {
    _taskContentList = content.split('\r\n');
  } else if (content.indexOf('<br>') >= 0) {
    _taskContentList = content.split('<br>');
  } else {
    _taskContentList = [content];
  }

  for (let i = 0; i < _taskContentList.length; i++) {
    const _taskContent = _taskContentList[i];
    let _newTask = {
      taskDescription: _taskContent,
      taskTitle: _taskContent,
      stationId: null,
      assignedStaffId: null,
    };
    if (currentStaff && currentStaff.stationsId) {
      _newTask.stationId = currentStaff.stationsId;
    }
    _generatedList.push(_newTask);
  }

  return _generatedList;
}

async function getListTaskExpiredAtTomorrow() {
  const tomorrow = moment().add(1, 'days');
  const endDate = tomorrow.endOf('day').format();
  const taskList = await StaffTaskResourceAccess.customSearch(undefined, undefined, undefined, undefined, endDate);

  if (taskList) {
    return taskList;
  }

  return [];
}

module.exports = {
  mappingStaffIdListToTask,
  findByFilter,
  findStationAndStaffOnTask,
  deleteTaskForStaffList,
  generateTaskFromContent,
  getListTaskExpiredAtTomorrow,
};
