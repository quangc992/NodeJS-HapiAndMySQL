/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const GameRecordRoute = require('./GameRecordRoute');
const GameRecordRoute_User = require('./GameRecordRoute_User');

module.exports = [
  //Payment Deposit  APIs
  { method: 'POST', path: '/GameRecord/insert', config: GameRecordRoute.insert },
  { method: 'POST', path: '/GameRecord/find', config: GameRecordRoute.find },
  { method: 'POST', path: '/GameRecord/updateById', config: GameRecordRoute.updateById },
  { method: 'POST', path: '/GameRecord/findById', config: GameRecordRoute.findById },
  // { method: 'POST', path: '/GameRecord/deleteById', config: GameRecordRoute.deleteById },

  // { method: 'POST', path: '/GameRecord/getCurrentGameRecord', config: GameRecordRoute.getCurrentGameRecord },

  { method: 'POST', path: '/GameRecord/user/getList', config: GameRecordRoute_User.getList },
  // { method: 'POST', path: '/GameRecord/user/getCurrent', config: GameRecordRoute_User.userGetCurrentGameRecord },
  // { method: 'POST', path: '/GameRecord/user/getLast', config: GameRecordRoute_User.userGetLatestGameRecord },
];
