/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const BetRecords = require('./BetRecordsRoute');

module.exports = [
  //BetRecords APIs
  // { method: 'POST', path: '/BetRecords/insert', config: BetRecords.insert },
  { method: 'POST', path: '/BetRecords/find', config: BetRecords.find },
  // { method: 'POST', path: '/BetRecords/updateById', config: BetRecords.updateById },
  // { method: 'POST', path: '/BetRecords/deleteById', config: BetRecords.deleteById },
  { method: 'POST', path: '/BetRecords/user/placeRecord', config: BetRecords.userPlaceBetRecord },
  { method: 'POST', path: '/BetRecords/user/getList', config: BetRecords.getList },
  // { method: 'POST', path: '/BetRecords/user/sumaryWinLoseAmount', config: BetRecords.userSumaryWinLoseAmount },
  // { method: 'POST', path: '/BetRecords/user/publicFeeds', config: BetRecords.getListPublicFeeds },
];
