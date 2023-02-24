/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StationProductsCategory = require('./StationProductsCategoryRoute');
const StationProductsCategory_User = require('./StationProductsCategory_UserRoute');

module.exports = [
  //Api StationProduct
  {
    method: 'POST',
    path: '/StationProductsCategory/insert',
    config: StationProductsCategory.insert,
  },
  {
    method: 'POST',
    path: '/StationProductsCategory/updateById',
    config: StationProductsCategory.updateById,
  },
  {
    method: 'POST',
    path: '/StationProductsCategory/findById',
    config: StationProductsCategory.findById,
  },
  {
    method: 'POST',
    path: '/StationProductsCategory/find',
    config: StationProductsCategory.find,
  },
  {
    method: 'POST',
    path: '/StationProductsCategory/deleteById',
    config: StationProductsCategory.deleteById,
  },
  {
    method: 'POST',
    path: '/StationProductsCategory/updateDisplayIndexById',
    config: StationProductsCategory.updateDisplayIndexById,
  },

  {
    method: 'POST',
    path: '/StationProductsCategory/user/getList',
    config: StationProductsCategory_User.userGetListProductCategory,
  },
];
