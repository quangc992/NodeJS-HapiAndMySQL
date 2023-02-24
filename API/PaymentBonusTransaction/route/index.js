/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const PaymentBonusTransaction = require('./PaymentBonusTransactionRoute');
const PaymentBonusTransaction_UserRoute = require('./PaymentBonusTransaction_UserRoute');

module.exports = [
  //Payment Deposit  APIs
  { method: 'POST', path: '/PaymentBonusTransaction/insert', config: PaymentBonusTransaction.insert },
  { method: 'POST', path: '/PaymentBonusTransaction/find', config: PaymentBonusTransaction.find },
  // { method: 'POST', path: '/PaymentBonusTransaction/updateById', config: PaymentBonusTransaction.updateById },
  { method: 'POST', path: '/PaymentBonusTransaction/findById', config: PaymentBonusTransaction.findById },
  // { method: 'POST', path: '/PaymentBonusTransaction/deleteById', config: PaymentBonusTransaction.deleteById },
  {
    method: 'POST',
    path: '/PaymentBonusTransaction/approveBonusTransaction',
    config: PaymentBonusTransaction.approveBonusTransaction,
  },
  {
    method: 'POST',
    path: '/PaymentBonusTransaction/denyBonusTransaction',
    config: PaymentBonusTransaction.denyBonusTransaction,
  },

  {
    method: 'POST',
    path: '/PaymentBonusTransaction/user/requestWithdrawBonus',
    config: PaymentBonusTransaction_UserRoute.userRequestWithdrawBonus,
  },
  {
    method: 'POST',
    path: '/PaymentBonusTransaction/user/bonusHistory',
    config: PaymentBonusTransaction_UserRoute.userGetBonusHistory,
  },
  {
    method: 'POST',
    path: '/PaymentBonusTransaction/user/requestExchangePoint',
    config: PaymentBonusTransaction_UserRoute.userRequestExchangePoint,
  },
  // { method: 'POST', path: '/PaymentBonusTransaction/user/summaryBonusByStatus', config: PaymentBonusTransaction_UserRoute.userSummaryBonusByStatus },
];
