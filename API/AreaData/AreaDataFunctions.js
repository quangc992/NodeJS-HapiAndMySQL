/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const AreaResource = require('./resourceAccess/AreaDataResourceAccess');
const Logger = require('../../utils/logging');

async function findAreaIdByName(name, parentId) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {
        areaDataName: name,
      };
      if (parentId) {
        filter.areaParentId = parentId;
      }
      let areas = await AreaResource.customSearch(filter, 0, 1);
      if (areas && areas.length > 0) {
        resolve(areas[0].areaDataId);
      } else {
        Logger.warn(__filename, `findAreaIdByName failed with ${name} - parentId ${parentId}`);
        resolve(undefined);
      }
    } catch (e) {
      Logger.warn(__filename, `can not findAreaIdByName ${name} - parentId ${parentId}`);
      resolve(undefined);
    }
  });
}

function verifyAreaPermission(currentStaff, data) {
  //check area permission
  let isValidCity = false;
  let isValidDistrict = false;
  let isValidWard = false;
  let isValidCountry = false;

  if (currentStaff.areaCountryId && data.areaCountryId && currentStaff.areaCountryId.includes(data.areaCountryId.toString())) {
    isValidCountry = true;
  }

  if (currentStaff.areaProvinceId && data.areaProvinceId && currentStaff.areaProvinceId.includes(data.areaProvinceId.toString())) {
    isValidCity = true;
  }

  if (currentStaff.areaDistrictId && data.areaDistrictId && currentStaff.areaDistrictId.includes(data.areaDistrictId.toString())) {
    isValidDistrict = true;
  }

  if (currentStaff.areaWardId && data.areaWardId && currentStaff.areaWardId.includes(data.areaWardId.toString())) {
    isValidWard = true;
  }
  if (isValidCity && isValidDistrict && isValidWard && isValidCountry) {
    return true;
  }
  return false;
}

module.exports = {
  findAreaIdByName,
  verifyAreaPermission,
};
