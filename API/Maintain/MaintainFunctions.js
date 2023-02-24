/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const Logger = require('../../utils/logging');

let systemStatus = {
  all: true,
  liveGame: true,
  deposit: true,
  transfer: true,
  withdraw: true,
  signup: true,
  maintainMessage: 'Vui lòng liên hệ admin để được hỗ trợ',
};

//Maintain button for		ALL WEB
async function maintainAll(enable) {
  Logger.info('Maintain', systemStatus);
  if (enable === true) {
    systemStatus.all = true;
  } else {
    systemStatus.all = false;
  }
}

//Maintain button for		Live Game
async function maintainLiveGame(enable) {
  if (enable === true) {
    systemStatus.liveGame = true;
  } else {
    systemStatus.liveGame = false;
  }
  Logger.info('Maintain', systemStatus);
}

//Maintain button for		Deposit
async function maintainDeposit(enable) {
  if (enable === true) {
    systemStatus.deposit = true;
  } else {
    systemStatus.deposit = false;
  }
  Logger.info('Maintain', systemStatus);
}

//Maintain button for		Transfer Deposit / Withdraw
async function maintainTransfer(enable) {
  if (enable === true) {
    systemStatus.transfer = true;
  } else {
    systemStatus.transfer = false;
  }
  Logger.info('Maintain', systemStatus);
}

//Maintain button for		Withdraw
async function maintainWithdraw(enable) {
  if (enable === true) {
    systemStatus.withdraw = true;
  } else {
    systemStatus.withdraw = false;
  }
  Logger.info('Maintain', systemStatus);
}

//Maintain button for		Signup New USER
async function maintainSignup(enable) {
  if (enable === true) {
    systemStatus.signup = true;
  } else {
    systemStatus.signup = false;
  }
  Logger.info('Maintain', systemStatus);
}

async function maintainWarningMessage(message) {
  systemStatus.maintainMessage = message;
}

module.exports = {
  maintainAll,
  maintainDeposit,
  maintainLiveGame,
  maintainTransfer,
  maintainWithdraw,
  maintainSignup,
  maintainWarningMessage,
  systemStatus: systemStatus,
};
