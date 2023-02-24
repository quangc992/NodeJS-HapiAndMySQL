/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { DB } = require('../../../config/database');
const tableName = 'CustomerVisitRecordView';
const rootTableName = 'CustomerVisitRecord';
const primaryKeyField = 'customerVisitRecordId';

async function createStationView() {
  const StationTableName = 'Stations';
  const CustomerInfoTableName = 'CustomerInfo';
  const StaffTableName = 'Staff';

  const fields = [
    `${rootTableName}.customerVisitRecordId`,
    `${rootTableName}.customerVisitRecordFullname`,
    `${rootTableName}.customerVisitRecordNote`,
    `${rootTableName}.customerVisitRecordEmail`,
    `${rootTableName}.customerVisitRecordStatus`,
    `${rootTableName}.customerVisitRecordPhoneNumber`,
    `${rootTableName}.customerVisitRecordImageUrl`,
    `${rootTableName}.customerVisitRecordPurpose`,
    `${rootTableName}.customerVisitRecordCompanyName`,
    `${rootTableName}.receiverId`,
    `${rootTableName}.receiverStationsId`,
    `${rootTableName}.customerInfoId`,
    `${rootTableName}.stationsId`,
    `${rootTableName}.staffName`,
    `${rootTableName}.customerVisitRecordIdentity`,
    `${rootTableName}.customerVisitRecordPlatenumber`,
    `${rootTableName}.createdByStaffId`,
    `${rootTableName}.proccessedByStaffId`,
    `${rootTableName}.approvedByStaffId`,
    `${rootTableName}.approvedAt`,
    `${rootTableName}.visitedAt`,
    `${rootTableName}.leaveAt`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.createdAt`,

    `${StationTableName}.stationsName as receiverStationName`,
    // `${StationTableName}.stationsAddress`,

    `${StaffTableName}.firstName as receiverName`,

    `${CustomerInfoTableName}.customerFullName`,
    `${CustomerInfoTableName}.customerClassification`,
    `${CustomerInfoTableName}.customerCompanyAddress`,
    `${CustomerInfoTableName}.customerCompanyName`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(StationTableName, function () {
      this.on(`${rootTableName}.receiverStationsId`, '=', `${StationTableName}.stationsId`);
    })
    .leftJoin(StaffTableName, function () {
      this.on(`${rootTableName}.receiverId`, '=', `${StaffTableName}.staffId`);
    })
    .leftJoin(CustomerInfoTableName, function () {
      this.on(`${rootTableName}.customerInfoId`, '=', `${CustomerInfoTableName}.customerInfoId`);
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
      this.orWhere('customerVisitRecordFullname', 'like', `%${searchText}%`)
        .orWhere('customerVisitRecordEmail', 'like', `%${searchText}%`)
        .orWhere('customerVisitRecordPhoneNumber', 'like', `%${searchText}%`);
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
    queryBuilder.where('visitedAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('visitedAt', '<=', endDate);
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

module.exports = {
  initViews,
  find,
  count,
  customSearch,
  findById,
};
