/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const LeaderBoardRouter = require('./LeaderBoardRouter');

module.exports = [
  // { method: 'POST', path: '/LeaderBoard/insert', config: LeaderBoardRouter.insert },
  {
    method: 'POST',
    path: '/LeaderBoard/user/getTopRank',
    config: LeaderBoardRouter.userGetTopRank,
  },
  {
    method: 'POST',
    path: '/LeaderBoard/admin/updateRanking',
    config: LeaderBoardRouter.updateRanKing,
  },
  {
    method: 'POST',
    path: '/LeaderBoard/admin/find',
    config: LeaderBoardRouter.find,
  },
];
