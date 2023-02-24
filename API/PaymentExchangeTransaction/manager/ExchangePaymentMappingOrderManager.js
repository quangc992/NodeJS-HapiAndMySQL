/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const ExchangePaymentMappingOrderView = require('../resourceAccess/ExchangePaymentMappingOrderView');
const { ERROR } = require('../../Common/CommonConstant');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      console.error(`error can not create exchange transaction`);
      reject('can not create exchange transaction');
    } catch (e) {
      Logger.error(e);
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
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let transactionList = await ExchangePaymentMappingOrderView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await ExchangePaymentMappingOrderView.customCount(filter, undefined, undefined, startDate, endDate, searchText, order);
        resolve({
          data: transactionList,
          total: transactionCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
      console.error(`error exchange transaction find: ${ERROR}`);
      reject('failed');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve('success');
    } catch (e) {
      Logger.error(e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionList = await ExchangePaymentMappingOrderView.findById(req.payload.id);
      if (transactionList) {
        resolve(transactionList);
      } else {
        Logger.error(`ExchangePaymentMappingOrderView can not findById ${req.payload.id}`);
        reject('failed');
      }
    } catch (e) {
      Logger.error(e);
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
      let searchText = req.payload.searchText;
      if (!filter) {
        filter = {};
      }
      filter.appUserId = req.currentUser.appUserId;

      let transactionList = await ExchangePaymentMappingOrderView.customSearch(filter, skip, limit, startDate, endDate, searchText, order);

      if (transactionList && transactionList.length > 0) {
        let transactionCount = await ExchangePaymentMappingOrderView.customCount(filter, undefined, undefined, startDate, endDate, searchText, order);
        resolve({
          data: transactionList,
          total: transactionCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      Logger.error(e);
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
};
