/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const GamePlayRecordsResource = require('./resourceAccess/GamePlayRecordsResourceAccess');
// const GameRecordResource = require('../GameRecord/resourceAccess/GameRecordResourceAccess');
const WalletResource = require('../Wallet/resourceAccess/WalletResourceAccess');
const PaymentBonusTransaction = require('../PaymentBonusTransaction/resourceAccess/PaymentBonusTransactionResourceAccess');
const { BONUS_TRX_STATUS } = require('../PaymentBonusTransaction/PaymentBonusTransactionConstant');
const AppUserView = require('../AppUsers/resourceAccess/AppUserView');
const AppUser = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
const { WALLET_TYPE } = require('../Wallet/WalletConstant');
// const { GAME_STATUS } = require('../GameRecord/GameRecordConstant');
const { BET_STATUS, BET_TYPE } = require('./GamePlayRecordsConstant');
const Logger = require('../../utils/logging');
const UtilFunctions = require('../ApiUtils/utilFunctions');
const AppUserMembership = require('../AppUserMembership/resourceAccess/AppUserMembershipResourceAccess');
const WalletRecordResourAccess = require('../WalletRecord/resourceAccess/WalletRecordResoureAccess');
const { WALLET_RECORD_TYPE } = require('../WalletRecord/WalletRecordConstant');
const { LEVER_MEMBERSHIP } = require('../AppUserMembership/AppUserMembershipConstant');
async function getCurrentBetSection(gameId, sectionName, betType) {
  let gameRecord = await GameRecordResource.findById(gameId);

  if (gameRecord) {
    try {
      let sectionList = [];
      if (betType === BET_TYPE.HALF) {
        sectionList = JSON.parse(gameRecord.gameRecordSections);
      } else {
        sectionList = JSON.parse(gameRecord.gameRecordHalfSections);
      }
      if (sectionList.length > 0) {
        for (let i = 0; i < sectionList.length; i++) {
          const _section = sectionList[i];
          if (_section.sectionName === sectionName) {
            return _section;
          }
        }
      }
    } catch (error) {
      Logger.error(`can not getCurrentBetSection ${gameId} - ${sectionName}`);
      return undefined;
    }
  }
  return undefined;
}

async function _placeNewBet(userId, betRecordAmountIn, gameId, sectionName, wallet, betType) {
  let _currentSection = await getCurrentBetSection(gameId, sectionName, betType);
  if (!_currentSection) {
    Logger.error(`can not _placeNewBet with empty _currentSection`);
    return undefined;
  }

  if (wallet.balance * 1 < betRecordAmountIn * 1) {
    Logger.error(`not enough balance to _placeNewBet`);
    return undefined;
  }
  let decrementResult = await WalletResource.decrementBalance(wallet.walletId, betRecordAmountIn);
  if (!decrementResult) {
    Logger.error(`failed to decrease balance when _placeNewBet`);
    return undefined;
  }

  let newBetData = {
    appUserId: userId,
    betRecordAmountIn: betRecordAmountIn,
    gameRecordId: gameId,
    walletId: wallet.walletId,
    betRecordType: betType,
  };

  if (betType === BET_TYPE.HALF) {
    newBetData.betRecordHalfSection = JSON.stringify(_currentSection);
  } else if (betType === BET_TYPE.FULL) {
    newBetData.betRecordSection = JSON.stringify(_currentSection);
  }

  let newBetResult = await GamePlayRecordsResource.insert(newBetData);

  if (!newBetResult) {
    Logger.error(`failed to _placeNewBet`);
  }

  return newBetResult;
}

async function placeUserBet(userId, betRecordAmountIn, gameId, sectionName, betType) {
  if (!userId || userId < 1) {
    console.error('null userid can not place bet');
    return undefined;
  }

  if (!gameId || gameId < 1) {
    console.error('null gameId can not place bet');
    return undefined;
  }

  if (!sectionName || sectionName === '') {
    console.error('null sectionName can not place bet');
    return undefined;
  }

  let wallet = await WalletResource.find(
    {
      appUserId: userId,
      walletType: WALLET_TYPE.POINT, //vi diem
    },
    0,
    1,
  );

  if (wallet && wallet.length > 0) {
    wallet = wallet[0];
  } else {
    Logger.error('can not find wallet to placeNewBet');
    return undefined;
  }

  return await _placeNewBet(userId, betRecordAmountIn, gameId, sectionName, wallet, betType);
}

function _matchGameSectionsWithBet(betRecordSection, gameSections) {
  const MATCHED = 1;
  const NOT_MATCHED = 0;
  for (let i = 0; i < gameSections.length; i++) {
    const _section = gameSections[i];
    if (_section.sectionName !== betRecordSection.sectionName) {
      return MATCHED;
    }
  }
  return NOT_MATCHED;
}

async function _addWiningPaymentForUser(appUserId, winAmount) {
  if (winAmount <= 0) {
    //chi tra tien hoa hong dua tren so tien thang duoc
    Logger.error(`invalid amount ${winAmount} to _addBonusPaymentForReferUser`);
    return;
  }

  let _pointWallet = await WalletResource.find({
    appUserId: appUserId,
    walletType: WALLET_TYPE.POINT,
  });
  if (_pointWallet && _pointWallet.length > 0) {
    _pointWallet = _pointWallet[0];
  } else {
    _pointWallet = undefined;
  }

  if (_pointWallet) {
    await WalletResource.incrementBalance(_pointWallet.walletId, winAmount);
  }
}

async function _addWiningBonusPaymentForUser(appUserId, bonusAmount) {
  if (bonusAmount <= 0) {
    //chi tra tien hoa hong dua tren so tien thang duoc
    Logger.error(`invalid amount ${bonusAmount} to _addWiningBonusPaymentForUser`);
    return;
  }

  let _currentBonusTransaction = await PaymentBonusTransaction.find(
    {
      appUserId: appUserId,
      paymentStatus: BONUS_TRX_STATUS.NEW,
    },
    0,
    1,
  );

  if (_currentBonusTransaction && _currentBonusTransaction.length > 0) {
    _currentBonusTransaction = _currentBonusTransaction[0];

    //update amount of payment
    await PaymentBonusTransaction.incrementPaymentAmount(_currentBonusTransaction.paymentBonusTransactionId, bonusAmount);
  }
}

//chi tra tien hoa hong dua tren so tien thang duoc
async function _addBonusPaymentForReferUser(appUserId, winAmount) {
  if (winAmount <= 0) {
    //chi tra tien hoa hong dua tren so tien thang duoc
    Logger.error(`invalid amount ${winAmount} to _addBonusPaymentForReferUser`);
    return;
  }

  let _currentUser = await AppUserView.find({ appUserId: appUserId }, 0, 1);
  if (_currentUser && _currentUser.length > 0) {
    _currentUser = _currentUser[0];
  } else {
    Logger.error(`invalid user ${appUserId} to _addBonusPaymentForReferUser`);
    return;
  }

  if (_currentUser.memberReferIdF1 && _currentUser.memberReferIdF1 !== null && _currentUser.memberReferIdF1 !== '') {
    const F1_BONUS_RATE = 0.08;
    _addWiningBonusPaymentForUser(_currentUser.memberReferIdF1, winAmount * F1_BONUS_RATE);
  }

  if (_currentUser.memberReferIdF2 && _currentUser.memberReferIdF2 !== null && _currentUser.memberReferIdF2 !== '') {
    const F2_BONUS_RATE = 0.05;
    _addWiningBonusPaymentForUser(_currentUser.memberReferIdF2, winAmount * F2_BONUS_RATE);
  }

  if (_currentUser.memberReferIdF3 && _currentUser.memberReferIdF3 !== null && _currentUser.memberReferIdF3 !== '') {
    const F3_BONUS_RATE = 0.03;
    _addWiningBonusPaymentForUser(_currentUser.memberReferIdF3, winAmount * F3_BONUS_RATE);
  }
}

//check bet record win or lose for betRecord
async function _checkWinLoseForBetByGame(betRecord, game) {
  if (!betRecord || betRecord === null) {
    console.error('null betRecord can not checkWinLoseForBetByGame');
    return undefined;
  }

  if (!game.gameRecordId || game.gameRecordId < 1) {
    console.error('null gameId can not checkWinLoseForBetByGame');
    return undefined;
  }

  if (
    (!game.gameRecordResult || game.gameRecordResult === null || game.gameRecordResult === '') &&
    (!game.gameRecordHalfResult || game.gameRecordHalfResult === null || game.gameRecordHalfResult === '')
  ) {
    console.error('null gameRecordResult and gameRecordHalfResult can not checkWinLoseForBetByGame');
    return undefined;
  }

  let _detailRecord = betRecord;
  if (!_detailRecord) {
    console.error(`can not find record by ID ${betRecordId} to checkWinLoseForBetByGame`);
    return undefined;
  }

  const WIN = 1;
  const LOSE = 0;
  let matchResult = LOSE;
  let _winAmount = 0;
  let _currentSection = undefined;

  try {
    if (_detailRecord.betRecordSection !== '' || _detailRecord.betRecordSection !== null) {
      _currentSection = JSON.parse(_detailRecord.betRecordSection);
    } else if (_detailRecord.betRecordHalfSection !== '' || _detailRecord.betRecordHalfSection !== null) {
      _currentSection = JSON.parse(_detailRecord.betRecordHalfSection);
    }

    matchResult = _matchGameSectionsWithBet(_currentSection, JSON.parse(game.gameRecordSections));
  } catch (error) {
    console.error(error);
    matchResult = LOSE;
  }

  if (_currentSection) {
    //thang thi lay theo ti le win, thua thi thua het
    if (matchResult === WIN) {
      _winAmount = (_detailRecord.betRecordAmountIn * _currentSection.sectionWinRate) / 100;
    } else {
      _winAmount = _detailRecord.betRecordAmountIn * -1;
    }
  }

  let _updatedRecord = await GamePlayRecordsResource.updateById(_detailRecord.betRecordId, {
    betRecordResult: matchResult ? WIN : LOSE,
    betRecordStatus: BET_STATUS.COMPLETED,
    betRecordAmountOut: _winAmount,
    betRecordWin: _winAmount,
  });

  //reward for user when record WIN
  if (matchResult === WIN) {
    //tang tien thuong cho user
    await _addWiningPaymentForUser(_detailRecord.appUserId, _winAmount);

    //tang hoa hong cho dai ly cac cap
    await _addBonusPaymentForReferUser(_detailRecord.appUserId, _winAmount);
  }

  if (_updatedRecord) {
    return matchResult;
  } else {
    return false; //always false neu ket qua bi loi
  }
}

//check bet record win or lose
async function checkWinLoseForAllBetByGame(gameRecordId) {
  if (!gameRecordId || gameRecordId < 1) {
    console.error(`null gameRecordId ID ${gameRecordId} can not checkWinLoseForAllBetByGame`);
    return undefined;
  }

  let game = await GameRecordResource.findById(gameRecordId);
  if (!game) {
    console.error(`null game ID ${gameRecordId} can not checkWinLoseForAllBetByGame`);
    return undefined;
  }

  if (!game.gameRecordStatus || game.gameRecordStatus === GAME_STATUS.COMPLETED) {
    console.error(`COMPLETED gameId ID ${gameRecordId} can not checkWinLoseForAllBetByGame`);
    return undefined;
  }

  let _countAllBetOfGame = await GamePlayRecordsResource.count({
    gameRecordId: game.gameRecordId,
  });
  _countAllBetOfGame = _countAllBetOfGame[0].count;

  for (let batchCounter = 0; batchCounter < _countAllBetOfGame; batchCounter++) {
    let batchGamePlayRecords = await GamePlayRecordsResource.find(
      {
        gameRecordId: game.gameRecordId,
        betRecordStatus: BET_STATUS.NEW,
      },
      batchCounter * 100,
      100,
    );
    let _promiseList = [];

    if (batchGamePlayRecords && batchGamePlayRecords.length > 0) {
      for (let recordCounter = 0; recordCounter < batchGamePlayRecords.length; recordCounter++) {
        const _record = batchGamePlayRecords[recordCounter];
        const promiseCheck = new Promise((resolve, reject) => {
          _checkWinLoseForBetByGame(_record, game).then(resultCheck => {
            resolve(resultCheck);
          });
        });
        _promiseList.push(promiseCheck);
      }
    } else {
      //break if there is no record
      break;
    }
    await UtilFunctions.executeAllPromise(_promiseList);
  }

  //update game status after check all record
  let _updatedRecord = await GameRecordResource.updateById(gameRecordId, {
    gameRecordStatus: GAME_STATUS.COMPLETED,
  });

  if (_updatedRecord) {
    return _updatedRecord;
  } else {
    return undefined;
  }
}

async function sumBetRecordBonusForUser(appUserId) {
  let totalBonus = await GamePlayRecordsResource.sum('betRecordAmountIn', {
    appUserId: appUserId,
    betRecordStatus: BET_STATUS.COMPLETED,
    betRecordPaymentBonusStatus: BET_STATUS.NEW,
  });

  if (totalBonus && totalBonus.length > 0) {
    return totalBonus[0].sumResult;
  } else {
    return 0;
  }
}

async function updateAllBonusPaymentStatusByUser(appUserId) {
  let updateResult = await GamePlayRecordsResource.updateAll(
    {
      betRecordPaymentBonusStatus: BET_STATUS.COMPLETED,
    },
    {
      appUserId: appUserId,
      betRecordPaymentBonusStatus: BET_STATUS.NEW,
    },
  );
  if (updateResult) {
    return updateResult;
  } else {
    return undefined;
  }
}
async function getCommissionRate(appUserId) {
  let result = await AppUser.findById(appUserId);
  // phần trăm hoa hồng
  if (result) {
    if (result.appUserMembershipId === LEVER_MEMBERSHIP.MEMBER) {
      return {
        appUserMembershipId: LEVER_MEMBERSHIP.MEMBER,
        F1: 0.1,
        F2: 0.08,
        F3: 0.05,
      };
    }
    if (result.appUserMembershipId === LEVER_MEMBERSHIP.BUSINESS) {
      return {
        appUserMembershipId: LEVER_MEMBERSHIP.BUSINESS,
        F1: 0.15,
        F2: 0.08,
        F3: 0.05,
      };
    }
    if (result.appUserMembershipId === LEVER_MEMBERSHIP.COMPANY) {
      return {
        appUserMembershipId: LEVER_MEMBERSHIP.COMPANY,
        F1: 0.2,
        F2: 0.08,
        F3: 0.05,
      };
    }
    if (result.appUserMembershipId === LEVER_MEMBERSHIP.ENTERPRISE) {
      return {
        appUserMembershipId: LEVER_MEMBERSHIP.ENTERPRISE,
        F1: 0.25,
        F2: 0.08,
        F3: 0.05,
      };
    }
    if (result.appUserMembershipId === LEVER_MEMBERSHIP.CORPORATION) {
      return {
        appUserMembershipId: LEVER_MEMBERSHIP.CORPORATION,
        F1: 0.3,
        F2: 0.08,
        F3: 0.05,
      };
    }
    if (result.appUserMembershipId === undefined || result.appUserMembershipId === null || result.appUserMembershipId === '') {
      return {
        F1: 0,
        F2: 0,
        F3: 0,
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

async function _payCommissionForUser(user, amount) {
  let wallet = await WalletResource.find({
    appUserId: user.appUserId,
    walletType: WALLET_TYPE.BTC,
  });

  if (!wallet || wallet.length < 1) {
    console.error('user wallet is invalid');
    return undefined;
  }
  wallet = wallet[0];
  let historyData = {
    appUserId: user.appUserId,
    walletId: wallet.walletId,
    paymentAmount: amount,
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance + amount,
    WalletRecordType: WALLET_RECORD_TYPE.REFER_BONUS,
  };
  let resultIncrement = await WalletResource.incrementBalance(wallet.walletId, amount);
  if (resultIncrement) {
    let result = await WalletRecordResourAccess.insert(historyData);
    if (result) {
      return result;
    } else {
      console.error('insert deposit transaction error');
      return undefined;
    }
  } else {
    console.error('increment error');
    return undefined;
  }
}

async function payCommissionForReferalByUserId(appUserId, amount) {
  return new Promise(async (resolve, reject) => {
    try {
      let resultUser = await AppUser.findById(appUserId);
      if (resultUser) {
        if (resultUser.memberReferIdF1 !== null) {
          let apppUserIdF1 = resultUser.memberReferIdF1;
          let result = await getCommissionRate(apppUserIdF1);
          if (result) {
            let amountF1 = amount * result.F1;
            let resultBonus = await _payCommissionForUser(apppUserIdF1, amountF1);
            if (!resultBonus) {
              reject('Bonus FAC F1 failed');
            }
          } else {
            reject('Can not get commission rate');
          }
        }
        if (resultUser.memberReferIdF2 !== null) {
          let apppUserIdF2 = resultUser.memberReferIdF2;
          let result = await getCommissionRate(apppUserIdF2);
          if (result) {
            let amountF2 = amount * result.F2;
            let resultBonus = await _payCommissionForUser(apppUserIdF2, amountF2);
            if (!resultBonus) {
              reject('Bonus FAC F2 failed');
            }
          } else {
            reject('Can not get commission rate');
          }
        }
        if (resultUser.memberReferIdF3 !== null) {
          let apppUserIdF3 = resultUser.memberReferIdF3;
          let result = await getCommissionRate(apppUserIdF3);
          if (result) {
            let amountF3 = amount * result.F3;
            let resultBonus = await _payCommissionForUser(apppUserIdF3, amountF3);
            if (!resultBonus) {
              reject('Bonus FAC F2 failed');
            }
          } else {
            reject('Can not get commission rate');
          }
        }
        resolve('DONE');
      } else {
        reject('User not found');
      }
    } catch (e) {
      console.error(e);
      reject('failed');
    }
  });
}

module.exports = {
  placeUserBet,
  getCurrentBetSection,
  checkWinLoseForAllBetByGame,
  sumBetRecordBonusForUser,
  updateAllBonusPaymentStatusByUser,
  payCommissionForReferalByUserId,
  getCommissionRate,
};
