/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const RealEstateResourceAccess = require('./resourceAccess/RealEstateResourceAccess');
const Axios = require('axios').default;
const fs = require('fs');
const UploadResourceAccess = require('../Upload/resourceAccess/UploadResourceAccess');
const RealEstateImageResourceAccess = require('../RealEstateImage/resourceAccess/RealEstateImageResourceAccess');
const CommonPlaceResourceAccess = require('../CommonPlace/resourceAccess/CommonPlaceResourceAccess');
const convertMonth = require('../ApiUtils/utilFunctions');
const CategoryResource = require('../RealEstateCategory/resourceAccess/RealEstateCategoryResourceAccess');
const SubCategoryResource = require('../RealEstateSubCategory/resourceAccess/RealEstateSubCategoryResourceAccess');
const AreaDataResource = require('../AreaData/resourceAccess/AreaDataResourceAccess');

async function viewsRealEstate(realEstateId, data) {
  let realEstateData = {};
  realEstateData.realEstateViews = data.realEstateViews + 1;
  await RealEstateResourceAccess.updateById(realEstateId, realEstateData);
}
async function clickRealEstate(realEstateId, data) {
  let realEstateData = {};
  realEstateData.realEstateClick = data.realEstateClick + 1;
  await RealEstateResourceAccess.updateById(realEstateId, realEstateData);
}
async function convertLatLngToAreaData(lat, lng) {
  try {
    let res = await Axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&lang=vn&apikey=${process.env.HERE_MAP_API_KEY}`);
    if (res) {
      let data = {};
      data.AreaCountryName = res.data.items[0].address.countryName;
      data.AreaProvinceName = res.data.items[0].address.county;
      data.AreaDistrictName = res.data.items[0].address.city;
      data.AreaWardName = res.data.items[0].address.district;
      data.AreaStreetName = res.data.items[0].address.street;
      return data;
    }
  } catch (err) {
    return undefined;
  }
}

//validate image was moved to persistent folder or not
async function checkRealEstateImagePersistent(link) {
  let filter = {};
  filter.uploadFileUrl = link;
  //check if image link is already included persistent folder
  if (link.indexOf('uploads/media/realEstateImage') > -1) {
    return [];
  } else if (link.indexOf('image_temp' > -1)) {
    return await UploadResourceAccess.find(filter);
  }
  return undefined;
}
async function insertImage(data) {
  return await RealEstateImageResourceAccess.insert(data);
}

async function moveFile(filePath, uploadFormatFile) {
  try {
    let fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + `.${uploadFormatFile}`;
    let newfilePath = `uploads/media/realEstateImage/${fileName}`;
    let newLink = `https://${process.env.HOST_NAME}/${newfilePath}`;
    await fs.renameSync(filePath, newfilePath);
    return newLink;
  } catch {
    return false;
  }
}
async function findImage(id) {
  let filter = { realEstateId: id };
  return await RealEstateImageResourceAccess.find(filter);
}

//5km
const NEAREST_LAT_LNG = 0.045045045;
async function handleFindCommonPlace(realEstateData) {
  let commonPlace = await CommonPlaceResourceAccess.find({
    areaProvinceId: realEstateData.areaProvinceId,
    areaDistrictId: realEstateData.areaDistrictId,
  });
  let newRealEstateCommonPlace = '';
  if (commonPlace && commonPlace.length > 0) {
    for (let i = 0; i < commonPlace.length; i++) {
      let commonPlaceLat = commonPlace[i].lat;
      let commonPlaceLng = commonPlace[i].lng;
      let absLat = Math.abs(commonPlaceLat - realEstateData.lat);
      let absLng = Math.abs(commonPlaceLng - realEstateData.lng);
      if (absLat <= NEAREST_LAT_LNG && absLng <= NEAREST_LAT_LNG) {
        newRealEstateCommonPlace += `${commonPlace[i].CommonPlaceId};`;
      }
    }
  }
  if (realEstateData.lat && realEstateData.lng) {
    let otherCommonPlace = await CommonPlaceResourceAccess.findNearPlace(
      realEstateData.areaProvinceId,
      realEstateData.areaDistrictId,
      realEstateData.lat,
      realEstateData.lng,
      NEAREST_LAT_LNG,
    );
    if (otherCommonPlace && otherCommonPlace.length > 0) {
      for (let place of otherCommonPlace) {
        newRealEstateCommonPlace += `${place.commonPlaceId};`;
      }
    }
  }
  return newRealEstateCommonPlace;
}

// 1 lat = 1 lng = 111 km
const LAT_LNG_TO_KM = 111;

async function handleJoinCommonPlace(arrayCommonPlace, realEstateData) {
  let arrayDetailCommonPlace = [];
  for (let commonPlaceId of arrayCommonPlace) {
    let item = await CommonPlaceResourceAccess.find({
      commonPlaceId: commonPlaceId,
    });
    arrayDetailCommonPlace = arrayDetailCommonPlace.concat(item);
  }

  if (realEstateData) {
    if (!realEstateData.lat) {
      realEstateData.lat = 0;
    }
    if (!realEstateData.lng) {
      realEstateData.lng = 0;
    }
  }
  for (let place of arrayDetailCommonPlace) {
    if (realEstateData.lat && realEstateData.lng) {
      place.lat = Math.abs(realEstateData.lat - place.lat) * LAT_LNG_TO_KM;
      place.lng = Math.abs(realEstateData.lng - place.lng) * LAT_LNG_TO_KM;
    }
  }

  return arrayDetailCommonPlace;
}

function parseIntArray(array) {
  let newArray = array.split(';');
  let result = [];
  for (let element of newArray) {
    if (element) {
      result.push(parseInt(element));
    }
  }
  return result;
}

async function viewCategory(categoryId, subCategoryId) {
  await CategoryResource.incrementView(categoryId);
  if (subCategoryId) {
    await SubCategoryResource.incrementView(subCategoryId);
  }
  //function success
  return 'ok';
}
async function viewAreaData(areaDataId) {
  await AreaDataResource.incrementView(areaDataId);
  //function success
  return 'ok';
}

function removePhoneNumberInDescription(description = '') {
  const vietnamesePhone0 = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  const vietnamesePhone84 = /(84)+([0-9]{9})\b/g;
  if (description) {
    let arrayDescription = description.split(' ');
    for (let i = 0; i < arrayDescription.length; i++) {
      if (vietnamesePhone0.test(arrayDescription[i]) || vietnamesePhone84.test(arrayDescription[i])) {
        arrayDescription.splice(i, 1);
      }
    }
    return arrayDescription.join(' ');
  }

  return '';
}
async function selectField() {
  const tableName = 'RealEstateViews';
  return [
    `${tableName}.realEstateId`,
    `${tableName}.realEstateTitle`,
    `${tableName}.realEstateViews`,
    `${tableName}.realEstateClick`,
    `${tableName}.realEstateImage`,
    `${tableName}.areaProvinceName`,
    `${tableName}.areastreetName`,
    `${tableName}.areaDistrictName`,
    `${tableName}.areaWardName`,
    `${tableName}.areaCountryName`,
    `${tableName}.realEstateValueSalePrice`,
    `${tableName}.realEstateUnitPrice`,
    `${tableName}.realEstatePlanRentPrice`,
    `${tableName}.derectionRealEstateName`,
    `${tableName}.realEstateLandRealitySquare`,
    `${tableName}.realEstateLandDefaultSquare`,
    `${tableName}.realEstateLandDefaultSquare`,
    `${tableName}.realEstateLandDefaultSquare`,
    `${tableName}.agencyPercent`,
    `${tableName}.agency`,
    `${tableName}.realEstateHouseBedRooms`,
    `${tableName}.realEstateHouseToilets`,
    `${tableName}.realEstateHouseKitchen`,
    `${tableName}.realEstateHouseLivingRoom`,
    `${tableName}.createdAt`,
    `${tableName}.updatedAt`,
    `${tableName}.realEstateCategoryId`,
    `${tableName}.realEstatePostTypeId`,
    `${tableName}.activedDate`,
    `${tableName}.isHidden`,
    `${tableName}.realEstateSubCategoryId`,
    `${tableName}.realEstateLandUseSquare`,
  ];
}

module.exports = {
  viewsRealEstate,
  clickRealEstate,
  convertLatLngToAreaData,
  insertImage,
  checkRealEstateImagePersistent,
  moveFile,
  findImage,
  handleFindCommonPlace,
  handleJoinCommonPlace,
  parseIntArray,
  viewCategory,
  viewAreaData,
  removePhoneNumberInDescription,
  selectField,
};
