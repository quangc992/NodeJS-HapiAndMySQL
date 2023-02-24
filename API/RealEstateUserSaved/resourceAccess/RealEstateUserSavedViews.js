/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'RealEstateUserSavedViews';
const rootTableName = 'RealEstateViews';
const primaryKeyField = 'realEstateId';

async function createRoleStaffView() {
  const RealEstateUserSaved = 'RealEstateUserSaved';
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
    `${rootTableName}.realEstatePostTypeId`,
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
    `${rootTableName}.username`,
    `${rootTableName}.firstName`,
    `${rootTableName}.lastName`,
    `${rootTableName}.areaProvinceName`,
    `${rootTableName}.areastreetName`,
    `${rootTableName}.areaDistrictName`,
    `${rootTableName}.areaWardName`,
    `${rootTableName}.areaCountryName`,
    `${rootTableName}.realEstateJuridical`,
    `${rootTableName}.realEstateJuridicalId`,
    `${rootTableName}.realEstateFurnitureId`,
    `${rootTableName}.realEstateFurnitureName`,
    `${rootTableName}.agency`,
    `${rootTableName}.derectionHouseName`,
    `${rootTableName}.derectionBalconyName`,
    `${rootTableName}.derectionRealEstateName`,
    `${rootTableName}.contactId`,
    `${rootTableName}.contactName`,
    `${rootTableName}.shapeId`,
    `${rootTableName}.shapeName`,
    `${rootTableName}.agencyPercent`,
    `${RealEstateUserSaved}.appUserIdSaved`,
    `${RealEstateUserSaved}.isDeleted`,
  ];
  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(RealEstateUserSaved, function () {
      this.on(`${rootTableName}.realEstateId`, '=', `${RealEstateUserSaved}.realEstateId`);
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
  return await Common.updateById(tableName, { realEstateId: id }, data);
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
        .orWhere('realEstateJuridicalName', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.realEstateTitle) {
      queryBuilder.where('realEstateTitle', 'like', `%${filterData.realEstateTitle}%`);
      delete filterData.realEstateTitle;
    }

    if (filterData.realEstateDescription) {
      queryBuilder.where('realEstateDescription', 'like', `%${filterData.realEstateDescription}%`);
      delete filterData.realEstateDescription;
    }

    if (filterData.realEstateJuridicalName) {
      queryBuilder.where('realEstateJuridicalName', 'like', `%${filterData.realEstatePapersLegal}%`);
      delete filterData.realEstatePapersLegal;
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
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}
async function customSearch(filter, filterClause, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, filterClause, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, filterClause, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, filterClause, undefined, undefined, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
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
};
