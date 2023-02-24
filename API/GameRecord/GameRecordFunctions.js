/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const GameRecordsResourceAccess = require('./resourceAccess/GameRecordsResourceAccess');
const GamePlayRecordsResource = require('../GamePlayRecords/resourceAccess/GamePlayRecordsResourceAccess');
const utilFunctions = require('../ApiUtils/utilFunctions');
const ProductResourceAccess = require('../Product/resourceAccess/ProductResourceAccess');
const { GAME_RECORD_STATUS, GAME_RATIO, GAME_RECORD_TYPE, GAME_RESULT } = require('./GameRecordConstant');
const moment = require('moment');
const { BET_STATUS } = require('../GamePlayRecords/GamePlayRecordsConstant');
const { WALLET_TYPE } = require('../Wallet/WalletConstant');
const UserWallet = require('../Wallet/resourceAccess/WalletResourceAccess');
const CustomerMessageFunctions = require('../CustomerMessage/CustomerMessageFunctions');
function generateGameRecordValue(charCount, minValue = 0, maxValue = 9) {
  let _randomValue = '';
  for (let i = 0; i < charCount; i++) {
    _randomValue += utilFunctions.randomIntByMinMax(minValue, maxValue);
  }
  return _randomValue;
}

async function addNewGameRecord(gameRecordSection, gameRecordType, gameRecordValue, staff) {
  let existedGameRecord = await GameRecordsResourceAccess.find({
    gameRecordSection: gameRecordSection,
    gameRecordType: gameRecordType,
  });

  //if it was predefined by admin, then update status to display it
  if (existedGameRecord && existedGameRecord.length > 0) {
    existedGameRecord = existedGameRecord[0];
    return existedGameRecord;
  }

  //else add new records
  let newRecordData = {
    gameRecordSection: gameRecordSection,
    gameRecordType: gameRecordType,
  };

  if (staff) {
    newRecordData.gameRecordNote = 'Admin tạo ' + moment().format('HH:mm:ss');
  } else {
    newRecordData.gameRecordNote = 'Auto tạo ' + moment().format('HH:mm:ss');
  }

  //neu admin dien ket qua truoc thi luu ket qua lai
  if (gameRecordValue) {
    newRecordData.gameRecordValue = gameRecordValue;
  }

  console.info(`addNewGameRecord: ${gameRecordType} - ${gameRecordSection} - ${gameRecordValue}`);
  let newRecord = await GameRecordsResourceAccess.insert(newRecordData);
  return newRecord;
}

function checkGameRecordResult(price) {
  let priceString = price + '';
  let lastValue = priceString[priceString.length - 1];
  let betUp = 0;
  let betDown = 0;
  let betOdd = 0;
  let betEven = 0;
  if (lastValue * 1 < 5) {
    betDown = 1;
  } else {
    betUp = 1;
  }

  if (lastValue % 2 === 0) {
    betEven = 1;
  } else {
    betOdd = 1;
  }

  let result = {
    gameRecordTypeUp: betUp,
    gameRecordTypeDown: betDown,
    gameRecordTypeOdd: betOdd,
    gameRecordTypeEven: betEven,
  };
  return result;
}

function _detectBatchResult(existedGameRecord, existedBetRecord) {
  let _gameRecordValue = existedGameRecord.gameRecordValue;
  let result = [];
  let gameValues = _gameRecordValue.split(';');
  const betRecordValue = existedBetRecord.betRecordValue;
  const existedBetRecordNum2 = betRecordValue.slice(betRecordValue.length - 2);
  const existedBetRecordNum3 = betRecordValue.slice(betRecordValue.length - 3);
  const existedBetRecordNum4 = betRecordValue.slice(betRecordValue.length - 4);
  const existedBetRecordNum5 = betRecordValue.slice(betRecordValue.length - 5);

  if (gameValues.includes(existedBetRecordNum2)) {
    // giải 8 gồm 2 số trùng nhau
    result.push(GAME_RESULT.G8);
  }

  if (gameValues.includes(existedBetRecordNum3)) {
    // giải 7 gồm 3 số trùng nhau
    result.push(GAME_RESULT.G7);
  }

  if (gameValues[2] === existedBetRecordNum4 || gameValues[3] === existedBetRecordNum4 || gameValues[4] === existedBetRecordNum4) {
    result.push(GAME_RESULT.G6); // giải 6 gồm 4 số trùng nhau
  }

  if (gameValues[5] === existedBetRecordNum4) {
    result.push(GAME_RESULT.G5); // giải 5 gồm 4 số trùng nhau
  }

  if (
    gameValues[6] === existedBetRecordNum5 ||
    gameValues[7] === existedBetRecordNum5 ||
    gameValues[8] === existedBetRecordNum5 ||
    gameValues[9] === existedBetRecordNum5 ||
    gameValues[10] === existedBetRecordNum5 ||
    gameValues[11] === existedBetRecordNum5 ||
    gameValues[12] === existedBetRecordNum5
  ) {
    // giải 4 gồm 5 số trùng nhau
    result.push(GAME_RESULT.G4);
  }

  if (gameValues[13] === existedBetRecordNum5 || gameValues[14] === existedBetRecordNum5) {
    // giải 3 gồm 5 số trùng nhau
    result.push(GAME_RESULT.G3);
  }

  if (gameValues[15] === existedBetRecordNum5) {
    result.push(GAME_RESULT.G2); // giải 2 gồm 5 số trùng nhau
  }

  if (gameValues[16] === existedBetRecordNum5) {
    result.push(GAME_RESULT.G1); // giải 1 gồm 5 số trùng nhau
  }

  const gameValuesNum5 = gameValues[17].slice(gameValues[17].length - 5);
  if (gameValuesNum5 === existedBetRecordNum5) {
    // nêú giống giốngg5 số cuối của vé cặp là
    result.push(GAME_RESULT.GDB); // có 11 vé trúng giải đăc biệt
    result.push(GAME_RESULT.GPDB); // có 99 vé trúng giải phụ đặc biệt
  }

  let count = 0;
  for (let i = 0; i < existedBetRecordNum5.length; i++) {
    // so sách xem số ở mỗi hàng có bằng nhau không VD 1234 và 1235 (1 vs 1, 2 vs 2, 3 vs 3, 4 vs 5)
    if (existedBetRecordNum5[i] === gameValuesNum5[i]) {
      count++;
    }
  }

  // nếu sai một số trong 5 số cuối của giải đặc biệt thì trúng giải khuyến khích
  if (count === 4) {
    result.push(GAME_RESULT.GKK);
  }

  let pointWin = 0;
  if (result.includes(GAME_RESULT.G8)) {
    pointWin = pointWin + 100000 * 110;
  }

  if (result.includes(GAME_RESULT.G7)) {
    pointWin = pointWin + 200000 * 110;
  }

  if (result.includes(GAME_RESULT.G6)) {
    pointWin = pointWin + 400000 * 110;
  }

  if (result.includes(GAME_RESULT.G5)) {
    pointWin = pointWin + 1000000 * 110;
  }

  if (result.includes(GAME_RESULT.G4)) {
    pointWin = pointWin + 3000000 * 110;
  }

  if (result.includes(GAME_RESULT.G3)) {
    pointWin = pointWin + 10000000 * 110;
  }

  if (result.includes(GAME_RESULT.G2)) {
    pointWin = pointWin + 15000000 * 110;
  }

  if (result.includes(GAME_RESULT.G1)) {
    pointWin = pointWin + 30000000 * 110;
  }

  if (result.includes(GAME_RESULT.GDB)) {
    pointWin = pointWin + 2500000000 * 11;
  }

  if (result.includes(GAME_RESULT.GPDB)) {
    pointWin = pointWin + 50000000 * 99;
  }

  if (result.includes(GAME_RESULT.GKK)) {
    pointWin = pointWin + 6000000 * 11;
  }

  return { pointWin, result };
}

function _detectSingleResult(existedGameRecord, existedBetRecord) {
  let _gameRecordValue = existedGameRecord.gameRecordValue;
  let result = [];
  let gameValues = _gameRecordValue.split(';');
  const betRecordValue = existedBetRecord.betRecordValue;
  const betRecordQuantity = existedBetRecord.betRecordQuantity;
  const existedBetRecordNum2 = betRecordValue.slice(betRecordValue.length - 2);
  const existedBetRecordNum3 = betRecordValue.slice(betRecordValue.length - 3);
  const existedBetRecordNum4 = betRecordValue.slice(betRecordValue.length - 4);
  const existedBetRecordNum5 = betRecordValue.slice(betRecordValue.length - 5);

  if (gameValues.includes(existedBetRecordNum2)) {
    // giải 8 gồm 2 số trùng nhau
    result.push(GAME_RESULT.G8);
  }

  if (gameValues.includes(existedBetRecordNum3)) {
    // giải 7 gồm 3 số trùng nhau
    result.push(GAME_RESULT.G7);
  }

  if (gameValues[2] === existedBetRecordNum4 || gameValues[3] === existedBetRecordNum4 || gameValues[4] === existedBetRecordNum4) {
    result.push(GAME_RESULT.G6); // giải 6 gồm 4 số trùng nhau
  }

  if (gameValues[5] === existedBetRecordNum4) {
    result.push(GAME_RESULT.G5); // giải 5 gồm 4 số trùng nhau
  }

  if (
    gameValues[6] === existedBetRecordNum5 ||
    gameValues[7] === existedBetRecordNum5 ||
    gameValues[8] === existedBetRecordNum5 ||
    gameValues[9] === existedBetRecordNum5 ||
    gameValues[10] === existedBetRecordNum5 ||
    gameValues[11] === existedBetRecordNum5 ||
    gameValues[12] === existedBetRecordNum5
  ) {
    // giải 4 gồm 5 số trùng nhau
    result.push(GAME_RESULT.G4);
  }

  if (gameValues[13] === existedBetRecordNum5 || gameValues[14] === existedBetRecordNum5) {
    // giải 3 gồm 5 số trùng nhau
    result.push(GAME_RESULT.G3);
  }

  if (gameValues[15] === existedBetRecordNum5) {
    result.push(GAME_RESULT.G2); // giải 2 gồm 5 số trùng nhau
  }

  if (gameValues[16] === existedBetRecordNum5) {
    result.push(GAME_RESULT.G1); // giải 1 gồm 5 số trùng nhau
  }

  if (gameValues[17] === betRecordValue) {
    result.push(GAME_RESULT.GDB); // giải đặc biệt là phải giống hết
  }

  const gameValuesNum5 = gameValues[17].slice(gameValues[17].length - 5);
  if (gameValuesNum5 === existedBetRecordNum5 && !result.includes(GAME_RESULT.GDB)) {
    // giải phụ đặc biệt là phải giống5 số cuối với giải đặc biệt
    result.push(GAME_RESULT.GPDB); // và không trúng giải đặc biệt
  }

  let count = 0;
  for (let i = 0; i < existedBetRecordNum5.length; i++) {
    // so sách xem số ở mỗi hàng có bằng nhau không VD 1234 và 1235 (1 vs 1, 2 vs 2, 3 vs 3, 4 vs 5)
    if (existedBetRecordNum5[i] === gameValuesNum5[i]) {
      count++;
    }
  }

  // nếu sai một số trong 5 số cuối của giải đặc biệt thì trúng giải khuyến khích
  if (count === 4) {
    result.push(GAME_RESULT.GKK);
  }

  let pointWin = 0;
  if (result.includes(GAME_RESULT.G8)) {
    pointWin = pointWin + 100000;
  }

  if (result.includes(GAME_RESULT.G7)) {
    pointWin = pointWin + 200000;
  }

  if (result.includes(GAME_RESULT.G6)) {
    pointWin = pointWin + 400000;
  }

  if (result.includes(GAME_RESULT.G5)) {
    pointWin = pointWin + 1000000;
  }

  if (result.includes(GAME_RESULT.G4)) {
    pointWin = pointWin + 3000000;
  }

  if (result.includes(GAME_RESULT.G3)) {
    pointWin = pointWin + 10000000;
  }

  if (result.includes(GAME_RESULT.G2)) {
    pointWin = pointWin + 15000000;
  }

  if (result.includes(GAME_RESULT.G1)) {
    pointWin = pointWin + 30000000;
  }

  if (result.includes(GAME_RESULT.GDB)) {
    pointWin = pointWin + 2500000000;
  }

  if (result.includes(GAME_RESULT.GPDB)) {
    pointWin = pointWin + 50000000;
  }

  if (result.includes(GAME_RESULT.GKK)) {
    pointWin = pointWin + 6000000;
  }

  pointWin = pointWin * betRecordQuantity;

  return { pointWin, result };
}

async function completeGameRecord(gameRecordSection, gameRecordType) {
  console.info(`completeGameRecord ${gameRecordSection} ${gameRecordType}`);

  let existedGameRecord = await GameRecordsResourceAccess.find({
    gameRecordSection: gameRecordSection,
    gameRecordType: gameRecordType,
  });

  if (existedGameRecord && existedGameRecord.length > 0) {
    existedGameRecord = existedGameRecord[0];

    let updateRecordData = {
      gameRecordStatus: GAME_RECORD_STATUS.COMPLETED,
    };
    GameRecordsResourceAccess.updateById(existedGameRecord.gameRecordId, updateRecordData);
  } else {
    console.error(`can not find game to complete ${gameRecordSection} ${gameRecordType}`);
  }

  let existedGamePlayRecords = await GamePlayRecordsResource.find({
    betRecordSection: gameRecordSection,
  });

  //if it was predefined by admin, then update status to display it
  let result;
  let pointWin = 0;
  if (existedGamePlayRecords && existedGamePlayRecords.length > 0) {
    for (let i = 0; i < existedGamePlayRecords.length; i++) {
      //kiem tra ket qua vé đơn
      const betRecordType = existedGamePlayRecords[i].betRecordType;
      if (betRecordType === GAME_RECORD_TYPE.SINGLE) {
        result = _detectSingleResult(existedGameRecord, existedGamePlayRecords[i]);
      } else if (betRecordType === GAME_RECORD_TYPE.BATCH) {
        // kiem tra ket qua vé cặp
        result = _detectBatchResult(existedGameRecord, existedGamePlayRecords[i]);
      }
      //cap nhat ket qua vao csdl
      pointWin = result.pointWin;
      let updateBetRecordData = {
        betRecordStatus: BET_STATUS.COMPLETED,
        betRecordWin: pointWin ? pointWin : 0,
      };

      let updateProductData = {
        productCategory: `${result.result}`,
      };

      await GamePlayRecordsResource.updateById(existedGamePlayRecords[i].betRecordId, updateBetRecordData);
      await ProductResourceAccess.updateById(existedGamePlayRecords[i].productId, updateProductData);

      if (pointWin && pointWin > 0) {
        let result = await rewardToWinner(existedGamePlayRecords[i].appUserId, pointWin);
        if (result) {
          let notifiTitle = 'Trúng thưởng xổ số';
          let notifiContent = `Chúc mừng bạn đã trưởng thưởng xổ số ${pointWin} đồng. Thông tin vé: đài ${gameRecordType} loại vé ${existedGamePlayRecords.betRecordType} với số vé ${existedGamePlayRecords.betRecordValue}`;
          await CustomerMessageFunctions.sendNotificationUser(appUserId, notifiTitle, notifiContent);
        }
      }
    }
  }
}

async function rewardToWinner(appUserId, betRecordWin) {
  const WalletRecordFunction = require('../WalletRecord/WalletRecordFunction');
  //tra thuong cho user
  WalletRecordFunction.increasePointBalance(appUserId, betRecordWin);
}

async function getCurrentGameRecord(gameRecordType) {
  let filter = {
    gameRecordType: gameRecordType,
  };
  let skip = 0;
  let limit = 1;
  let order = {
    key: 'gameRecordSection',
    value: 'asc',
  };

  filter.gameRecordStatus = GAME_RECORD_STATUS.NEW;

  let gameRecords = await GameRecordsResourceAccess.find(filter, skip, limit, order);
  if (gameRecords && gameRecords.length > 0) {
    return gameRecords[0];
  } else {
    return undefined;
  }
}

async function getLatestGameRecord(gameRecordType) {
  let filter = {
    gameRecordType: gameRecordType,
  };
  let skip = 0;
  let limit = 1;
  let order = {
    key: 'gameRecordSection',
    value: 'desc',
  };

  filter.gameRecordStatus = GAME_RECORD_STATUS.COMPLETED;

  let gameRecords = await GameRecordsResourceAccess.find(filter, skip, limit, order);
  if (gameRecords && gameRecords.length > 0) {
    return gameRecords[0];
  } else {
    return undefined;
  }
}

async function completeAllPendingGameRecord() {
  let currentSection = moment().format('YYYYMMDD');

  let existedGameRecord = await GameRecordsResourceAccess.find({
    gameRecordStatus: GAME_RECORD_STATUS.NEW,
  });
  for (let i = 0; i < existedGameRecord.length; i++) {
    const _record = existedGameRecord[i];
    //neu ky da qua thoi gian thi se tu dong complete
    await completeGameRecord(_record.gameRecordSection, _record.gameRecordType);
  }
}

module.exports = {
  addNewGameRecord,
  completeGameRecord,
  generateGameRecordValue,
  checkGameRecordResult,
  getCurrentGameRecord,
  getLatestGameRecord,
  completeAllPendingGameRecord,
  _detectBatchResult,
  _detectSingleResult,
};
