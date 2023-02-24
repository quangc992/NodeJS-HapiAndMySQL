/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'user strict';
const Logger = require('../../../utils/logging');

const TaskCommentsResourceAccess = require('../resourceAccess/TaskCommentsResourceAccess');
const TaskCommentsView = require('../resourceAccess/TaskCommentsView');

const { UNKNOWN_ERROR } = require('../../Common/CommonConstant');
const { TASK_COMMENTS_ERRORS } = require('../TaskCommentsConstants');

const _tableName = 'TaskComments';

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { staffId } = req.currentUser;
      const commentData = req.payload;
      const result = await TaskCommentsResourceAccess.insert({ ...commentData, staffId });

      if (result) {
        return resolve(result);
      } else {
        return reject(TASK_COMMENTS_ERRORS.INSERT_FAILED);
      }
    } catch (e) {
      Logger.error(_tableName, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { filter, skip, limit, order } = req.payload;

      const taskCommentsCount = await TaskCommentsResourceAccess.count(filter);

      if (taskCommentsCount) {
        const taskCommentsRecords = await TaskCommentsView.find(filter, skip, limit, order);

        if (taskCommentsRecords) {
          return resolve({ data: taskCommentsRecords, total: taskCommentsCount });
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

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.payload.id;

      const result = await TaskCommentsResourceAccess.deleteById(id);

      if (result === 1) {
        return resolve('success');
      } else {
        return reject(TASK_COMMENTS_ERRORS.DELETE_FAILED);
      }
    } catch (e) {
      Logger.error(_tableName, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, data } = req.payload;

      const result = await TaskCommentsResourceAccess.updateById(id, data);

      if (result === 1) {
        return resolve('success');
      } else {
        return reject(TASK_COMMENTS_ERRORS.UPDATE_FAILED);
      }
    } catch (e) {
      Logger.error(_tableName, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

module.exports = { insert, find, deleteById, updateById };
