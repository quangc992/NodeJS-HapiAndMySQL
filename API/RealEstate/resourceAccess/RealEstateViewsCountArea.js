/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'RealEstateViewsCountArea';
const rootTableName = 'RealEstate';
const primaryKeyField = 'realEstateId';
const DISTINCT_MONTH = 'distinctMonth';
async function createRoleStaffView() {
  let fields = [
    `realEstateId`,
    `realEstateValueSalePrice`,
    `areaProvinceId`,
    `areaDistrictId`,
    `isHidden`,
    `isDeleted`,
    `realEstateCategoryId`,
    `realEstateSubCategoryId`,
    `realEstateLandRealitySquare`,
    DB.raw(`MONTH(createdAt) as ${DISTINCT_MONTH}`),
    `createdAt`,
  ];

  var viewDefinition = DB.select(fields).from(rootTableName);
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
async function customSearch(filter, filterClause, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, filterClause, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, filterClause, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, filterClause, undefined, undefined, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

function _customQueryBuilder(filter, startDate, endDate) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  queryBuilder.where(filterData);

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.groupBy(DISTINCT_MONTH);
  return queryBuilder;
}

async function calculateRealEstateStatisticalPrice(filter, startDate, endDate) {
  let query = _customQueryBuilder(filter, startDate, endDate);
  return await query.select(DISTINCT_MONTH).avg({
    avgPrice: 'realEstateValueSalePrice',
    avgS: 'realEstateLandRealitySquare',
  });
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
  calculateRealEstateStatisticalPrice,
  DISTINCT_MONTH,
};
