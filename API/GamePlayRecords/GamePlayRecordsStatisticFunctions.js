/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const GamePlayRecordsResource = require('./resourceAccess/GamePlayRecordsResourceAccess');

async function sumTotalUserBetAmountByDate(appUserId, startDate, endDate) {
  let _totalBetAmount = 0;
  let sumResult = await GamePlayRecordsResource.customSum(
    'betRecordAmountIn',
    {
      appUserId: appUserId,
    },
    startDate,
    endDate,
  );
  if (sumResult && sumResult.length > 0) {
    _totalBetAmount = sumResult[0].sumResult;
  }

  return _totalBetAmount;
}

async function sumTotalUserSystemBetAmountByDate(appUserId, startDate, endDate) {
  let _totalBetAmount = 0;
  let sumResult = await GamePlayRecordsResource.customSumReferedUserByUserId(appUserId, 'betRecordAmountIn', {}, startDate, endDate);
  if (sumResult && sumResult.length > 0) {
    _totalBetAmount = sumResult[0].sumResult;
  }

  return _totalBetAmount;
}

module.exports = {
  sumTotalUserBetAmountByDate,
  sumTotalUserSystemBetAmountByDate,
};
