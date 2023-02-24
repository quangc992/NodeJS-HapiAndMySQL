/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'ProductOrderItemView';
const rootTableName = 'ProductOrderItem';
const primaryKeyField = 'productOrderItemId';

async function createProductOrderItemView() {
  const ProductTableName = 'Product';
  const ProductOrderTableName = 'ProductOrder';

  let fields = [
    `${rootTableName}.productOrderItemId`,
    `${rootTableName}.orderItemPrice`,
    `${rootTableName}.orderItemDeliveredQuantity`,
    `${rootTableName}.orderItemQuantity`,
    `${rootTableName}.productOrderId`,
    `${rootTableName}.productId`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.updatedAt`,

    `${ProductOrderTableName}.orderStatus`,
    `${ProductOrderTableName}.appUserId`,
    `${ProductOrderTableName}.minOrderItemQuantity`,
    `${ProductOrderTableName}.maxOrderItemQuantity`,

    `${ProductTableName}.productName`,
    `${ProductTableName}.quantity`,
    `${ProductTableName}.productChannel`,
    `${ProductTableName}.productCategory`,
    `${ProductTableName}.stockQuantity`,
    `${ProductTableName}.productStatus`,
    `${ProductTableName}.productCode`,
    `${ProductTableName}.staffId`,
  ];

  var viewDefinition = DB.select(fields)
    .from(`${rootTableName}`)
    .leftJoin(`${ProductTableName}`, function () {
      this.on(`${rootTableName}.productId`, '=', `${ProductTableName}.productId`);
    })
    .leftJoin(`${ProductOrderTableName}`, function () {
      this.on(`${rootTableName}.productOrderId`, '=', `${ProductOrderTableName}.productOrderId`);
    });
  Common.createOrReplaceView(tableName, viewDefinition);
}

async function initViews() {
  createProductOrderItemView();
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
  let filterData = JSON.parse(JSON.stringify(filter));

  if (searchText) {
    queryBuilder.where(function () {
      this.orWhere('productName', 'like', `%${searchText}%`).orWhere('ticketTitle', 'like', `%${searchText}%`);
    });
  }

  if (startDate) {
    queryBuilder.where('createdAt', '>=', startDate);
  }

  if (endDate) {
    queryBuilder.where('createdAt', '<=', endDate);
  }

  queryBuilder.where({ isDeleted: 0 });

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

async function customSum(sumField, filter, skip, limit, startDate, endDate, searchText, order) {
  let queryBuilder = _makeQueryBuilderByFilter(filter, skip, limit, startDate, endDate, searchText, order);
  return queryBuilder.sum(`${sumField} as sumResult`);
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
  customSum,
  findById,
};
