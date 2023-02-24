/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'WalletBalanceUnitView';
const rootTableName = 'Wallet';
const primaryKeyField = 'walletId';
async function createView() {
  const BalanceUnitTable = 'WalletBalanceUnit';

  let fields = [
    `${primaryKeyField}`,
    `${rootTableName}.appUserId`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.walletType`,
    `${rootTableName}.balance`,
    `${rootTableName}.walletBalanceUnitId`,
    `${rootTableName}.lastDepositAt`,
    `${rootTableName}.walletNote`,
    `${BalanceUnitTable}.walletBalanceUnitCode`,
    `${BalanceUnitTable}.walletBalanceUnitDisplayName`,
    `${BalanceUnitTable}.walletBalanceUnitAvatar`,
    `${BalanceUnitTable}.convertPrice`,
    `${BalanceUnitTable}.originalPrice`,
    `${BalanceUnitTable}.userSellPrice`,
    `${BalanceUnitTable}.agencySellPrice`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(BalanceUnitTable, function () {
      this.on(`${rootTableName}.walletBalanceUnitId`, '=', `${BalanceUnitTable}.walletBalanceUnitId`);
    });

  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createView();
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

async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  if (filter === undefined) {
    filter = {};
  }
  let filterData = JSON.parse(JSON.stringify(filter));
  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('username', 'like', `%${searchText}%`)
        .orWhere('firstName', 'like', `%${searchText}%`)
        .orWhere('phoneNumber', 'like', `%${searchText}%`)
        .orWhere('email', 'like', `%${searchText}%`);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }
  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where(filterData);

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

async function customCount(filter, skip, limit, startDate, endDate, searchText, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return await query.count(`${primaryKeyField} as count`);
}

async function findById(id) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.findById(tableName, dataId, id);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  sum,
  customSearch,
  customCount,
  findById,
};
