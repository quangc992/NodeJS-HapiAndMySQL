/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const AreaStreetResourceAccess = require('../../AreaStreet/resourceAccess/AreaStreetResourceAccess');
const RealEstateViews = require('../../RealEstate/resourceAccess/RealEstateViews');
const RealEstateResourceAccess = require('../../RealEstate/resourceAccess/RealEstateResourceAccess');
const AreaDirectionResourceAccess = require('../../AreaDirection/resourceAccess/AreaDirectionResourceAccess');
const AreaDataResourceAccess = require('../../AreaData/resourceAccess/AreaDataResourceAccess');
const RealEstatePostTypeResourceAccess = require('../../RealEstatePostType/resourceAccess/RealEstatePostTypeResourceAccess');
const RealEstateCategoryResourceAccess = require('../../RealEstateCategory/resourceAccess/RealEstateCategoryResourceAccess');
const CommonPlaceView = require('../../CommonPlace/resourceAccess/CommonPlaceView');
const RealEstateUtil = require('../../RealEstateUtilities/resourceAccess/RealEstateUtilitiesResourceAccess');

const Logger = require('../../../utils/logging');

async function getAreaData(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload;
      let result = await AreaDataResourceAccess.customSearch(filter);
      let resultCount = await AreaDataResourceAccess.customCount(filter);
      if (result && resultCount) {
        resolve({ data: result, total: resultCount[0].count });
      } else {
        reject('Cannot find data');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getDataFilterRealEstate(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload;
      let resultDirection = await AreaDirectionResourceAccess.find({});
      let resultRealEstatePostType = await RealEstatePostTypeResourceAccess.find({});
      let resultRealEstateCategory = await RealEstateCategoryResourceAccess.find(filter);
      if (resultDirection && resultRealEstatePostType && resultRealEstateCategory) {
        resolve({
          dataDirection: resultDirection,
          dataRealEstateType: resultRealEstatePostType,
          dataRealEstateCategory: resultRealEstateCategory,
        });
      } else {
        reject('Cannot find data');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

async function getRealEstateUtil(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateCategoryId = req.payload.realEstateCategoryId;
      let realEstateUtil = await RealEstateUtil.find({
        realEstateCategoryId: realEstateCategoryId,
      });
      let realEstateUtilCount = await RealEstateUtil.count({
        realEstateCategoryId: realEstateCategoryId,
      });
      if (realEstateUtil && realEstateUtilCount) {
        resolve({ data: realEstateUtil, count: realEstateUtilCount[0].count });
      } else {
        reject('Cannot find data');
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}

module.exports = {
  getDataFilterRealEstate,
  getAreaData,
  getRealEstateUtil,
};
