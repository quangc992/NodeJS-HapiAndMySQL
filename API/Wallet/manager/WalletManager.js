/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const WalletRecordFunction = require('../../WalletRecord/WalletRecordFunction');
const UserResource = require('../../AppUsers/resourceAccess/AppUsersResourceAccess');
const { ERROR } = require('../../Common/CommonConstant');
const WalletResource = require('../resourceAccess/WalletResourceAccess');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let insertRes = await WalletResource.insert(req.payload);
      if (insertRes) {
        resolve(insertRes);
      } else {
        reject('failed');
      }
    } catch (e) {
      console.error(`error Wallet cannot insert`, e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve('success');
    } catch (e) {
      console.error(`error Wallet find`, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve('success');
    } catch (e) {
      console.error(`error Wallet updateById`, e);
      reject('failed');
    }
  });
}
async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve('success');
    } catch (e) {
      console.error(`error Wallet findById`, e);
      reject('failed');
    }
  });
}

async function increaseBalance(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentAmount = req.payload.paymentAmount;
      let appUserId = req.payload.appUserId;
      let walletType = req.payload.walletType;

      let user = await UserResource.find({ appUserId: appUserId }, 0, 1);
      if (!user || user.length < 1) {
        console.error(`error Wallet increaseBalance: INVALID_USER`);
        reject('INVALID_USER');
        return;
      }
      user = user[0];
      //luu tru lai lich su bien dong so du cua Vi
      let result = await WalletRecordFunction.adminAdjustBalance(appUserId, paymentAmount, walletType, req.currentUser);

      if (result) {
        resolve(result);
      } else {
        console.error(`error Wallet increaseBalance with appUserId ${appUserId}, walletType ${walletType}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error Wallet increaseBalance`, e);
      reject('failed');
    }
  });
}

async function decreaseBalance(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentAmount = req.payload.paymentAmount;
      let appUserId = req.payload.appUserId;
      let walletType = req.payload.walletType;

      let user = await UserResource.find({ appUserId: appUserId }, 0, 1);
      if (!user || user.length < 1) {
        console.error(`error Wallet decreaseBalance: INVALID_USER`);
        reject('INVALID_USER');
        return;
      }
      user = user[0];
      paymentAmount = paymentAmount * -1;

      //luu tru lai lich su bien dong so du cua Vi
      let result = await WalletRecordFunction.adminAdjustBalance(appUserId, paymentAmount, walletType, req.currentUser);

      if (result) {
        resolve(result);
      } else {
        console.error(`error Wallet decreaseBalance with appUserId ${appUserId}, walletType ${walletType}: ${ERROR}`);
        reject('failed');
      }
    } catch (e) {
      console.error(`error Wallet decreaseBalance`, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  increaseBalance,
  decreaseBalance,
};
