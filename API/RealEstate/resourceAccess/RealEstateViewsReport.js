/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { Knex, default: knex } = require('knex');
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'RealEstateViewsReport';
const rootTableName = 'RealEstate';
const primaryKeyField = 'realEstateId';

async function createRoleStaffView() {
  var viewDefinition = DB.select('realEstateId', DB.raw('MONTH(createdAt) as createdMonth')).from(rootTableName);

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
function _makeQueryBuilderByFilter(startMonth, endMonth) {
  let queryBuilder = DB(tableName);

  if (startMonth) {
    queryBuilder.where('createdMonth', '>=', startMonth);
  }

  if (endMonth) {
    queryBuilder.where('createdMonth', '<=', endMonth);
  }
  return queryBuilder;
}
async function customSearch(filter, filterClause, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, filterClause, skip, limit, startDate, endDate, searchText, order);
  return await query.select();
}

async function customCount(startMonth, endMonth) {
  let query = _makeQueryBuilderByFilter(startMonth, endMonth);
  return await query.count('createdMonth as count').select('createdMonth').from(tableName).groupBy('createdMonth');
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
