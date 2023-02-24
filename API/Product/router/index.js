/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const Product = require('./ProductRoute');

module.exports = [
  //Product APIs
  { method: 'POST', path: '/Product/insert', config: Product.insert },
  { method: 'POST', path: '/Product/find', config: Product.find },
  { method: 'POST', path: '/Product/findById', config: Product.findById },
  { method: 'POST', path: '/Product/updateById', config: Product.updateById },
  { method: 'POST', path: '/Product/deleteById', config: Product.deleteById },
  { method: 'POST', path: '/Product/user/getList', config: Product.getList },
];
