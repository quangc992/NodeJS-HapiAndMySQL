/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'RealEstateViews';
const rootTableName = 'RealEstate';
const primaryKeyField = 'realEstateId';

async function createRoleStaffView() {
  const AreaDataTable = 'AreaData';
  const AreaStreet = 'AreaStreet';
  const AppUser = 'AppUser';
  const MetaData = 'MetaData';
  const AreaDirection = 'AreaDirection';
  const RealEstateProject = 'RealEstateProject';
  let fields = [
    `${rootTableName}.realEstateId`,
    `${rootTableName}.realEstateTitle`,
    `${rootTableName}.realEstatePhone`,
    `${rootTableName}.realEstateEmail`,
    `${rootTableName}.realEstateContacAddress`,
    `${rootTableName}.realEstateDescription`,
    `${rootTableName}.realEstateLandRealitySquare`,
    `${rootTableName}.realEstateLandDefaultSquare`,
    `${rootTableName}.realEstateLandRoadSquare`,
    `${rootTableName}.realEstateLandRealConstructionSquare`,
    `${rootTableName}.realEstateLandLongs`,
    `${rootTableName}.realEstateLandWidth`,
    `${rootTableName}.realEstateValueSalePrice`,
    `${rootTableName}.realEstateUnitPrice`,
    `${rootTableName}.realEstatePlanRentPrice`,
    `${rootTableName}.realEstatedeposits`,
    `${rootTableName}.realEstateJuridicalName`,
    `${rootTableName}.realEstateLocationFrontStreetWidth`,
    `${rootTableName}.realEstateLocationStreetWidth`,
    `${rootTableName}.realEstateHouseDirection`,
    `${rootTableName}.realEstateHouseFurnitureList`,
    `${rootTableName}.realEstateHouseFloors`,
    `${rootTableName}.realEstateHouseBedRooms`,
    `${rootTableName}.realEstateHouseToilets`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.realEstateContactTypeId`,
    `${rootTableName}.realEstateProjectId`,
    `${rootTableName}.staffId`,
    `${rootTableName}.realEstateCategoryId`,
    `${rootTableName}.realEstateSubCategoryId`,
    `${rootTableName}.realEstatePostTypeId`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.lat`,
    `${rootTableName}.lng`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.realEstateViews`,
    `${rootTableName}.apartmentCode`,
    `${rootTableName}.apartmentCodeStatus`,
    `${rootTableName}.realEstateHouseKitchen`,
    `${rootTableName}.realEstateHouseLivingRoom`,
    `${rootTableName}.apartmentBlockCode`,
    `${rootTableName}.apartmentCornerPosition`,
    `${rootTableName}.realEstateClick`,
    `${rootTableName}.approveStatus`,
    `${rootTableName}.approveDate`,
    `${rootTableName}.approvePIC`,
    `${rootTableName}.areaProvinceId`,
    `${rootTableName}.areaDistrictId`,
    `${rootTableName}.areaWardId`,
    `${rootTableName}.areaCountryId`,
    `${rootTableName}.areaStreetId`,
    `${rootTableName}.realEstateImage`,
    `${rootTableName}.realEstateVideo`,
    `${rootTableName}.activedDate`,
    `${rootTableName}.realEstateCommonPlace`,
    `${rootTableName}.agency`,
    `${rootTableName}.realEstateUtil`,
    `${rootTableName}.realEstateLocationHomeNumber`,
    `${rootTableName}.realEstateLocationHomeNumberStatus`,
    `${rootTableName}.agencyPercent`,
    `${rootTableName}.realEstateLandUseSquare`,
    `${AppUser}.username`,
    `${AppUser}.firstName`,
    `${AppUser}.lastName`,
    `${AppUser}.userAvatar`,
    `province.areaDataName as areaProvinceName`,
    `street.areaStreetName as areastreetName`,
    `district.areaDataName as areaDistrictName`,
    `ward.areaDataName as areaWardName`,
    `country.areaDataName as areaCountryName`,
    `legalpapers.metaDataName as realEstateJuridical`,
    `legalpapers.metaDataId as realEstateJuridicalId`,
    `furniture.metaDataId as realEstateFurnitureId`,
    `furniture.metaDataName as realEstateFurnitureName`,
    `derectionHouse.AreaDirectionName as derectionHouseName`,
    `derectionBalcony.AreaDirectionName as derectionBalconyName`,
    `derectionRealEstate.AreaDirectionName as derectionRealEstateName`,
    `contact.metaDataId as contactId`,
    `contact.metaDataName as contactName`,
    `shape.metaDataId as shapeId`,
    `shape.metaDataName as shapeName`,
    `${RealEstateProject}.realEstateProjectTitle`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin({ province: AreaDataTable }, function () {
      this.on(`${rootTableName}.areaProvinceId`, '=', `province.areaDataId`);
    })
    .leftJoin({ district: AreaDataTable }, function () {
      this.on(`${rootTableName}.areaDistrictId`, '=', `district.areaDataId`);
    })
    .leftJoin({ ward: AreaDataTable }, function () {
      this.on(`${rootTableName}.areaWardId`, '=', `ward.areaDataId`);
    })
    .leftJoin({ country: AreaDataTable }, function () {
      this.on(`${rootTableName}.areaCountryId`, '=', `country.areaDataId`);
    })
    .leftJoin({ legalpapers: MetaData }, function () {
      this.on(`${rootTableName}.realEstateJuridicalName`, '=', `legalpapers.metaDataId`);
    })
    .leftJoin({ furniture: MetaData }, function () {
      this.on(`${rootTableName}.realEstateHouseFurniture`, '=', `furniture.metaDataId`);
    })
    .leftJoin({ shape: MetaData }, function () {
      this.on(`${rootTableName}.realEstateLandShapeName`, '=', `shape.metaDataId`);
    })
    .leftJoin({ derectionHouse: AreaDirection }, function () {
      this.on(`${rootTableName}.realEstateHouseDirection`, '=', `derectionHouse.areaDirectionId`);
    })
    .leftJoin({ derectionBalcony: AreaDirection }, function () {
      this.on(`${rootTableName}.realEstateBalconyDirection`, '=', `derectionBalcony.areaDirectionId`);
    })
    .leftJoin({ contact: MetaData }, function () {
      this.on(`${rootTableName}.realEstateContactTypeId`, '=', `contact.metaDataId`);
    })
    .leftJoin({ derectionRealEstate: AreaDirection }, function () {
      this.on(`${rootTableName}.realEstateDirection`, '=', `derectionRealEstate.areaDirectionId`);
    })
    .leftJoin({ street: AreaStreet }, function () {
      this.on(`${rootTableName}.areaStreetId`, '=', `street.areaStreetId`);
    })
    .leftJoin(AppUser, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${AppUser}.appUserId`);
    })
    .leftJoin(RealEstateProject, function () {
      this.on(`${rootTableName}.realEstateProjectId`, '=', `${RealEstateProject}.realEstateProjectId`);
    });
  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createRoleStaffView();
}
async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  return await Common.updateById(tableName, { userId: id }, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}
async function findById(id) {
  return await Common.findById(tableName, primaryKeyField, id);
}
async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}
function _makeQueryBuilderByFilter(filter, filterClause, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  let filterDataClause = filterClause ? JSON.parse(JSON.stringify(filterClause)) : {};
  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('realEstateTitle', 'like', `%${searchText}%`)
        .orWhere('realEstateDescription', 'like', `%${searchText}%`)
        .orWhere('realEstatePhone', 'like', `%${searchText}%`)
        .orWhere('realEstateEmail', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('lastName', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.realEstatePhone) {
      queryBuilder.where('realEstatePhone', 'like', `%${filterData.realEstatePhone}%`);
      delete filterData.realEstatePhone;
    }
    if (filterData.realEstateTitle) {
      queryBuilder.where('realEstateTitle', 'like', `%${filterData.realEstateTitle}%`);
      delete filterData.realEstateTitle;
    }

    if (filterData.realEstateDescription) {
      queryBuilder.where('realEstateDescription', 'like', `%${filterData.realEstateDescription}%`);
      delete filterData.realEstateDescription;
    }
    if (filterData.adminAreaProvinceId && filterData.adminAreaProvinceId.length > 0) {
      queryBuilder.whereIn('areaProvinceId', filterData.adminAreaProvinceId);
      delete filterData.adminAreaProvinceId;
    }
    if (filterData.adminAreaDistrictId && filterData.adminAreaDistrictId.length > 0) {
      queryBuilder.whereIn('areaDistrictId', filterData.adminAreaDistrictId);
      delete filterData.adminAreaDistrictId;
    }
    if (filterData.adminAreaWardId && filterData.adminAreaWardId.length > 0) {
      queryBuilder.whereIn('areaWardId', filterData.adminAreaWardId);
      delete filterData.adminAreaWardId;
    }
  }
  if (filterDataClause.startLandRealitySquare) {
    queryBuilder.where('realEstateLandRealitySquare', '>=', filterDataClause.startLandRealitySquare);
  }

  if (filterDataClause.endLandRealitySquare) {
    queryBuilder.where('realEstateLandRealitySquare', '<=', filterDataClause.endLandRealitySquare);
  }
  if (filterDataClause.startValueSalePrice) {
    queryBuilder.where('realEstateValueSalePrice', '>=', filterDataClause.startValueSalePrice);
  }

  if (filterDataClause.endValueSalePrice) {
    queryBuilder.where('realEstateValueSalePrice', '<=', filterDataClause.endValueSalePrice);
  }
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }
  queryBuilder.where(filterData);
  queryBuilder.where({ isDeleted: 0 });
  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('activedDate', 'desc');
  }

  return queryBuilder;
}
async function customSearch(filter, fieldsGetListRealEstate, filterClause, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, filterClause, skip, limit, startDate, endDate, searchText, order);
  if (fieldsGetListRealEstate === undefined) {
    return await query.select();
  }
  return await query.select(fieldsGetListRealEstate);
}

async function customCount(filter, filterClause, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, filterClause, undefined, undefined, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function countPostOfProvinceBaseOnCountryAndTime(filter, startDate, endDate) {
  let data = DB(tableName)
    .select(`areaProvinceId as areaId`)
    .select(`areaProvinceName as areaName`)
    .where(filter)
    .count(`areaProvinceId as count`)
    .groupBy(`areaProvinceId`)
    .groupBy(`areaProvinceName`);
  if (startDate) {
    data.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    data.where('createdAt', '<=', endDate);
  }
  return await data;
}
async function countPostOfDistrictBaseOnProviceAndTime(filter, startDate, endDate) {
  let data = DB(tableName)
    .select(`areaDistrictId as areaId`)
    .select(`areaDistrictName as areaName`)
    .where(filter)
    .count(`areaDistrictId as count`)
    .groupBy(`areaDistrictId`)
    .groupBy(`areaDistrictName`);
  if (startDate) {
    data.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    data.where('createdAt', '<=', endDate);
  }
  return await data;
}

async function countPostOfWardBaseOnDistrictAndTime(filter, startDate, endDate) {
  let data = DB(tableName)
    .select(`areaWardId as areaId`)
    .select(`areaWardName as areaName`)
    .where(filter)
    .count(`areaWardId as count`)
    .groupBy(`areaWardId`)
    .groupBy(`areaWardName`);
  if (startDate) {
    data.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    data.where('createdAt', '<=', endDate);
  }
  return await data;
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  updateAll,
  customSearch,
  customCount,
  findById,
  countPostOfProvinceBaseOnCountryAndTime,
  countPostOfDistrictBaseOnProviceAndTime,
  countPostOfWardBaseOnDistrictAndTime,
};
