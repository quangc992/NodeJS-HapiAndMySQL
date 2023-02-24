/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const GameFunctions = require('../GameFunctions');
const { GAME_RECORD_STATUS } = require('../GameRecordsConstant');
const { BET_UNIT, BET_TYPE, BET_STATUS } = require('../../GamePlayRecords/GamePlayRecordsConstant');
const BetRecordFunction = require('../../GamePlayRecords/GamePlayRecordsFunctions');
const BetRecordResource = require('../../GamePlayRecords/resourceAccess/GamePlayRecordsResourceAccess');
const GameRecordsResourceAccess = require('../resourceAccess/GameRecordsResourceAccess');
// const CryptoFunction = require('../../CryptoCurrency/CryptoCurrencyFunctions');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//make random price with variant 0.1%
function makeRandomPrice(currentPrice) {
  let price = currentPrice * 10000;
  let onePercent = (price * 0.1) / 100;
  let newPrice = ((price + getRandomInt(onePercent)) / 10000).toFixed(4);
  return newPrice;
}

async function checkBetRecordResult(gameRecord) {}

let UpOddIdx = 0;
let UpEvenIdx = 0;
let DownOddIdx = 0;
let DownEvenIdx = 0;
function autoBalancePrice(price, betUp, betDown, betOdd, betEven) {
  let balancePrice = price + '';

  let balancePriceArr = balancePrice.split('');
  balancePriceArr.pop();

  if (betUp && betOdd) {
    if (UpOddIdx === 0) {
      balancePriceArr.push('5');
    } else if (UpOddIdx === 1) {
      balancePriceArr.push('7');
    } else if (UpOddIdx === 2) {
      balancePriceArr.push('9');
    }
    UpOddIdx++;
    if (UpOddIdx > 2) {
      UpOddIdx = 0;
    }
  } else if (betUp && betEven) {
    if (UpEvenIdx === 0) {
      balancePriceArr.push('6');
    } else if (UpEvenIdx === 1) {
      balancePriceArr.push('8');
    } else if (UpEvenIdx === 2) {
      balancePriceArr.push('6');
    }
    UpEvenIdx++;
    if (UpEvenIdx > 2) {
      UpEvenIdx = 0;
    }
  } else if (betDown && betOdd) {
    if (DownOddIdx === 0) {
      balancePriceArr.push('1');
    } else if (DownOddIdx === 1) {
      balancePriceArr.push('3');
    } else if (DownOddIdx === 2) {
      balancePriceArr.push('1');
    }
    DownOddIdx++;
    if (DownOddIdx > 2) {
      DownOddIdx = 0;
    }
  } else if (betDown && betEven) {
    if (DownEvenIdx === 0) {
      balancePriceArr.push('0');
    } else if (DownEvenIdx === 1) {
      balancePriceArr.push('2');
    } else if (DownEvenIdx === 2) {
      balancePriceArr.push('4');
    }
    DownEvenIdx++;
    if (DownEvenIdx > 2) {
      DownEvenIdx = 0;
    }
  }

  balancePrice = balancePriceArr.join('');

  return (balancePrice * 1).toFixed(4);
}

async function makeAutoWinPrice(gameRecordPrice, gameRecordSection, gameRecordUnit) {
  let autoWinPrice = gameRecordPrice;

  let upTotal = await BetRecordResource.sum('betRecordAmountIn', {
    betRecordType: 'BetUp',
    betRecordSection: gameRecordSection,
    betRecordUnit: gameRecordUnit,
    betRecordStatus: BET_STATUS.NEW,
  });
  if (upTotal && upTotal.length > 0) {
    upTotal = upTotal[0].sumResult;
  }

  let downTotal = await BetRecordResource.sum('betRecordAmountIn', {
    betRecordType: 'BetDown',
    betRecordSection: gameRecordSection,
    betRecordUnit: gameRecordUnit,
    betRecordStatus: BET_STATUS.NEW,
  });
  if (downTotal && downTotal.length > 0) {
    downTotal = downTotal[0].sumResult;
  }

  let oddTotal = await BetRecordResource.sum('betRecordAmountIn', {
    betRecordType: 'BetOdd',
    betRecordSection: gameRecordSection,
    betRecordUnit: gameRecordUnit,
    betRecordStatus: BET_STATUS.NEW,
  });
  if (oddTotal && oddTotal.length > 0) {
    oddTotal = oddTotal[0].sumResult;
  }

  let evenTotal = await BetRecordResource.sum('betRecordAmountIn', {
    betRecordType: 'BetEven',
    betRecordSection: gameRecordSection,
    betRecordUnit: gameRecordUnit,
    betRecordStatus: BET_STATUS.NEW,
  });
  if (evenTotal && evenTotal.length > 0) {
    evenTotal = evenTotal[0].sumResult;
  }

  //if they are equal, then random choose 1 result
  if (upTotal === downTotal) {
    upTotal = makeRandomPrice(autoWinPrice);
    downTotal = makeRandomPrice(autoWinPrice);
  }

  //if they are equal, then random choose 1 result
  if (oddTotal === evenTotal) {
    oddTotal = makeRandomPrice(autoWinPrice);
    evenTotal = makeRandomPrice(autoWinPrice);
  }

  autoWinPrice = autoBalancePrice(autoWinPrice, upTotal < downTotal, downTotal < upTotal, oddTotal < evenTotal, evenTotal < oddTotal);

  return (autoWinPrice * 1).toFixed(4);
}

async function addNewGameResult(gameRecordType) {
  console.info(`addNewGameResult ${gameRecordType}`);
  if (SystemStatus.liveGame === false) {
    console.info(`--------GAME STOP----- ${new Date()}`);
    return;
  }

  //get latest Game Section
  const moment = require('moment');
  let currentTime = new Date();
  let gameRecordSection = moment(currentTime).format('YYYYMMDDHHmm');

  let existedRecord = await GameRecordsResourceAccess.find({
    gameRecordSection: gameRecordSection,
    gameRecordType: gameRecordType,
  });

  //if it was predefined by admin, then update status to display it
  if (existedRecord && existedRecord.length > 0) {
    return;
  } else {
    let newRecordData = {
      gameRecordSection: gameRecordSection,
      gameRecordType: gameRecordType.gameRecordTypeUp,
      gameRecordStatus: GAME_RECORD_STATUS.NEW,
      gameRecordNote: 'Auto tạo',
    };
    let newRecord = await GameRecordsResourceAccess.insert(newRecordData);
    return newRecord;
  }
}

module.exports = {
  addNewGameResult,
};
