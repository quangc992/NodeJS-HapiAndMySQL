/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const ProductOrder = require('./ProductOrderRoute');

module.exports = [
  //ProductOrder APIs
  // { method: 'POST', path: '/ProductOrder/insert', config: ProductOrder.insert },
  { method: 'POST', path: '/ProductOrder/find', config: ProductOrder.find },
  { method: 'POST', path: '/ProductOrder/findById', config: ProductOrder.findById },
  { method: 'POST', path: '/ProductOrder/user/findById', config: ProductOrder.userFindById },
  { method: 'POST', path: '/ProductOrder/updateById', config: ProductOrder.updateById },
  // { method: 'POST', path: '/ProductOrder/deleteById', config: ProductOrder.deleteById },
  { method: 'POST', path: '/ProductOrder/user/getHistoryOrder', config: ProductOrder.getHistoryOrder },
  { method: 'POST', path: '/ProductOrder/user/getList', config: ProductOrder.getList },
  {
    method: 'POST',
    path: '/ProductOrder/user/userPlaceOrder',
    config: ProductOrder.userPlaceOrder,
  },
  {
    method: 'POST',
    path: '/ProductOrder/user/exchangeCurrencyByOrder',
    config: ProductOrder.exchangeCurrencyByOrder,
  },
  {
    method: 'POST',
    path: '/ProductOrder/user/userPlaceSellingOrder',
    config: ProductOrder.userPlaceSellingOrder,
  },
  { method: 'POST', path: '/ProductOrder/user/userPrecheckOrder', config: ProductOrder.userPrecheckOrder },
];
