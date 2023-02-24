/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';

const AppUserServiceResource = require('../AppUserService/resourceAccess/AppUserServiceResourceAccess');
const AppUserServiceViews = require('../AppUserService/resourceAccess/AppUserServiceView');

async function storeUserService(appUserId, serviceId, serviceType) {
  let result = await AppUserServiceResource.insert({
    appUserId: appUserId,
    userServiceId: serviceId,
    userServiceType: serviceType,
  });

  return result;
}

async function _fetchAllServicesByUser(appUserId, serviceType) {
  let _filter = {
    appUserId: appUserId,
  };
  if (serviceType) {
    _filter.userServiceType = serviceType;
  }
  let _serviceList = await AppUserServiceResource.find(_filter);

  return _serviceList;
}

async function fetchAllStationServicesByUser(appUserId, serviceType) {
  let _userServiceList = await _fetchAllServicesByUser(appUserId, serviceType);
  let _packageList = [];
  if (_userServiceList && _userServiceList.length > 0) {
    const StationServicesResourceAccess = require('../StationServices/resourceAccess/StationServicesResourceAccess');
    for (let i = 0; i < _userServiceList.length; i++) {
      const _userService = _userServiceList[i];
      let _serviceInfo = await StationServicesResourceAccess.findById(_userService.userServiceId);
      if (_serviceInfo) {
        _packageList.push(_serviceInfo);
      }
    }
  }

  return _packageList;
}

module.exports = {
  storeUserService,
  fetchAllStationServicesByUser,
};
