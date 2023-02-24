/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const TaskAttachmentResourcAccess = require('../resourceAccess/TaskAttachmentResourceAccess');
const { UNKNOWN_ERROR } = require('../../Common/CommonConstant');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      let addResult = await TaskAttachmentResourcAccess.insert(data);
      if (addResult === undefined) {
        return reject(UNKNOWN_ERROR);
      } else {
        return resolve(addResult);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;

      let taskAttachmentCount = await TaskAttachmentResourcAccess.customCount(filter, startDate, endDate, searchText, order);
      if (taskAttachmentCount && taskAttachmentCount.length > 0 && taskAttachmentCount[0].count > 0) {
        let _dataList = await TaskAttachmentResourcAccess.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
        return resolve({
          data: _dataList,
          total: taskAttachmentCount[0].count,
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

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let taskAttachment = await TaskAttachmentResourcAccess.findById(req.payload.id);
      if (taskAttachment !== undefined) {
        return resolve(taskAttachment);
      } else {
        return reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      console.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload.data;
      let updateResult = await TaskAttachmentResourcAccess.updateAll(data, {
        taskAttachmentId: req.payload.id,
      });
      if (updateResult !== undefined) {
        return resolve(updateResult);
      } else {
        return reject(UNKNOWN_ERROR);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let deleteResult = await TaskAttachmentResourcAccess.updateById(req.payload.id, { isDeleted: 1 });
      if (deleteResult) {
        return resolve(deleteResult);
      }
      return reject(UNKNOWN_ERROR);
    } catch (e) {
      Logger.error(__filename, e);
      reject(UNKNOWN_ERROR);
    }
  });
}

module.exports = {
  insert,
  find,
  findById,
  updateById,
  deleteById,
};
