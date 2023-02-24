/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const PaymentMethod = require('./PaymentMethodRoute');

module.exports = [
  //PaymentMethod APIs
  { method: 'POST', path: '/PaymentMethod/insert', config: PaymentMethod.insert },
  { method: 'POST', path: '/PaymentMethod/find', config: PaymentMethod.find },
  { method: 'POST', path: '/PaymentMethod/findById', config: PaymentMethod.findById },
  { method: 'POST', path: '/PaymentMethod/updateById', config: PaymentMethod.updateById },
  { method: 'POST', path: '/PaymentMethod/deleteById', config: PaymentMethod.deleteById },
  { method: 'POST', path: '/PaymentMethod/user/getList', config: PaymentMethod.getList },
];
