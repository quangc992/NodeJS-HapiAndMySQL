/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'CommonPlaceViews';
const primaryKeyField = 'commonPlaceId';
const rootTableName = 'CommonPlace';

async function createViews() {
  const AreaDataTable = 'AreaData';
  let fields = [
    `${rootTableName}.commonPlaceName`,
    `${rootTableName}.${primaryKeyField}`,
    `${rootTableName}.lat`,
    `${rootTableName}.lng`,
    `${rootTableName}.areaCountryId`,
    `${rootTableName}.areaProvinceId`,
    `${rootTableName}.areaDistrictId`,
    `${rootTableName}.areaWardId`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.updatedAt`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.commonPlaceType`,
    `country.areaDataName as areaCountryName`,
    `province.areaDataName as areaProvinceName`,
    `district.areaDataName as areaDistrictName`,
    `ward.areaDataName as areaWardName`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin({ country: AreaDataTable }, function () {
      this.on(`${rootTableName}.areaCountryId`, '=', `country.areaDataId`);
    })
    .leftJoin({ province: AreaDataTable }, function () {
      this.on(`${rootTableName}.areaProvinceId`, '=', `province.areaDataId`);
    })
    .leftJoin({ district: AreaDataTable }, function () {
      this.on(`${rootTableName}.areaDistrictId`, '=', `district.areaDataId`);
    })
    .leftJoin({ ward: AreaDataTable }, function () {
      this.on(`${rootTableName}.areaWardId`, '=', `ward.areaDataId`);
    });
  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initView() {
  await createViews();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (filterData.CommonPlaceName) {
    queryBuilder.where('CommonPlaceName', 'like', `%${filter.CommonPlaceName}%`);
    delete filterData.CommonPlaceName;
  }
  if (filterData.areaCountryId && filterData.areaCountryId.length > 0) {
    queryBuilder.whereIn('areaCountryId', filterData.areaCountryId);
    delete filterData.areaCountryId;
  }
  if (filterData.areaProvinceId && filterData.areaProvinceId.length > 0) {
    queryBuilder.whereIn('areaProvinceId', filterData.areaProvinceId);
    delete filterData.areaProvinceId;
  }
  if (filterData.areaDistrictId && filterData.areaDistrictId.length > 0) {
    queryBuilder.whereIn('areaDistrictId', filterData.areaDistrictId);
    delete filterData.areaDistrictId;
  }
  if (filterData.areaWardId && filterData.areaWardId.length > 0) {
    queryBuilder.whereIn('areaWardId', filterData.areaWardId);
    delete filterData.areaWardId;
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

async function customSearch(filter, skip, limit, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, order);
  return await query.select();
}

async function customCount(filter, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function findNearPlace(areaCityId, areaDistrictId, lat, lng, NEAREST_LAT_LNG) {
  let data = await DB(tableName)
    .whereNot({
      areaCityId: areaCityId,
      areaDistrictId: areaDistrictId,
    })
    .where(function () {
      this.orWhere('lng', '>=', lng - NEAREST_LAT_LNG)
        .orWhere('lng', '<=', lng + NEAREST_LAT_LNG)
        .orWhere('lat', '<=', lat + NEAREST_LAT_LNG)
        .orWhere('lat', '>=', lat - NEAREST_LAT_LNG);
    })
    .select();
  return data;
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initView,
  customSearch,
  customCount,
  findNearPlace,
};
