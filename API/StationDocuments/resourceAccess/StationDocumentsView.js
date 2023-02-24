/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Logger = require('../../../utils/logging');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { DB } = require('../../../config/database');
const tableName = 'StationDocumentsView';
const rootTableName = 'StationDocuments';
const primaryKeyField = 'stationDocumentsId';

async function createStationView() {
  const StaffTableName = 'Staff';
  const StationTableName = 'Stations';
  const fields = [
    `${rootTableName}.stationDocumentsId`,
    `${rootTableName}.documentCode`,
    `${rootTableName}.documentName`,
    `${rootTableName}.documentType`,
    `${rootTableName}.fileUrl`,
    `${rootTableName}.thumbnailUrl`,
    `${rootTableName}.fileType`,
    `${rootTableName}.documentStatus`,
    `${rootTableName}.stationsId`,
    `${rootTableName}.createdByStaffId`,
    `${rootTableName}.issuedDate`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,

    `${StaffTableName}.firstName as staffName`,
    `${StationTableName}.stationParentId`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(StaffTableName, function () {
      this.on(`${rootTableName}.createdByStaffId`, '=', `${StaffTableName}.staffId`);
    })
    .leftJoin(StationTableName, function () {
      this.on(`${rootTableName}.stationsId`, '=', `${StationTableName}.stationsId`);
    });

  await Common.createOrReplaceView(tableName, viewDefinition);
}

function initViews() {
  createStationView();
}

function find(filter, skip, limit, order) {
  return Common.find(tableName, filter, skip, limit, order);
}

function findById(id) {
  return Common.findById(tableName, primaryKeyField, id);
}

function count(filter, order) {
  return Common.count(tableName, primaryKeyField, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('documentName', 'like', `%${searchText}%`);
    });
  }

  queryBuilder.where({ isDeleted: 0 });

  queryBuilder.where(filterData);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy('createdAt', 'desc');
  }

  return queryBuilder;
}

function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  const query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return query.select();
}

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);

  let count;

  try {
    const [record] = await query.count(`${primaryKeyField} as count`);
    if (record || record === 0) {
      count = record.count;
    }
  } catch (e) {
    Logger.error('ResourceAccess', `DB COUNT ERROR: ${tableName} : ${JSON.stringify(filter)} - ${JSON.stringify(order)}`);
    Logger.error('ResourceAccess', e);
  }

  return count;
}

module.exports = {
  initViews,
  find,
  count,
  customSearch,
  customCount,
  findById,
};
