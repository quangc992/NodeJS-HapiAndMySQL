/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const GamePlayRecords = require('./GamePlayRecordsRoute');

module.exports = [
  //GamePlayRecords APIs
  // { method: 'POST', path: '/GamePlayRecords/insert', config: GamePlayRecords.insert },
  { method: 'POST', path: '/GamePlayRecords/find', config: GamePlayRecords.find },
  // { method: 'POST', path: '/GamePlayRecords/updateById', config: GamePlayRecords.updateById },
  // { method: 'POST', path: '/GamePlayRecords/deleteById', config: GamePlayRecords.deleteById },
  { method: 'POST', path: '/GamePlayRecords/user/placeRecord', config: GamePlayRecords.userPlaceBetRecord },
  { method: 'POST', path: '/GamePlayRecords/user/getList', config: GamePlayRecords.getList },
  // { method: 'POST', path: '/GamePlayRecords/user/sumaryWinLoseAmount', config: GamePlayRecords.userSumaryWinLoseAmount },
  // { method: 'POST', path: '/GamePlayRecords/user/publicFeeds', config: GamePlayRecords.getListPublicFeeds },
];
