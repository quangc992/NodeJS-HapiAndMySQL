/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StationProduct = require('./StationServicesRoute');
const StationProduct_User = require('./StationServices_UserRoute');

module.exports = [
  //Api StationProduct
  {
    method: 'POST',
    path: '/StationServices/insert',
    config: StationProduct.insert,
  },
  {
    method: 'POST',
    path: '/StationServices/updateById',
    config: StationProduct.updateById,
  },
  {
    method: 'POST',
    path: '/StationServices/findById',
    config: StationProduct.findById,
  },
  {
    method: 'POST',
    path: '/StationServices/find',
    config: StationProduct.find,
  },
  {
    method: 'POST',
    path: '/StationServices/deleteById',
    config: StationProduct.deleteById,
  },
  {
    method: 'POST',
    path: '/StationServices/user/getList',
    config: StationProduct_User.userGetListProduct,
  },
  {
    method: 'POST',
    path: '/StationServices/user/getDetail',
    config: StationProduct_User.userGetDetailProduct,
  },
];
