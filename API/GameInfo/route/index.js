/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const GameInfoRoute = require('./GameInfoRoute');
const GameInfoRoute_User = require('./GameInfoRoute_User');

module.exports = [
  //Payment Deposit  APIs
  { method: 'POST', path: '/GameInfo/insert', config: GameInfoRoute.insert },
  { method: 'POST', path: '/GameInfo/find', config: GameInfoRoute.find },
  { method: 'POST', path: '/GameInfo/updateById', config: GameInfoRoute.updateById },
  { method: 'POST', path: '/GameInfo/findById', config: GameInfoRoute.findById },
  // { method: 'POST', path: '/GameInfo/deleteById', config: GameInfoRoute.deleteById },

  // { method: 'POST', path: '/GameInfo/getCurrentGameInfo', config: GameInfoRoute.getCurrentGameInfo },

  { method: 'POST', path: '/GameInfo/user/getList', config: GameInfoRoute_User.getList },
  // { method: 'POST', path: '/GameInfo/user/getCurrent', config: GameInfoRoute_User.userGetCurrentGameInfo },
  // { method: 'POST', path: '/GameInfo/user/getLast', config: GameInfoRoute_User.userGetLatestGameInfo },
];
