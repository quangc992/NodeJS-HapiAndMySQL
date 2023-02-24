/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const MaintainFunctions = require('../MaintainFunctions');

async function maintainAll(req) {
  return new Promise(async (resolve, reject) => {
    try {
      MaintainFunctions.maintainAll(req.payload.status);
      resolve('success');
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function maintainDeposit(req) {
  return new Promise(async (resolve, reject) => {
    try {
      MaintainFunctions.maintainDeposit(req.payload.status);
      resolve('success');
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function maintainLiveGame(req) {
  return new Promise(async (resolve, reject) => {
    try {
      MaintainFunctions.maintainLiveGame(req.payload.status);
      resolve('success');
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function maintainTransfer(req) {
  return new Promise(async (resolve, reject) => {
    try {
      MaintainFunctions.maintainTransfer(req.payload.status);
      resolve('success');
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function maintainWithdraw(req) {
  return new Promise(async (resolve, reject) => {
    try {
      MaintainFunctions.maintainWithdraw(req.payload.status);
      resolve('success');
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function maintainSignup(req) {
  return new Promise(async (resolve, reject) => {
    try {
      MaintainFunctions.maintainSignup(req.payload.status);
      resolve('success');
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

async function getSystemStatus(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(MaintainFunctions.systemStatus);
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

module.exports = {
  maintainAll,
  maintainDeposit,
  maintainLiveGame,
  maintainTransfer,
  maintainWithdraw,
  maintainSignup,
  getSystemStatus,
};
