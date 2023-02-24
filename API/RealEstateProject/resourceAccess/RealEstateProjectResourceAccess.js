/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();

const Logger = require('../../../utils/logging');
const { DB, timestamps } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'RealEstateProject';
const primaryKeyField = 'realEstateProjectId';
async function createTable() {
  Logger.info('ResourceAccess', `createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('realEstateProjectTitle');
          table.string('listFacilityIds');
          table.integer('projectTypeId');
          table.string('introduceImage');
          table.integer('countryId');
          table.integer('provinceId');
          table.integer('districtId');
          table.integer('wardId');
          table.string('street');
          table.double('latitude');
          table.double('longitude');
          table.string('description', 10000);
          table.integer('numberOfBuilding');
          table.integer('numberOfApartment');
          table.integer('buildingDensity');
          table.string('legalStatus');
          table.integer('realEstateProjectOwner');
          table.string('constructionUnit');
          table.string('managerUnit');
          table.string('designUnit');
          table.integer('status');
          table.integer('progress');
          table.string('statusNote');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('progress');
          table.index('countryId');
          table.index('provinceId');
          table.index('districtId');
          table.index('wardId');
        })
        .then(async () => {
          Logger.info(`${tableName}`, `${tableName} table created done`);
          resolve();
        });
    });
  });
}

async function initDB() {
  await createTable();
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
async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}
async function deleteById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.deleteById(tableName, dataId);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('realEstateProjectTitle', 'like', `%${searchText}%`)
        .orWhere('street', 'like', `%${searchText}%`)
        .orWhere('description', 'like', `%${searchText}%`);
    });
  } else {
    if (filterData.realEstateProjectTitle) {
      queryBuilder.where('realEstateProjectTitle', 'like', `%${filterData.realEstateProjectTitle}%`);
      delete filterData.realEstateProjectTitle;
    }
    if (filterData.projectTypeId) {
      queryBuilder.where({
        projectTypeId: filterData.projectTypeId,
      });
      delete filterData.projectTypeId;
    }
    if (filterData.countryId) {
      queryBuilder.where({
        countryId: filterData.countryId,
      });
      delete filterData.countryId;
    }

    if (filterData.provinceId) {
      queryBuilder.where({
        provinceId: filterData.provinceId,
      });
      delete filterData.provinceId;
    }
    if (filterData.districtId) {
      queryBuilder.where({
        districtId: filterData.districtId,
      });
      delete filterData.districtId;
    }

    if (filterData.wardId) {
      queryBuilder.where({
        wardId: filterData.wardId,
      });
      delete filterData.wardId;
    }
    if (filterData.status) {
      queryBuilder.where({
        status: filterData.status,
      });
      delete filterData.status;
    }
    if (filterData.progress) {
      queryBuilder.where({
        progress: filterData.progress,
      });
      delete filterData.progress;
    }
  }
  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }
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
async function customSearch(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(filter, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  findById,
  deleteById,
  customSearch,
  customCount,
  initDB,
};
