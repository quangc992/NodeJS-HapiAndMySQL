/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const primaryKeyField = 'productOrderId';

const tableName = 'ProductOrderUserViews';
const rootTableName = 'ProductOrder';

//cac field nay la optional, tuy du an co the su dung hoac khong
function optionalViewFields(table) {
  return [`${table}.memberReferIdF1`, `${table}.memberReferIdF2`, `${table}.memberReferIdF3`];
}

async function createUserTotalBetView() {
  const UserTableName = 'AppUser';
  let fields = [
    `${rootTableName}.${primaryKeyField}`,
    `${rootTableName}.subTotal`,
    `${rootTableName}.total`,
    `${rootTableName}.fee`,
    `${rootTableName}.staffId`,
    `${rootTableName}.orderStatus`,
    `${rootTableName}.orderType`,
    `${rootTableName}.customerName`,
    `${rootTableName}.customerPhone`,
    `${rootTableName}.customerIdentity`,
    `${rootTableName}.customerAddress`,
    `${rootTableName}.shippingAddress`,
    `${rootTableName}.shippingMethod`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.minOrderItemQuantity`,
    `${rootTableName}.maxOrderItemQuantity`,

    `${UserTableName}.appUserId`,
    `${UserTableName}.referUserId`,
    `${UserTableName}.referUser`,
    `${UserTableName}.username`,
    `${UserTableName}.firstName`,
    `${UserTableName}.lastName`,
    `${UserTableName}.email`,
    `${UserTableName}.memberLevelName`,
    `${UserTableName}.active`,
    `${UserTableName}.ipAddress`,
    `${UserTableName}.phoneNumber`,
  ];

  fields = fields.concat(optionalViewFields(UserTableName));

  var viewDefinition = DB.select(fields)
    .from(`${rootTableName}`)
    .leftJoin(`${UserTableName}`, function () {
      this.on(`${rootTableName}.appUserId`, '=', `${UserTableName}.appUserId`);
    });
  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createUserTotalBetView();
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
  filter.isDeleted = 0;
  return await Common.find(tableName, filter, skip, limit, order);
}

function _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = DB(tableName);
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('customerName', 'like', `%${searchText}%`)
        .orWhere('username', 'like', `%${searchText}%`)
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

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function customSum(sumField, filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return queryBuilder.sum(`${sumField} as sumResult`);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  customSearch,
  customCount,
  customSum,
};
