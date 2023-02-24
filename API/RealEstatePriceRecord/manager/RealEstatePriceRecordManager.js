/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by Huu on 11/18/21.
 */

'use strict';
const RealEstateReportResourceAccess = require('../resourceAccess/RealEstateReportResourceAccess');
const RealEstateViews = require('../../RealEstate/resourceAccess/RealEstateViews');
const Logger = require('../../../utils/logging');
const moment = require('moment');
const { REPORTED_POST } = require('../../CustomerMessage/CustomerMessageConstant');
const RealEstateResourceAccess = require('../../RealEstate/resourceAccess/RealEstateResourceAccess');
const { handleSendMessageRealEstate } = require('../../CustomerMessage/CustomerMessageFunctions');

async function reportPostProblem(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.payload;
      if (req.currentUser.appUserId) {
        data.appUserId = req.currentUser.appUserId;
      } else {
        Logger.error(`do not allow anonymous report`);
        reject('failed');
        return;
      }

      if (data.realEstateId === 0) {
        Logger.error(`can not update invalid realEstateId`);
        reject('failed');
        return;
      }

      let result = await RealEstateReportResourceAccess.insert(data);
      if (result) {
        let realEstateData = await RealEstateResourceAccess.findById(data.realEstateId);
        if (realEstateData) {
          const TIME_SEND = moment().format('hh:mm DD/MM/YYYY');
          const messageData = {
            postId: realEstateData.appUserId,
            timeRefused: TIME_SEND,
            userId: data.appUserId,
            reason: data.reportTitle,
          };
          await handleSendMessageRealEstate(REPORTED_POST, messageData, realEstateData);
        }
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
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

      let data = await RealEstateReportResourceAccess.find(filter, skip, limit, order);
      let dataCount = await RealEstateReportResourceAccess.count(filter, order);
      if (data && dataCount) {
        resolve({ data: data, total: dataCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await RealEstateReportResourceAccess.findById(id);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let data = req.payload.data;
      let result = await RealEstateReportResourceAccess.updateById(id, data);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await RealEstateReportResourceAccess.deleteById(id);
      if (result) {
        resolve(result);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function getDetailRealEstateReport(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let result = await RealEstateReportResourceAccess.findById(id);
      if (result) {
        let realEstateId = result.realEstateId;
        let resultRealEstate = await RealEstateViews.findById(realEstateId);
        if (resultRealEstate) {
          resolve(resultRealEstate);
        } else {
          reject('failed');
        }
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  reportPostProblem,
  find,
  findById,
  updateById,
  deleteById,
  getDetailRealEstateReport,
};
