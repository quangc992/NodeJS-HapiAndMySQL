/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const PaymentExchangeTransaction = require('./PaymentExchangeTransactionRoute');
const UserPaymentExchangeTransaction = require('./UserPaymentExchangeTransactionRoute');
const ExchangePaymentMappingOrder = require('./ExchangePaymentMappingOrderRoute');

module.exports = [
  //APIs for Admin / staff
  // { method: 'POST', path: '/PaymentExchangeTransaction/insert', config: PaymentExchangeTransaction.insert },
  // { method: 'POST', path: '/PaymentExchangeTransaction/updateById', config: PaymentExchangeTransaction.updateById },
  { method: 'POST', path: '/PaymentExchangeTransaction/find', config: ExchangePaymentMappingOrder.find },
  { method: 'POST', path: '/PaymentExchangeTransaction/findById', config: ExchangePaymentMappingOrder.findById },
  { method: 'POST', path: '/PaymentExchangeTransaction/user/getList', config: ExchangePaymentMappingOrder.getList },
  { method: 'POST', path: '/PaymentExchangeTransaction/user/findById', config: ExchangePaymentMappingOrder.findById },
  // { method: 'POST', path: '/PaymentExchangeTransaction/receiveHistory', config: PaymentExchangeTransaction.receiveHistory },
  // { method: 'POST', path: '/PaymentExchangeTransaction/exchangeHistory', config: PaymentExchangeTransaction.exchangeHistory },
  {
    method: 'POST',
    path: '/PaymentExchangeTransaction/approveExchangeTransaction',
    config: PaymentExchangeTransaction.approveExchangeTransaction,
  },
  {
    method: 'POST',
    path: '/PaymentExchangeTransaction/denyExchangeTransaction',
    config: PaymentExchangeTransaction.denyExchangeTransaction,
  },
  // { method: 'POST', path: '/PaymentExchangeTransaction/viewExchangeRequests', config: PaymentExchangeTransaction.viewExchangeRequests },
  // { method: 'POST', path: '/PaymentExchangeTransaction/deleteById', config: PaymentExchangeTransaction.deleteById },

  //APIs for user
  // { method: 'POST', path: '/PaymentExchangeTransaction/user/requestExchange', config: UserPaymentExchangeTransaction.userRequestExchange },
  // {
  //   method: 'POST',
  //   path: '/PaymentExchangeTransaction/user/userExchangeFACHistory',
  //   config: UserPaymentExchangeTransaction.userExchangeFACHistory,
  // },
  // { method: 'POST', path: '/PaymentExchangeTransaction/user/receiveHistory', config: UserPaymentExchangeTransaction.userReceiveHistory },
  {
    method: 'POST',
    path: '/PaymentExchangeTransaction/user/acceptExchangeRequest',
    config: UserPaymentExchangeTransaction.userAcceptExchangeRequest,
  },
  {
    method: 'POST',
    path: '/PaymentExchangeTransaction/user/denyExchangeRequest',
    config: UserPaymentExchangeTransaction.userDenyExchangeRequest,
  },
  // { method: 'POST', path: '/PaymentExchangeTransaction/user/cancelExchangeRequest', config: UserPaymentExchangeTransaction.userCancelExchangeRequest },
  // { method: 'POST', path: '/PaymentExchangeTransaction/user/viewExchangeRequests', config: UserPaymentExchangeTransaction.userViewExchangeRequests },
  // {
  //   method: 'POST',
  //   path: '/PaymentExchangeTransaction/user/ExchangeFAC',
  //   config: UserPaymentExchangeTransaction.userExchangeFAC,
  // },
  // {
  //   method: 'POST',
  //   path: '/PaymentExchangeTransaction/user/ExchangePOINT',
  //   config: UserPaymentExchangeTransaction.userExchangePOINT,
  // },
  // {
  //   method: 'POST',
  //   path: '/PaymentExchangeTransaction/user/userExchangePOINTHistory',
  //   config: UserPaymentExchangeTransaction.userExchangePOINTHistory,
  // },
  // {
  //   method: 'POST',
  //   path: '/PaymentExchangeTransaction/user/requestBonusExchangePoint',
  //   config: UserPaymentExchangeTransaction.requestBonusExchangePoint,
  // },
];
