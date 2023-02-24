/* Copyright (c) 2022 Toriti Tech Team https://t.me/ToritiTech */

'use strict';
require('dotenv').config();
const { DB } = require('../../../config/database');
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = 'ExchangePaymentMappingOrderView';
const rootTableName = 'ExchangePaymentMappingOrder';
const primaryKeyField = 'exchangePaymentMappingOrderId';
async function createView() {
  const ExchangePaymentTableName = 'PaymentExchangeTransaction';
  const ProductOrderItemTableName = 'ProductOrderItem';
  const ProductOrderUserViews = 'ProductOrderUserViews';

  let fields = [
    `${primaryKeyField}`,
    `${rootTableName}.paymentExchangeTransactionId`,
    `${rootTableName}.productOrderItemId`,
    `${rootTableName}.isDeleted`,
    `${rootTableName}.isHidden`,
    `${rootTableName}.createdAt`,

    `${ExchangePaymentTableName}.paymentAmount`,
    `${ExchangePaymentTableName}.receiveAmount`,
    `${ExchangePaymentTableName}.paymentStatus`,
    `${ExchangePaymentTableName}.paymentRef`,
    `${ExchangePaymentTableName}.paymentApproveDate`,
    `${ExchangePaymentTableName}.appUserId`,

    `${ProductOrderItemTableName}.orderItemDeliveredQuantity`,
    `${ProductOrderItemTableName}.orderItemQuantity`,
    `${ProductOrderItemTableName}.productOrderId`,
    `${ProductOrderItemTableName}.orderItemPrice`,

    `${ProductOrderUserViews}.username`,
    `${ProductOrderUserViews}.orderType`,
    `${ProductOrderUserViews}.customerName`,
    `${ProductOrderUserViews}.customerPhone`,
    `${ProductOrderUserViews}.customerIdentity`,
    `${ProductOrderUserViews}.customerAddress`,
  ];

  var viewDefinition = DB.select(fields)
    .from(rootTableName)
    .leftJoin(ProductOrderItemTableName, function () {
      this.on(`${rootTableName}.productOrderItemId`, '=', `${ProductOrderItemTableName}.productOrderItemId`);
    })
    .leftJoin(ExchangePaymentTableName, function () {
      this.on(`${rootTableName}.paymentExchangeTransactionId`, '=', `${ExchangePaymentTableName}.paymentExchangeTransactionId`);
    })
    .leftJoin(ProductOrderUserViews, function () {
      this.on(`${ProductOrderItemTableName}.productOrderId`, '=', `${ProductOrderUserViews}.productOrderId`);
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

async function sumAmountDistinctByDate(filter, startDate, endDate) {
  return await Common.sumAmountDistinctByDate(tableName, 'receiveAmount', filter, startDate, endDate);
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
        .orWhere('customerName', 'like', `%${searchText}%`)
        .orWhere('customerPhone', 'like', `%${searchText}%`)
        .orWhere('customerIdentity', 'like', `%${searchText}%`)
        .orWhere('customerAddress', 'like', `%${searchText}%`);
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
  sumAmountDistinctByDate,
  findById,
};
