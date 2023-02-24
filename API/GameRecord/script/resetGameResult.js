/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const GameRecordsResourceAccess = require('../resourceAccess/GameRecordsResourceAccess');

async function resetDailyGame() {
  GameRecordsResourceAccess.initDB();
}

module.exports = {
  resetDailyGame,
};
