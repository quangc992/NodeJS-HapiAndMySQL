/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const WalletRecord = require('./WalletRecordRouter');
const WalletRecord_User = require('./WalletRecord_UserRouter');

module.exports = [
  { method: 'POST', path: '/WalletRecord/find', config: WalletRecord.find },
  { method: 'POST', path: '/WalletRecord/user/viewHistory', config: WalletRecord_User.userViewWalletHistory },
  { method: 'POST', path: '/WalletRecord/user/summaryByUser', config: WalletRecord_User.summaryByUser },
];
