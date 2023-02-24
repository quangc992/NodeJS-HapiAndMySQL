/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const TaskUpdateHistoryResourceAccess = require('./resourceAccess/TaskUpdateHistoryResourceAccess');
const moment = require('moment');
const { CHANGE_TYPE } = require('./TaskUpdateHistoryConstants');

async function insertTaskUpdateHistory(createdByStaffId, taskId, updatedColumnName, oldValue, newValue) {
  const insertData = {
    createdByStaffId,
    taskId,
    updatedColumnName,
  };

  if (oldValue && newValue) {
    insertData.changeType = CHANGE_TYPE.UPDATE;
    insertData.fromValue = oldValue;
    insertData.toValue = newValue;
  } else if (!oldValue && newValue) {
    insertData.changeType = CHANGE_TYPE.ADD;
    insertData.toValue = newValue;
  } else if (oldValue && !newValue) {
    insertData.changeType = CHANGE_TYPE.DELETE;
    insertData.fromValue = oldValue;
  }

  return await TaskUpdateHistoryResourceAccess.insert(insertData);
}

async function insertAllTaskUpdateHistory(createdByStaffId, taskId, oldData, newData) {
  const insertStatusPromiseList = [];

  for (const key in newData) {
    const oldValue = oldData[key];
    const newValue = newData[key];

    if ((newValue || oldValue) && oldValue !== newValue) {
      insertStatusPromiseList.push(insertTaskUpdateHistory(createdByStaffId, taskId, key, _convertToString(oldValue), _convertToString(newValue)));
    }
  }

  return Promise.all(insertStatusPromiseList);
}

function _convertToString(value) {
  if (value !== null && value !== undefined) {
    if (value instanceof Date) {
      return moment(value).format('DD-MM-YYYY : HH:mm:ss');
    } else {
      return String(value);
    }
  }
  return value;
}

module.exports = {
  insertTaskUpdateHistory,
  insertAllTaskUpdateHistory,
};
