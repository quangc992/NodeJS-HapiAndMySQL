/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const CustomerInfoRoute = require('./CustomerInfoRoute');

module.exports = [
  { method: 'POST', path: '/CustomerInfo/insert', config: CustomerInfoRoute.insert },
  { method: 'POST', path: '/CustomerInfo/find', config: CustomerInfoRoute.find },
  { method: 'POST', path: '/CustomerInfo/findById', config: CustomerInfoRoute.findById },
  { method: 'POST', path: '/CustomerInfo/updateById', config: CustomerInfoRoute.updateById },
  { method: 'POST', path: '/CustomerInfo/deleteById', config: CustomerInfoRoute.deleteById },
];
