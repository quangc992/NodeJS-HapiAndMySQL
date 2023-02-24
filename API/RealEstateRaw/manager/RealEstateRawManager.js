/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const Logger = require('../../../utils/logging');
const RealEstateCrawlerModel = require('../model/RealEstateCrawlerModel');
const RealEstateRawModel = require('../model/RealEstateRawModel');
const AreaFunctions = require('../../AreaData/AreaDataFunctions');
const RealEstateCategoryFunction = require('../../RealEstateCategory/RealEstateCategoryFunctions');
const RealEstateSubCategoryFunction = require('../../RealEstateSubCategory/RealEstateSubCategoryFunctions');
const PostTypeFunction = require('../../RealEstatePostType/RealEstatePostTypeFunctions');
const RawRealEstateResource = require('../resourceAccess/RealEstateRawResourceAccess');
const RealEstateResourceAccess = require('../../RealEstate/resourceAccess/RealEstateResourceAccess');

async function _syncCrawlDataToModel(crawlerRealEstate) {
  let moreInfoData = {};
  //TODO
  // table.string('realEstateImage');// hình ảnh BDS
  // table.string('realEstateVideo');// Video

  let postType = await PostTypeFunction.findPostTypeByName(crawlerRealEstate.SystemPostType);
  if (postType) {
    moreInfoData.realEstatePostTypeId = postType.realEstatePostTypeId;
  }

  //search for subcategory first
  let realEstateSubCategory = await RealEstateSubCategoryFunction.findSubCategoryByName(crawlerRealEstate.AreaTypeName);
  if (realEstateSubCategory) {
    moreInfoData.realEstateSubCategoryId = realEstateSubCategory.realEstateSubCategoryId;
  }

  //search for category after subcategory
  let realEstateCategory = await RealEstateCategoryFunction.findCategoryByName(crawlerRealEstate.AreaTypeName);
  if (realEstateCategory) {
    //if found any category, then update
    moreInfoData.realEstateCategoryId = realEstateCategory.realEstateCategoryId;
  } else {
    //if did not found any category, then check categoryId from subcategory if subcategory available
    if (realEstateSubCategory) {
      moreInfoData.realEstateCategoryId = realEstateSubCategory.realEstateCategoryId;
    }
  }
  moreInfoData.areaCountryId = 1;
  moreInfoData.areaProvinceId = await AreaFunctions.findAreaIdByName(crawlerRealEstate.AreaProvinceName);
  moreInfoData.areaDistrictId = await AreaFunctions.findAreaIdByName(crawlerRealEstate.areaDistrictId, moreInfoData.areaProvinceId);
  moreInfoData.areaWardId = await AreaFunctions.findAreaIdByName(crawlerRealEstate.AreaProvinceName, moreInfoData.areaDistrictId);
  //TODO LATER
  // moreInfoData.areaStreetId = AreaFunctions.findProvinceIdByName(crawlerRealEstate.AreaProvinceName);
  return moreInfoData;
}

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateRawDataList = req.payload;
      if (realEstateRawDataList && realEstateRawDataList.length <= 0) {
        reject('failed');
      }

      let rawDataList = [];
      for (let i = 0; i < realEstateRawDataList.length; i++) {
        //convert from crawling data to database raw real estate model
        let rawRealEstate = RealEstateRawModel.fromCrawlerData(realEstateRawDataList[i]);
        if (rawRealEstate === undefined) {
          continue;
        }
        //fetch more info that need mapping from name to ID
        let moreInfo = await _syncCrawlDataToModel(realEstateRawDataList[i]);
        //add more info into object
        rawRealEstate = {
          ...rawRealEstate,
          ...moreInfo,
        };

        rawDataList.push(rawRealEstate);
      }
      if (rawDataList.length > 0) {
        let result = await RawRealEstateResource.insert(rawDataList);
        if (result) {
          resolve(result);
        }
      }
      resolve('Done');
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
      let filterClause = req.payload.filterClause;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchText = req.payload.searchText;
      let staff = req.currentUser;
      if (req.currentUser.roleId !== 1) {
        filter.areaProvinceId = RealEstateFunctions.parseIntArray(staff.AreaProvince);
        filter.areaDistrictId = RealEstateFunctions.parseIntArray(staff.AreaDistrict);
        filter.areaWardId = RealEstateFunctions.parseIntArray(staff.AreaWard);
      }
      let result = await RawRealEstateResource.customSearch(filter, filterClause, skip, limit, startDate, endDate, searchText, order);
      let resultCount = await RawRealEstateResource.customCount(filter, filterClause, startDate, endDate, searchText, order);
      if (result && resultCount) {
        resolve({ data: result, total: resultCount[0].count });
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
    try {
      let realEstateRawId = req.payload.id;
      let realEstateData = req.payload.data;
      let result = await RawRealEstateResource.updateById(realEstateRawId, realEstateData);
      if (result) {
        resolve(result);
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
      let realEstateRawId = req.payload.id;
      let result = await RawRealEstateResource.findById(realEstateRawId);
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

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateRawId = req.payload.id;

      let result = await RawRealEstateResource.deleteById(realEstateRawId);
      if (result) {
        resolve(result);
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject('failed');
    }
  });
}
async function staffApproveRealEstateRaw(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let realEstateRawId = req.payload.id;
      let result = await RawRealEstateResource.findById(realEstateRawId);
      if (result) {
        delete result.realEstateRawId;
        let resultInsert = await RealEstateResourceAccess.insert(result);
        if (resultInsert) {
          resolve('DONE');
        }
      }
      resolve('failed');
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
  staffApproveRealEstateRaw,
};
