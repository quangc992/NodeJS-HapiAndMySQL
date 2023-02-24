/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StationProduct = require('./StationProductsRoute');
const StationProduct_User = require('./StationProducts_UserRoute');

module.exports = [
  //Api StationProduct
  {
    method: 'POST',
    path: '/StationProducts/insert',
    config: StationProduct.insert,
  },
  {
    method: 'POST',
    path: '/StationProducts/updateById',
    config: StationProduct.updateById,
  },
  {
    method: 'POST',
    path: '/StationProducts/findById',
    config: StationProduct.findById,
  },
  {
    method: 'POST',
    path: '/StationProducts/find',
    config: StationProduct.find,
  },
  {
    method: 'POST',
    path: '/StationProducts/deleteById',
    config: StationProduct.deleteById,
  },
  {
    method: 'POST',
    path: '/StationProducts/user/getList',
    config: StationProduct_User.userGetListProduct,
  },
  {
    method: 'POST',
    path: '/StationProducts/user/getDetail',
    config: StationProduct_User.userGetDetailProduct,
  },
];
