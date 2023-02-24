/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const StationsResourceAccess = require('../resourceAccess/StationsResourceAccess');
const StationFunctions = require('../StationsFunctions');
const Logger = require('../../../utils/logging');
const UtilsFunction = require('../../ApiUtils/utilFunctions');
const ImageUtils = require('../../ApiUtils/imageUtilsFunctions');
const StaffFunctions = require('../../Staff/StaffFunctions');
const { STATION_STATUS } = require('../StationsConstants');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsData = req.payload;

      //xu ly tao ra thumbnail tu avatar (neu co update)
      if (stationsData.stationsLogo) {
        let _thumbnailsUrl = await ImageUtils.createThumbnailsImage(stationsData.stationsLogo);
        if (_thumbnailsUrl) {
          stationsData.stationsLogoThumbnails = _thumbnailsUrl;
        }
      }

      let registerResult = await StationFunctions.registerNewStation(stationsData);

      if (registerResult) {
        let nonVietnameseName = UtilsFunction.nonAccentVietnamese(stationsData.stationsName);
        nonVietnameseName = UtilsFunction.replaceAll(nonVietnameseName, ' ', '');
        //Register first admin user for new station
        let registerUserResult = undefined;
        let generatorIndex = 0;

        //loop until registration finish or react 100 times
        let retryMaxTime = 100;
        let retry = 0;
        while (registerUserResult === undefined) {
          let adminUserData = {
            username: nonVietnameseName + (generatorIndex === 0 ? '' : generatorIndex) + 'admin',
            firstName: 'admin',
            lastName: stationsData.stationsName,
            password: '123456789',
            stationsId: registerResult[0],
            roleId: 2, //Station Admin
          };

          try {
            registerUserResult = await StaffFunctions.createNewStaff(adminUserData, adminUserData.password);
          } catch (error) {
            Logger.info(`Duplicated staff username ${adminUserData.username}`);
          }

          if (!registerUserResult) {
            generatorIndex = generatorIndex + 1;
            retry++;
          }
          if (retryMaxTime === retry) {
            reject('failed');
          }
        }
        resolve(registerResult);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = req.payload.searchText;

      let stations = await StationsResourceAccess.customSearch(filter, skip, limit, searchText, order);

      if (stations && stations.length > 0) {
        let stationsCount = await StationsResourceAccess.customCount(filter, searchText, order);
        resolve({ data: stations, total: stationsCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    let stationsId = req.payload.id;
    let stationsData = req.payload.data;
    try {
      if (stationsData.stationBookingConfig) {
        try {
          StationFunctions.sortCheckingConfigStep(stationsData.stationBookingConfig);

          stationsData.stationBookingConfig = JSON.stringify(stationsData.stationBookingConfig);
        } catch (error) {
          stationsData.stationBookingConfig = '';
        }
      }

      //xu ly tao ra thumbnail tu avatar (neu co update)
      if (stationsData.stationsLogo) {
        let _thumbnailsUrl = await ImageUtils.createThumbnailsImage(stationsData.stationsLogo);
        if (_thumbnailsUrl) {
          stationsData.stationsLogoThumbnails = _thumbnailsUrl;
        }
      }

      let result = await StationsResourceAccess.updateById(stationsId, stationsData);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.id;
      let stationsData = {
        isDeleted: 1,
      };

      let result = await StationsResourceAccess.updateById(stationsId, stationsData);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.id;
      let result = await StationFunctions.getStationDetailById(stationsId);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function findByUrl(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsUrl = req.payload.stationsUrl;
      let result = await StationFunctions.getStationDetailByUrl(stationsUrl);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function resetAllDefaultMp3() {
  await StationFunctions.resetAllDefaultMp3();
}

async function updateConfigSMTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let smtpHost = req.payload.smtpHost;
      let smtpPort = req.payload.smtpPort;
      let smtpSecure = req.payload.smtpSecure;
      let smtpAuth = req.payload.smtpAuth;
      let smtpTls = req.payload.smtpTls;
      let stationData = {
        stationCustomSMTPConfig: {
          smtpHost: smtpHost,
          smtpPort: smtpPort,
          smtpSecure: smtpSecure,
          smtpAuth: smtpAuth,
          smtpTls: smtpTls,
        },
      };
      stationData.stationCustomSMTPConfig = JSON.stringify(stationData.stationCustomSMTPConfig);
      let result = await StationsResourceAccess.updateById(stationsId, stationData);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateConfigSMS(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let smsUrl = req.payload.smsUrl;
      let smsUserName = req.payload.smsUserName;
      let smsPassword = req.payload.smsPassword;
      let smsBrand = req.payload.smsBrand;
      let stationData = {
        stationCustomSMSBrandConfig: {
          smsUrl: smsUrl,
          smsUserName: smsUserName,
          smsPassword: smsPassword,
          smsBrand: smsBrand,
        },
      };
      stationData.stationCustomSMSBrandConfig = JSON.stringify(stationData.stationCustomSMSBrandConfig);
      let result = await StationsResourceAccess.updateById(stationsId, stationData);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateCustomSMTP(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationUseCustomSMTP = req.payload.CustomSMTP;
      let stationData = {
        stationUseCustomSMTP: stationUseCustomSMTP,
      };
      let result = await StationsResourceAccess.updateById(stationsId, stationData);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateCustomSMSBrand(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationUseCustomSMSBrand = req.payload.stationUseCustomSMSBrand;
      let stationData = {
        stationUseCustomSMSBrand: stationUseCustomSMSBrand,
      };
      let result = await StationsResourceAccess.updateById(stationsId, stationData);
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateRightAdBanner(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationsCustomAdBannerRight = req.payload.stationsCustomAdBannerRight;

      let result = await StationsResourceAccess.updateById(stationsId, {
        stationsCustomAdBannerRight: stationsCustomAdBannerRight,
      });
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function updateLeftAdBanner(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationsCustomAdBannerLeft = req.payload.stationsCustomAdBannerLeft;

      let result = await StationsResourceAccess.updateById(stationsId, {
        stationsCustomAdBannerLeft: stationsCustomAdBannerLeft,
      });
      if (result) {
        resolve(result);
      }
      reject('failed');
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function enableAdsForStation(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.stationsId;
      let stationsEnableAd = req.payload.stationsEnableAd;

      let result = await StationsResourceAccess.updateById(stationsId, {
        stationsEnableAd: stationsEnableAd,
      });
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetListStation(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let searchText = req.payload.searchText;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      if (!filter) {
        filter = {};
      }
      filter.stationStatus = STATION_STATUS.ACTIVE;
      let stations = await StationsResourceAccess.customSearch(filter, skip, limit, searchText, order);

      if (stations && stations.length > 0) {
        let stationsCount = await StationsResourceAccess.customCount(filter, searchText, order);
        resolve({ data: stations, total: stationsCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetDetailStationById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsId = req.payload.id;
      let result = await StationFunctions.getStationDetailById(stationsId);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function userGetDetailStationByUrl(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let stationsUrl = req.payload.stationsUrl;
      let result = await StationFunctions.getStationDetailByUrl(stationsUrl);
      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  deleteById,
  findByUrl,
  resetAllDefaultMp3,
  updateConfigSMTP,
  updateConfigSMS,
  updateCustomSMTP,
  updateCustomSMSBrand,
  updateLeftAdBanner,
  updateRightAdBanner,
  enableAdsForStation,
  userGetListStation,
  userGetDetailStationById,
  userGetDetailStationByUrl,
};
