/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const WalletBalanceUnitResourceAccess = require('../resourceAccess/WalletBalanceUnitResourceAccess');
const WalletBalanceUnitFunction = require('../WalletBalanceUnitFunctions');
const Logger = require('../../../utils/logging');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let insertData = req.payload;

      //gia ban dai ly = voi gia ban cua user
      if (insertData.userSellPrice) {
        insertData.agencySellPrice = insertData.userSellPrice;
      }

      let createResult = await WalletBalanceUnitFunction.insertNewBalanceUnit(insertData);
      if (createResult) {
        resolve(createResult);
      } else {
        Logger.error(`insert new balance unit failed`);
        reject(`failed`);
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let searchText = req.payload.searchText;
      let result = await WalletBalanceUnitResourceAccess.customSearch(
        req.payload.filter,
        req.payload.skip,
        req.payload.limit,
        undefined,
        undefined,
        searchText,
      );

      if (result && result.length > 0) {
        let resultCount = await WalletBalanceUnitResourceAccess.customCount(req.payload.filter, undefined, undefined, searchText);
        resolve({
          data: result,
          total: resultCount[0].count,
        });
      } else {
        Logger.error(`WalletBalanceUnitResourceAccess can not get list`);
        reject(`failed`);
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let updateId = req.payload.id;
      let updateData = req.payload.data;

      //gia ban dai ly = voi gia ban cua user
      if (updateData.userSellPrice) {
        updateData.agencySellPrice = updateData.userSellPrice;
      }

      let result = await WalletBalanceUnitResourceAccess.updateById(updateId, updateData);
      if (result) {
        resolve(result);
      } else {
        Logger.error(`WalletBalanceUnitResourceAccess.updateById ${updateId} failed`);
        reject('failed');
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
      resolve('success');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    let id = req.payload.id;
    let result = await WalletBalanceUnitResourceAccess.deleteById(id);
    if (result) {
      resolve(result);
    } else {
      reject('failed');
    }
  });
}

async function getList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let searchText = req.payload.searchText;
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let result = await WalletBalanceUnitResourceAccess.customSearch(filter, skip, limit, undefined, undefined, searchText);

      if (result && result.length > 0) {
        let resultCount = await WalletBalanceUnitResourceAccess.customCount(filter, undefined, undefined, searchText);
        resolve({
          data: result,
          total: resultCount[0].count,
        });
      } else {
        resolve({
          data: [],
          total: 0,
        });
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}
module.exports = {
  insert,
  find,
  updateById,
  findById,
  deleteById,
  getList,
};
