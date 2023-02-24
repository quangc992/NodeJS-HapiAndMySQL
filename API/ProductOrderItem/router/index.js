/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const ProductOrderItem = require('./ProductOrderItemRoute');

module.exports = [
  //ProductOrderItem APIs
  // { method: 'POST', path: '/ProductOrderItem/insert', config: ProductOrderItem.insert },
  // { method: 'POST', path: '/ProductOrderItem/find', config: ProductOrderItem.find },
  // { method: 'POST', path: '/ProductOrderItem/findById', config: ProductOrderItem.findById },
  { method: 'POST', path: '/ProductOrderItem/updateById', config: ProductOrderItem.updateById },
  // { method: 'POST', path: '/ProductOrderItem/deleteById', config: ProductOrderItem.deleteById },
  // { method: 'POST', path: '/ProductOrderItem/user/getList', config: ProductOrderItem.getList },
];
