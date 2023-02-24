/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const GamePlayRecordsResourceAccess = require('../resourceAccess/GamePlayRecordsResourceAccess');
const GamePlayRecordsFunction = require('../GamePlayRecordsFunctions');
const GamePlayRecordsView = require('../resourceAccess/GamePlayRecordsView');
const { BET_STATUS, PLACE_RECORD_ERROR } = require('../GamePlayRecordsConstant');
const { ERROR } = require('../../Common/CommonConstant');
const moment = require('moment');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    resolve('success');
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

      let betRecordList = await GamePlayRecordsView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);
      if (betRecordList && betRecordList.length > 0) {
        let betRecordCount = await GamePlayRecordsView.customCount(filter, skip, limit, startDate, endDate, searchText);
        let betRecordSum = await GamePlayRecordsView.sum('betRecordAmountIn', filter, order);

        resolve({ data: betRecordList, total: betRecordCount[0].count, totalSum: betRecordSum[0].sumResult });
      } else {
        resolve({ data: [], total: 0, totalSum: 0 });
      }
    } catch (e) {
      console.error(`error find bet record: `, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let updateResult = await GamePlayRecordsResourceAccess.updateById(req.payload.id, req.payload.data);
      if (updateResult) {
        resolve(updateResult);
      } else {
        resolve({});
      }
    } catch (e) {
      console.error(`error update by id bet record ${req.payload.id}: `, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let betRecordList = await GamePlayRecordsView.find({ betRecordId: req.payload.id });
      if (betRecordList && betRecordList.length > 0) {
        resolve(betRecordList[0]);
      } else {
        console.error(`error BetRecord findById with betRecordId ${req.payload.id}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error bet record findById:${req.payload.id}`, e);
      reject('failed');
    }
  });
}

async function getList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

      //only get record of current user
      filter.appUserId = req.currentUser.appUserId;

      let betRecordList = await GamePlayRecordsResourceAccess.find(filter, skip, limit, undefined, startDate, endDate, order);
      if (betRecordList && betRecordList.length > 0) {
        // for (let i = 0; i < betRecordList.length; i++) {
        //   let _packageTypeTemp = betRecordList[i].packageType.split('');
        //   _packageTypeTemp[0] = betRecordList[i].packageName.slice(0, 1);
        //   betRecordList[i].packageType = _packageTypeTemp.join('');
        // }
        let betRecordCount = await GamePlayRecordsResourceAccess.count(filter, undefined, startDate, endDate);
        resolve({ data: betRecordList, total: betRecordCount[0].count });
      } else {
        resolve({ data: [], total: 0, totalSum: 0 });
      }
    } catch (e) {
      console.error(`error get list:`, e);
      reject('failed');
    }
  });
}

async function summaryUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;
      filter.appUserId = req.currentUser.appUserId;

      let result = await GamePlayRecordsResourceAccess.sumaryPointAmount(startDate, endDate, filter);
      if (result) {
        resolve(result[0]);
      } else {
        console.error(`error BetRecord summaryUser: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error summary User: `, e);
      reject('failed');
    }
  });
}
async function userSumaryWinLoseAmount(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;
      if (!filter) {
        filter = {};
      }
      filter.appUserId = req.currentUser.appUserId;

      let result = await GamePlayRecordsResourceAccess.sumaryWinLoseAmount(startDate, endDate, filter);

      if (result) {
        if (result[0].sumResult === null) {
          result[0].sumResult = 0;
        }
        resolve(result[0]);
      } else {
        console.error(`error BetRecord userSumaryWinLoseAmount: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error user Sumary Win Lose Amount:`, e);
      reject('failed');
    }
  });
}

async function summaryAll(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;

      let result = await GamePlayRecordsResourceAccess.sumaryPointAmount(startDate, endDate, filter);
      if (result) {
        resolve(result[0]);
      } else {
        console.error(`error summary All with startDate:${startDate} - endDate:${endDate}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error summary All:`, e);
      reject('failed');
    }
  });
}

async function userPlaceBetRecord(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let _currentUser = req.currentUser;
      let placeData = req.payload;

      const sectionName = placeData.sectionName.slice(0, 12);
      const sectionNameNumber = Number(sectionName);
      const currentSectionNumber = Number(moment().add(1, 'minute').format('YYYYMMDDHHmm'));
      if (sectionNameNumber < currentSectionNumber) {
        reject(PLACE_RECORD_ERROR.SELECTION_NAME_INVALID);
      }

      let placeResult = await GamePlayRecordsFunction.placeUserBet(
        _currentUser.appUserId,
        placeData.betRecordAmountIn,
        placeData.sectionName,
        placeData.betRecordType,
        placeData.betRecordValue,
      );

      if (placeResult) {
        resolve(placeResult);
      } else {
        console.error(`error BetRecord userPlaceBetRecord with appUserId ${_currentUser.appUserId}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error user Place Bet Record`, e);
      if (e === PLACE_RECORD_ERROR.SELECTION_NAME_INVALID) {
        console.error(`error  BetRecord userPlaceBetRecord: ${PLACE_RECORD_ERROR.SELECTION_NAME_INVALID}`);
        reject(PLACE_RECORD_ERROR.SELECTION_NAME_INVALID);
      } else {
        console.error(`error BetRecord userPlaceBetRecord: ${ERROR}`);
        reject('failed');
      }
    }
  });
}

async function getListPublicFeeds(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let betRecordList = await GamePlayRecordsView.customSearch(
        {
          betRecordStatus: BET_STATUS.COMPLETED,
        },
        0,
        10,
      );

      if (betRecordList && betRecordList.length > 0) {
        resolve({ data: betRecordList, total: betRecordList.length });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      console.error(`error get List Public Feeds`, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  getList,
  summaryAll,
  summaryUser,
  userSumaryWinLoseAmount,
  userPlaceBetRecord,
  getListPublicFeeds,
};
