/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

const StationServicesCategory = require('./StationServicesCategoryRoute');
const StationServicesCategory_User = require('./StationServicesCategory_UserRoute');

module.exports = [
  //Api StationProduct
  {
    method: 'POST',
    path: '/StationServicesCategory/insert',
    config: StationServicesCategory.insert,
  },
  {
    method: 'POST',
    path: '/StationServicesCategory/updateById',
    config: StationServicesCategory.updateById,
  },
  {
    method: 'POST',
    path: '/StationServicesCategory/findById',
    config: StationServicesCategory.findById,
  },
  {
    method: 'POST',
    path: '/StationServicesCategory/find',
    config: StationServicesCategory.find,
  },
  {
    method: 'POST',
    path: '/StationServicesCategory/deleteById',
    config: StationServicesCategory.deleteById,
  },
  {
    method: 'POST',
    path: '/StationServicesCategory/updateDisplayIndexById',
    config: StationServicesCategory.updateDisplayIndexById,
  },

  {
    method: 'POST',
    path: '/StationServicesCategory/user/getList',
    config: StationServicesCategory_User.userGetListProductCategory,
  },
];
